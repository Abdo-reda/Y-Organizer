<script setup lang="ts">
import GridCardLayout from '@/components/core/layout/GridCardLayout.vue';
import TodayHeader from '@/components/core/layout/TodayHeader.vue';
import { DEFAULT_CARD_LAYOUT } from '@/core/constants/DefaultCardLayout';

</script>

<template>
    <div class="h-screen flex flex-col overflow-hidden">
        <TodayHeader  /> 
        <main class="flex-1 p-2">
            <GridCardLayout :layout="DEFAULT_CARD_LAYOUT" />
        </main>
    </div>
</template>