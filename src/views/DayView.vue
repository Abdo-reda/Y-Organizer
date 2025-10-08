<script setup lang="ts">
import DayGridCardLayout from '@/components/core/layout/DayGridCardLayout.vue';
import DayHeader from '@/components/core/layout/DayHeader.vue';
import useActivity from '@/store/useActivity';
import { useCurrentTime } from '@/store/useCurrentTime';
import useDayState from '@/store/useDayState';
import useMonthlyGoals from '@/store/useMonthlyGoals';
import useSettings from '@/store/useSettings';
import useTasks from '@/store/useTasks';
import { watch } from 'vue';

// TODO: fix transitoin between routes... remove routes?

const { currentTime } = useCurrentTime();
const { selectedDay, initDay } = useDayState();
const { fetchSettings } = useSettings();
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
    fetchGoals(day);
}, {immediate: true});

</script>

<template>
    <div class="h-full flex flex-col overflow-hidden">
        <DayHeader  /> 
        <main class="flex-1 px-2 pb-2">
            <DayGridCardLayout />
        </main>
    </div>
</template>