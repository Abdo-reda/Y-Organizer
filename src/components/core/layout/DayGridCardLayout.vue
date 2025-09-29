<script setup lang="ts">
import { DayCardComponentMapper } from "@/core/enums/dayCardEnum";
import { ICardStructure } from "@/core/interfaces/entities/ICardStructure";
import useDayGrid from "@/store/useDayGrid";
import { useResizeObserver } from "@vueuse/core";
import { GridStack } from "gridstack";
import { onMounted, useTemplateRef, watch } from "vue";

//TODO: editable layout
//- https://github.com/SortableJS/vue.draggable.next
//- https://swapy.tahazsh.com/docs/framework-vue/ //========> The project is already under GPL license... so...
//- https://github.com/haltu/muuri
//- https://github.com/gridstack/gridstack.js/

const { gridLayout, isGridLocked, updateGridLayout } = useDayGrid();
const gridContainer = useTemplateRef("grid-container");
let gridStack: GridStack | undefined;

// function toggleResizing() {
//     isStatic = !isStatic;
//     gridStack?.setStatic(isStatic);
// }

function initGrid() {
	if (!gridContainer.value) return;
	gridStack = GridStack.init(
		{
			alwaysShowResizeHandle: false,
			float: true,
			margin: "0.5rem",
			column: 12,
			row: 12,
			cellHeight: 0,
		},
		gridContainer.value
	);
	gridStack.on("change", handleGridChange);
    setGridLock(isGridLocked.value);
}

function handleGridChange() {
	updateGridLayout(gridStack?.save(false) as ICardStructure[]);
}

function setGridLock(lock: boolean) {
    if (lock) gridStack?.disable()
    else gridStack?.enable();
}

watch(isGridLocked, (lock) => setGridLock(lock));

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
		<template v-for="card in gridLayout" :key="card.id">
			<div class="grid-stack-item" :gs-w="card.w" :gs-h="card.h" :gs-x="card.x" :gs-y="card.y" :gs-id="card.id">
				<component class="grid-stack-item-content" :is="DayCardComponentMapper[card.id]" />
			</div>
		</template>
	</div>
</template>
