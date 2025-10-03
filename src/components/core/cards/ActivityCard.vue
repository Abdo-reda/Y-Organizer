<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import ActivityDialog from '@/components/dialogs/ActivityDialog.vue';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ActivityStatusEnum } from '@/core/enums/activityStatusEnum';
import { IActivity, ISessionActivity } from '@/core/interfaces/entities/IActivity';
import useActivity from '@/store/useActivity';
import { ArchiveIcon, CheckCheckIcon, CircleIcon, PlusIcon } from 'lucide-vue-next';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel'
import { computed, ref } from 'vue';
import { LifeCategoryIconMapper } from '@/core/enums/lifeCategoryEnum';
import useDaySessions from '@/store/useDaySessions';

//TODO: make the activities sorted by status and must add animation when changing status (list animation)
//Note: if we add animation with caresoul, there are two issues. first we will need to add v-auto-animate to the inner div, which fucks things up. And second issue, is that when there is transition from previous carousel, the animation is weird. So, possible solutions here.
//- handleActivity should return if the transition is still going.
//- use Transition instead of v-auto-aniamte and see if that fixes the problem.

const CIRCUMFERENCE = 2 * Math.PI * 45;
const { sessions } = useDaySessions();
const { activities, createActivity, updateActivity, deleteActivity } = useActivity();
const editActivity = ref<IActivity | null>(null);
const dialogOpen = ref(false);
const sessionsData = computed(() => {
    let totalDuration = 0;
    const activityDurations: Record<string, number> = {};
    const todayActivites = new Set<string>();
    sessions.forEach(session => {
        const activity = session.activity;
        const duration = session.endTime.diff(session.startTime, 'minutes').minutes;
        totalDuration += duration;
        activityDurations[activity] = (activityDurations[activity] || 0) + duration;
        todayActivites.add(activity);
    });

    return {
        totalDuration,
        activityDurations,
        todayActivites,
    };
});
const sessionActivities = computed(() => {
    let sessionActivites: ISessionActivity[] = [];
    let activityOffset = 0;
    activities.forEach(a => {
        if (sessionsData.value.todayActivites.has(a.name)) {
            const activityDuration = sessionsData.value.activityDurations[a.name];
            const activityRatio = Math.round(activityDuration * 100 / sessionsData.value.totalDuration);
            sessionActivites.push({ ...a, duration: activityDuration, ratio: activityRatio, offset: activityOffset });
            activityOffset += activityRatio;
        }
    })
    return sessionActivites;
});

const sortedActivites = computed(() => activities.sort((a, b) => a.name.localeCompare(b.name)));

function handleActivity(event: PointerEvent, activity: IActivity) {
    switch (event.button) {
        case 0:
            if (event.ctrlKey) {
                editActivity.value = activity;
                dialogOpen.value = true;
            } else if (event.altKey) {
                activity.status = activity.status === ActivityStatusEnum.COMPLETED ? ActivityStatusEnum.ACTIVE : ActivityStatusEnum.COMPLETED;
            } else {
                return;
            }
            break;
        case 2:
            if (event.altKey) {
                deleteActivity(activity.name);
                return;
            } else {
                activity.status = activity.status === ActivityStatusEnum.DISABLED ? ActivityStatusEnum.ACTIVE : ActivityStatusEnum.DISABLED;
            }
            break;
    }

    updateActivity(activity.name, activity);
}

function handleCreate(activity: IActivity) {
    createActivity(activity);
    editActivity.value = null;
    dialogOpen.value = false;
    //TODO: toast?
}

function handleUpdate(id: string, activity: IActivity) {
    updateActivity(id, activity);
    editActivity.value = null;
    dialogOpen.value = false;
}

</script>

