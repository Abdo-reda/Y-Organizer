<script setup lang="ts">
import { DayCardComponentMapper } from "@/core/enums/dayCardEnum";
import { SettingsCodeEnum } from "@/core/enums/settingsCodeEnum";
import { ICardStructure } from "@/core/interfaces/entities/ICardStructure";
import useSettings from "@/store/useSettings";
import { useResizeObserver } from '@vueuse/core'
import { GridStack } from "gridstack";
import { onMounted, useTemplateRef } from "vue";


//TODO: editable layout
//- https://github.com/SortableJS/vue.draggable.next
//- https://swapy.tahazsh.com/docs/framework-vue/ //========> The project is already under GPL license... so...
//- https://github.com/haltu/muuri
//- https://github.com/gridstack/gridstack.js/

const { fetchCardLayout, updateSetting } = useSettings()

const layout = await fetchCardLayout();
const gridContainer = useTemplateRef('grid-container')
let gridStack: GridStack | undefined;
let isStatic = false;

// function toggleResizing() {
//     isStatic = !isStatic;
//     gridStack?.setStatic(isStatic);
// }

function initGrid() {
    if (!gridContainer.value) return;
    gridStack = GridStack.init({
        alwaysShowResizeHandle: false,
        float: true,
        margin: "0.5rem",
        column: 12,
        row: 12,
        cellHeight: 0,
    }, gridContainer.value);
    gridStack.setStatic(isStatic); //TODO: remove later
    gridStack.on('change', handleGridChange)
}

function handleGridChange() {
    updateSetting(SettingsCodeEnum.DAY_LAYOUT, gridStack?.save(false) as ICardStructure[]);
}

useResizeObserver(gridContainer, (entries) => {
    const entry = entries[0];
    const { height } = entry.contentRect;
    gridStack?.cellHeight(height / 12);
});

onMounted(() => {
    initGrid();
});

</script>

<template>
    <div ref="grid-container" class="grid-stack !h-full">
        <template v-for="card in layout" :key="card.id">
            <div class="grid-stack-item" :gs-w="card.w" :gs-h="card.h" :gs-x="card.x" :gs-y="card.y"
                :gs-no-resize="isStatic" :gs-id="card.id">
                <component class="grid-stack-item-content" :is="DayCardComponentMapper[card.id]" />
            </div>
        </template>
    </div>
</template>
