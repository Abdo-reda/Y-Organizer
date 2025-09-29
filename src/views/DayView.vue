<script setup lang="ts">
import DayGridCardLayout from '@/components/core/layout/DayGridCardLayout.vue';
import DayHeader from '@/components/core/layout/DayHeader.vue';
import useActivity from '@/store/useActivity';
import useSettings from '@/store/useSettings';

// TODO: fix transitoin between routes... remove routes?

const { fetchSettings } = useSettings();
const { fetchActivities } = useActivity();

//TODO: either do a loading state, or have a suspense and await, or a laoding screen or whatever... fuck this shit.
await fetchSettings();
await fetchActivities();
</script>

<template>
    <div class="h-full flex flex-col overflow-hidden">
        <DayHeader  /> 
        <main class="flex-1 px-2 pb-2">
            <DayGridCardLayout />
        </main>
    </div>
</template>