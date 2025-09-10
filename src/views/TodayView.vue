<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue'
import GratitudeCard from '@/components/core/GratitudeCard.vue';
import MonthlyCard from '@/components/core/MonthlyCard.vue';
import NotesCard from '@/components/core/NotesCard.vue';
import TodayHeaderCard from '@/components/core/TodayHeaderCard.vue';
import { DateTime } from 'luxon';

//TODO: editable layout
//- https://github.com/SortableJS/vue.draggable.next
//- https://swapy.tahazsh.com/docs/framework-vue/ //========> MIGHT HAVE ISSUES WITH LICENSE

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
        <TodayHeaderCard :date="dayDate" /> 
        <main class="h-full">
            <div class="flex flex-col gap-4 m-4">
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
        </main>
    </div>
</template>