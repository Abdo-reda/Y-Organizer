<script setup lang="ts">
import DayGridCardLayout from '@/components/core/layout/DayGridCardLayout.vue';
import DayHeader from '@/components/core/layout/DayHeader.vue';
import useActivity from '@/store/useActivity';
import useDayState from '@/store/useDayState';
import useSettings from '@/store/useSettings';
import useTasks from '@/store/useTasks';
import { watch } from 'vue';

// TODO: fix transitoin between routes... remove routes?

const { selectedDay } = useDayState();
const { fetchSettings } = useSettings();
const { fetchActivities } = useActivity();
const { fetchTasks } = useTasks();

//TODO: either do a loading state, or have a suspense and await, or a laoding screen or whatever... fuck this shit.
fetchSettings();
fetchActivities();
watch(selectedDay, () => fetchTasks(selectedDay.value));

</script>

<template>
    <div class="h-full flex flex-col overflow-hidden">
        <DayHeader  /> 
        <main class="flex-1 px-2 pb-2">
            <DayGridCardLayout />
        </main>
    </div>
</template>