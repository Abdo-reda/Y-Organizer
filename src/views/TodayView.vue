<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue'
import GratitudeCard from '@/components/core/cards/GratitudeCard.vue';
import MonthlyCard from '@/components/core/cards/MonthlyCard.vue';
import NotesCard from '@/components/core/cards/NotesCard.vue';
import GridCardLayout from '@/components/core/layout/GridCardLayout.vue';
import TodayHeader from '@/components/core/layout/TodayHeader.vue';
import { DEFAULT_CARD_LAYOUT } from '@/core/constants/DefaultCardLayout';
import { DateTime } from 'luxon';

const defaultValue = "item-1"

const accordionItems = [
    { value: "item-1", title: "Is it accessible?", content: "Yes. It adheres to the WAI-ARIA design pattern." },
    { value: "item-2", title: "Is it unstyled?", content: "Yes. It's unstyled by default, giving you freedom over the look and feel." },
    { value: "item-3", title: "Can it be animated?", content: "Yes! You can use the transition prop to configure the animation." },
]

const dayDate = DateTime.now();

</script>

<template>
    <div class="h-screen overflow-hidden">
        <TodayHeader :dayDate="dayDate" /> 
        <div class="w-full">

        </div>
        <main class="h-full p-4 overflow-hidden">
            <GridCardLayout :layout="DEFAULT_CARD_LAYOUT" />
        </main>
        <!-- <main class="h-full p-4">
            <div class="flex flex-col gap-4">
                <FunctionCard title="Title" sub-title="optional subtitle">
                    <template #header-left-actions>
                        //--- left actionsssssssssssssssssssssssssssssssssssss
                    </template>
                    <template #default>
                        content
                    </template>
                </FunctionCard>
                <NotesCard class="h-64" />
                <GratitudeCard />
                <MonthlyCard />
            </div>
        </main> -->
    </div>
</template>