<script setup lang="ts">
import { DayCardComponentMapper } from "@/core/constants/cardMapper";
import { SettingsCodeEnum } from "@/core/enums/settingsCodeEnum";
import { ICardStructure } from "@/core/interfaces/entities/ICardStructure";
import useSettings from "@/store/useSettings";
import { useResizeObserver } from "@vueuse/core";
import { GridStack } from "gridstack";
import { onMounted, useTemplateRef, watch } from "vue";

const { settings, isGridLocked, updateSetting } = useSettings();
const gridContainer = useTemplateRef("grid-container");
let gridStack: GridStack | undefined;

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
	updateSetting(SettingsCodeEnum.DAY_LAYOUT, gridStack?.save(false) as ICardStructure[]);
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
		<template v-for="card in settings.DAY_LAYOUT" :key="card.id">
			<div class="grid-stack-item" :gs-w="card.w" :gs-h="card.h" :gs-x="card.x" :gs-y="card.y" :gs-id="card.id">
				<component class="grid-stack-item-content" :is="DayCardComponentMapper[card.id]" />
			</div>
		</template>
	</div>
</template>