<template>
    <FunctionCard title="Activities">
        <template #default>
            <Carousel>
                <CarouselContent>
                    <CarouselItem>
                        <div class="flex flex-col h-full select-none overflow-hidden gap-1" v-auto-animate>
                            <div class="relative flex items-center justify-center flex-1 overflow-hidden">
                                <svg viewBox="0 0 100 100" class="w-full h-full">
                                    <circle v-if="!sessionActivities.length" cx="50" cy="50" r="45" fill="none" class="stroke-gray-300"
                                        stroke-width="4" />
                                    <circle v-for="activity in sessionActivities" :key="activity.name" cx="50" cy="50" r="45" fill="none" :stroke="activity.color" stroke-width="4" stroke-linecap="round" 
                                    :stroke-dasharray="`${(activity.ratio / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`" 
                                    :stroke-dashoffset="-(CIRCUMFERENCE * activity.offset / 100)" 
                                    class="transition-all duration-500" />
                                </svg>
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold">{{ sessionsData.totalDuration / 60 }}h</div>
                                        <div class="text-sm text-gray-500">Total</div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="sessionActivities.length" class="grid grid-cols-2 m-1 gap-1" v-auto-animate>
                                <div v-for="activity in sessionActivities" :key="activity.name"
                                    class="flex items-center justify-between p-1 px-2 group rounded-md hover:bg-gray-50 hover:ring-1 ring-hover/20 duration-300 transition-all group"
                                    :style="{ '--color-hover': activity.color }">
                                    <div class="flex items-center gap-3 min-w-0 flex-1">
                                        <div class="size-3 rounded-full" :style="{ backgroundColor: activity.color }">
                                        </div>
                                        <div class="min-w-0 flex-1 flex justify-between items-center gap-2">
                                            <p class="font-medium text-gray-900 truncate">{{ activity.name }}</p>
                                            <p class="flex items-center gap-1 text-sm">
                                                <span class="transition-colors duration-300 group-hover:text-hover"> {{
                                                    activity.duration / 60 }}h </span> 
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem @contextmenu.prevent>
                        <Carousel v-if="sortedActivites.length" orientation="vertical" class="w-full"
                            :opts="{ align: 'start' }">
                            <CarouselContent class="-mt-1 p-2 select-none">
                                <CarouselItem v-for="activity in sortedActivites" :key="activity.name"
                                    class="pt-1 md:basis-1/5">
                                    <div @pointerdown="handleActivity($event, activity)"
                                        class="flex items-center justify-between p-1 px-2 group rounded-md hover:bg-gray-50 hover:ring-1 ring-hover duration-300 transition-all group"
                                        :class="{ 'opacity-60 ': activity.status === ActivityStatusEnum.DISABLED }"
                                        :style="{ '--color-hover': activity.color }">
                                        <div class="flex items-center gap-3 min-w-0 flex-1">
                                            <div :style="{ color: activity.color }">
                                                <CircleIcon v-if="activity.status === ActivityStatusEnum.ACTIVE"
                                                    class="size-4" stroke-width="0" :fill="activity.color" />
                                                <CheckCheckIcon
                                                    v-else-if="activity.status === ActivityStatusEnum.COMPLETED"
                                                    class="size-4" />
                                                <ArchiveIcon v-else class="size-4" />
                                            </div>
                                            <div class="min-w-0 flex-1">
                                                <p class="font-medium text-gray-900 truncate w-fit strikethrough"
                                                    :class="{
                                                        'has-strikethrough': activity.status === ActivityStatusEnum.COMPLETED,
                                                    }">{{ activity.name }}
                                                </p>
                                                <p class="text-sm text-gray-500 truncate">{{ activity.description }}</p>
                                            </div>
                                        </div>
                                        <div class="flex gap-1">
                                            <component v-for="category in activity.categories"
                                                :is="LifeCategoryIconMapper[category]" class="size-3.5 text-hover" />
                                        </div>
                                    </div>
                                </CarouselItem>
                            </CarouselContent>
                        </Carousel>
                        <div v-else class="h-full flex items-center w-full">
                            <div @click="dialogOpen = true"
                                class="w-full h-full p-4 m-2 border-2 border-dashed border-gray-300 rounded-sm text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm duration-300 select-none">
                                <PlusIcon class="size-4" />
                                <p> Create Your First Activity </p>
                            </div>
                        </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </template>
        <template #header-right-actions>
            <div class="flex justify-end gap-1">
                <Dialog v-model:open="dialogOpen">
                    <DialogTrigger>
                        <Button variant="ghost" size="icon">
                            <PlusIcon />
                        </Button>
                    </DialogTrigger>
                    <ActivityDialog :existing-activity="editActivity" @create="handleCreate" @update="handleUpdate" />
                </Dialog>
            </div>
        </template>
    </FunctionCard>
</template>

<style lang="css" scoped>
.strikethrough {
    position: relative;
    white-space: nowrap;
}

.strikethrough:after {
    border-top: 1px solid var(--color-gray-900);
    position: absolute;
    content: "";
    top: 50%;
    left: 0;
    width: 0;
    transition: width 0.2s ease-out;
}

.has-strikethrough:after {
    width: 100%;
}
</style>