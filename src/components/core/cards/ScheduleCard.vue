<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import { useResizeObserver } from '@vueuse/core'
import { GridStack } from "gridstack";
import { onMounted, useTemplateRef } from "vue";

const gridContainer = useTemplateRef('schedule-container')
let gridStack: GridStack | undefined;
let isStatic = false;

function toggleResizing() {
    isStatic = !isStatic;
    gridStack?.setStatic(isStatic);
}

function initGrid() {
    if (!gridContainer.value) return;
    gridStack = GridStack.init({
        alwaysShowResizeHandle: false,
        float: true,
        margin: "0.15rem",
        column: 1,
        row: 24,
        cellHeight: 0,
    }, gridContainer.value);
    gridStack.setStatic(isStatic); //TODO: remove later
}

useResizeObserver(gridContainer, (entries) => {
    const entry = entries[0];
    const { height } = entry.contentRect;
    gridStack?.cellHeight(height / 24);
});

onMounted(() => {
    initGrid();
});
</script>

<template>
    <FunctionCard title="Schedule">
        <template #default>
            <div class="flex h-full">
                <div class="h-full flex flex-col">
                    <template v-for="i in 24" :key="i">
                        <!-- <div class="flex-1 flex items-center justify-center">
                            <p class="text-xs text-gray-500 font-semibold"> {{ (i - 1) }}:00 </p>
                        </div> -->
                        <div class="flex-1 flex flex-col items-center justify-between">
                            <p class="text-xs text-gray-500 font-semibold -translate-y-1/2"> {{ (i - 1) }}:00 </p>
                            <p v-if="i == 24" class="text-xs text-gray-500 font-semibold translate-y-1.5"> {{ i }}:00
                            </p>
                        </div>
                    </template>
                </div>
                <div ref="schedule-container" class="!h-full grid-stack flex-1 relative">
                    <div class="absolute h-full w-full flex flex-col px-1">
                        <template v-for="i in 24" :key="i">
                            <div class="flex-1 px-0.5 py-1">
                                <div class="rounded-sm bg-gray-50 p-1 border border-dashed h-full">

                                </div>
                            </div>
                        </template>
                    </div>
                    <template v-for="i in 2" :key="i">
                        <div class="grid-stack-item" :gs-h="1" :gs-no-resize="isStatic">
                            <div class="rounded-sm bg-red-600 p-1 border border-dashed flex-1 grid-stack-item-content">
                                active slot {{ i }}
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </FunctionCard>
</template>
