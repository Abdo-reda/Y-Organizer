<script setup lang="ts">
import DayHeader from '@/components/core/layout/DayHeader.vue';
import GridCardLayout from '@/components/core/layout/GridCardLayout.vue';
import { DEFAULT_CARD_LAYOUT } from '@/core/constants/defaultDayLayout';

</script>

<template>
    <div class="h-screen flex flex-col overflow-hidden">
        <DayHeader  /> 
        <main class="flex-1 p-2">
            <GridCardLayout :layout="DEFAULT_CARD_LAYOUT" />
        </main>
    </div>
</template>