<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import ActivityDialog from '@/components/dialogs/ActivityDialog.vue';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ActivityStatusEnum } from '@/core/enums/activityStatusEnum';
import { IActivity } from '@/core/interfaces/entities/IActivity';
import useActivity from '@/store/useActivity';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'lucide-vue-next';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { computed, ref } from 'vue';

const { activities, createActivity, updateActivity } = useActivity();

const curActivity = ref<IActivity | null>(null);
const dialogOpen = ref(false);
// const todayActivites = computed(() => activities.filter(a => a.status === ActivityStatusEnum.ACTIVE));

function handleCreate(activity: IActivity) {
    createActivity(activity);
    curActivity.value = null;
    dialogOpen.value = false;
    //TODO: toast?
}

function handleUpdate(id: string, activity: IActivity) {
    updateActivity(id, activity);
    curActivity.value = null;
    dialogOpen.value = false;
}

</script>

<template>
    <FunctionCard title="Activities">
        <template #default>
            <!-- TODO: the height of the carousel depends on what? -->
            <Carousel class="m-6">
                <CarouselContent class="p-0.5">
                    <CarouselItem>
                        <div class="flex flex-col h-full select-none overflow-hidden gap-1" v-auto-animate>
                            <div class="relative flex items-center justify-center flex-1 overflow-hidden">
                                <svg viewBox="0 0 100 100" class="w-full h-full">
                                    <circle cx="50" cy="50" r="45" fill="none" class="stroke-gray-300"
                                        stroke-width="4" />
                                </svg>
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold">{{ 0 }}h</div>
                                        <div class="text-sm text-gray-500">Total</div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="activities.length" class="grid grid-cols-2 grid-rows-2 m-1 gap-2" v-auto-animate>
                                <div v-for="activity in activities" :key="activity.name"
                                    class="flex items-center justify-between p-1 px-2 group rounded-md hover:bg-gray-50 hover:ring-1 ring-muted-hover duration-300 transition-all group"
                                    :style="{ '--color-hover': activity.color }">
                                    <div class="flex items-center gap-3 min-w-0 flex-1">
                                        <div class="size-3 rounded-full" :style="{ backgroundColor: activity.color }">
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <div class="flex justify-between items-center gap-2">
                                                <div class="font-medium text-gray-900 truncate">{{ activity.name }}
                                                </div>
                                                <div class="flex items-center gap-1 flex-shrink-0 text-sm">
                                                    <span
                                                        class="group-hover:text-hover transition-colors duration-300">{{
                                                            4
                                                        }}h</span> •
                                                    <span
                                                        class="group-hover:text-hover transition-colors duration-300">{{
                                                            2
                                                        }}%</span>
                                                </div>
                                            </div>
                                            <div class="text-sm text-gray-500 truncate">{{ activity.description }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div class="flex flex-col h-full gap-2">
                            <div v-for="activity in activities" :key="activity.name"
                                class="flex items-center justify-between p-1 px-2 group rounded-md hover:bg-gray-50 hover:ring-1 ring-muted-hover duration-300 transition-all group"
                                :style="{ '--color-hover': activity.color }">
                                <div class="flex items-center gap-3 min-w-0 flex-1">
                                    <div class="size-3 rounded-full" :style="{ backgroundColor: activity.color }">
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <div class="flex justify-between items-center gap-2">
                                            <div class="font-medium text-gray-900 truncate">{{ activity.name }}
                                            </div>
                                        </div>
                                        <div class="text-sm text-gray-500 truncate">{{ activity.description }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                </CarouselContent>
                <!-- <CarouselPrevious variant="ghost"
                    class="size-6 text-gray-400 disabled:opacity-0 left-0 -translate-x-full">
                    <ChevronLeftIcon />
                </CarouselPrevious>
                <CarouselNext variant="ghost" class="size-6 text-gray-400 disabled:opacity-0 right-0 translate-x-full">
                    <ChevronRightIcon />
                </CarouselNext> -->
            </Carousel>
        </template>
        <!-- <circle v-for="(activity, index) in activitiesWithData" :key="activity.id" cx="100" cy="100"
                            r="80" fill="none" :stroke="activity.color" stroke-width="12"
                            :stroke-dasharray="`${activity.circumference} ${totalCircumference}`"
                            :stroke-dashoffset="activity.offset"
                            class="transition-all duration-500 hover:stroke-width-16 cursor-pointer"
                            @click="openEditModal(activity)" /> -->
        <template #header-right-actions>
            <div class="flex justify-end gap-1">
                <Dialog v-model:open="dialogOpen">
                    <DialogTrigger>
                        <Button variant="ghost" size="icon">
                            <PlusIcon />
                        </Button>
                    </DialogTrigger>
                    <ActivityDialog :existing-activity="curActivity" @create="handleCreate" @update="handleUpdate" />
                </Dialog>
            </div>
        </template>
    </FunctionCard>
</template>