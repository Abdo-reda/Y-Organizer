<script setup lang="ts">
import InfoCard from '@/components/common/InfoCard.vue'
import GratitudeCard from '@/components/core/GratitudeCard.vue';
import NotesCard from '@/components/core/NotesCard.vue';

const defaultValue = "item-1"

const accordionItems = [
    { value: "item-1", title: "Is it accessible?", content: "Yes. It adheres to the WAI-ARIA design pattern." },
    { value: "item-2", title: "Is it unstyled?", content: "Yes. It's unstyled by default, giving you freedom over the look and feel." },
    { value: "item-3", title: "Can it be animated?", content: "Yes! You can use the transition prop to configure the animation." },
]
</script>

<template>
    <div class="flex flex-col gap-4 m-4">
        <p> --- welcome view </p>
        <InfoCard title="Title" sub-title="optional subtitle">
             <template #header-left-actions>
                //--- left actionsssssssssssssssssssssssssssssssssssss
             </template>
             <template #default>
                content
             </template>
        </InfoCard>
        <NotesCard class="h-64" />
        <GratitudeCard />
    </div>
</template>