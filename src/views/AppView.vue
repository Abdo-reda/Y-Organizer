<script setup lang="ts">
import AppHeader from '@/components/core/layout/AppHeader.vue';
import useActivity from '@/store/useActivity';
import { useCurrentTime } from '@/store/useCurrentTime';
import useDayState from '@/store/useDayState';
import useMonthlyGoals from '@/store/useMonthlyGoals';
import useSettings from '@/store/useSettings';
import useTasks from '@/store/useTasks';
import { watch } from 'vue';
import DayView from './DayView.vue';
import WeekView from './WeekView.vue';

// TODO: fix transitoin between routes... remove routes?

const { currentTime } = useCurrentTime();
const { selectedDay, initDay } = useDayState();
const { appView, fetchSettings } = useSettings();
const { fetchActivities } = useActivity();
const { fetchTasks } = useTasks();
const { fetchGoals } = useMonthlyGoals();
//TODO: either do a loading state, or have a suspense and await, or a laoding screen or whatever... fuck this shit.

await fetchSettings();
await fetchActivities();
watch(currentTime, (time, oldTime) => {
    if (!time.hasSame(oldTime, 'day')) selectedDay.value = time.startOf('day')
});
watch(selectedDay, (day) => {
    initDay(day);
    fetchTasks(day);
    fetchGoals();
}, {immediate: true});

</script>

<template>
    <div class="h-full flex flex-col overflow-hidden">
        <AppHeader  /> 
        <main class="flex-1 px-2 pb-2 overflow-hidden relative">
            <TransitionGroup name="auto">
                <DayView v-if="appView === 'day'" key="day" />
                <WeekView v-else-if="appView === 'week'" key="week" />
            </TransitionGroup>
        </main>
    </div>
</template>