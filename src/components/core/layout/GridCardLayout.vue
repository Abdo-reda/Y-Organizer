<script setup lang="ts">
import { ICardStructure } from "@/core/interfaces/entities/ICardStructure";
import { useResizeObserver } from '@vueuse/core'
import { GridStack } from "gridstack";
import { onMounted, useTemplateRef } from "vue";


//TODO: editable layout
//- https://github.com/SortableJS/vue.draggable.next
//- https://swapy.tahazsh.com/docs/framework-vue/ //========> The project is already under GPL license... so...
//- https://github.com/haltu/muuri
//- https://github.com/gridstack/gridstack.js/
interface IGridCardLayoutProps {
    layout: ICardStructure[];
}

defineProps<IGridCardLayoutProps>();

const gridContainer = useTemplateRef('grid-container')
let gridStack: GridStack | undefined;
let isStatic = false;

function toggleResizing() {
    isStatic = !isStatic;
    gridStack?.setStatic(isStatic);
}


useResizeObserver(gridContainer, (entries) => {
    const entry = entries[0];
    const { height } = entry.contentRect;
    gridStack?.cellHeight(height / 12);
});

onMounted(() => {
    gridStack = GridStack.init({
        alwaysShowResizeHandle: false,
        margin: "0.5rem",
        column: 12,
        row: 12,
        cellHeight: 0,
    });
});

</script>

<template>
    <div ref="grid-container" class="grid-stack !h-full">
        <template v-for="(card, index) in layout" :key="index">
            <div class="grid-stack-item" :gs-w="card.width" :gs-h="card.height" :gs-no-resize="isStatic">
                <component class="grid-stack-item-content" :is="card.component" />
            </div>
        </template>
    </div>
</template>
