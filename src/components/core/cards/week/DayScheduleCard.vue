<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import { LifeCategoryIconMapper } from '@/core/enums/lifeCategoryEnum';
import { ISession } from '@/core/interfaces/entities/ISession';
import useActivity from '@/store/useActivity';
import useWeekSessions from '@/store/useWeekSessions';
import { DateTime } from 'luxon';

interface IDayScheduleProps {
    date: DateTime<true>;
}

const props = defineProps<IDayScheduleProps>();

const { sessions, fetchSessions } = useWeekSessions();
const { activities } = useActivity();

fetchSessions(props.date);

function handleSessionPrimary(event: MouseEvent, session: ISession) {
    // switch (event.button) {
    //     case 0:
    //         if (event.ctrlKey) {
    //             sessionPopoverAnchor.value = event.currentTarget as ReferenceElement;
    //             editSession.value = session;
    //             editSessionPopoverOpen.value = true;
    //         } else if (event.altKey) {
    //             session.status = getNextStatus(session.status);
    //             updateSession(session.id, session);
    //         } else {
    //             sessionPopoverAnchor.value = event.currentTarget as ReferenceElement;
    //             editSession.value = session;
    //             previewSessionPopoverOpen.value = true;
    //         }
    //         break;
    // }
}
</script>
<template>
    <FunctionCard :title="date.weekdayLong" :sub-title="`${date.day}\`${date.monthShort}`">
        <template #default>
            <div class="h-full overflow-hidden grid schedule-grid gap-1">
                <template v-for="session in sessions" :key="session.id">
                    <div
                        :style="{ '--color-hover': activities.find(a => a.name === session.activity)?.color ?? 'var(--primary)', gridRow: `${session.startTime.hour+1} / ${session.endTime.hour === 0 ? 25 : session.endTime.hour+1}` }">
                        <div @click="handleSessionPrimary($event, session)"
                            class="relative rounded-sm h-full flex-1 !overflow-hidden hover:ring-1 ring-muted-foreground/85 transition-shadow bg-hover">
                            <div class="flex items-start justify-between gap-1">
                                <p class="capitalize text-black font-extrabold text-xl px-1 opacity-30"> {{
                                    session.activity }} </p>
                            </div>
                            <div class="absolute opacity-15 left-0 -mx-2 flex">
                                <component
                                    v-for="category in activities.find(a => a.name === session.activity)?.categories ?? []"
                                    :is="LifeCategoryIconMapper[category]" class="size-8 text-black" />
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </FunctionCard>
</template>

<style lang="css" scoped>

.schedule-grid {
    grid-template-rows: repeat(24, 1fr);
}
</style>