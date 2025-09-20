<script setup lang="ts">
import FunctionCard from "@/components/common/FunctionCard.vue";
import { useMouseShortcuts } from "@/composables/useMouseShortcuts";
import { useDrauu } from "@vueuse/integrations/useDrauu";
import { ref, useTemplateRef } from "vue";
import { Button } from "@/components/ui/button";
import { BrushCleaningIcon, BrushIcon, EraserIcon, SaveIcon } from "lucide-vue-next";
import { DateTime } from "luxon";
import { useResizeObserver } from "@vueuse/core";

//TODO:
// - context menu? https://www.shadcn-vue.com/docs/components/context-menu?
// - handle shortcuts? redo, undo, change color and so on...
// - should colors or brush color depend on activity color/primary color
// '--tw-ring-color': `color-mix(in oklab, ${color} 25%, transparent)`

const canvasDrawer = useTemplateRef<HTMLCanvasElement>("canvas-drawer");
const fileSaver = useTemplateRef<HTMLAnchorElement>("file-saver");
const drawContainer = useTemplateRef<HTMLElement>("draw-container");
const drawArea = useTemplateRef<SVGSVGElement>("draw-area");
const drawAreaWidth = ref(0);
const drawAreaHeight = ref(0);

useResizeObserver(drawArea, (entries) => {
    const entry = entries[0];
    const { width, height } = entry.contentRect;
    drawAreaWidth.value = width;
    drawAreaHeight.value = height;
});

const { undo, redo, canUndo, canRedo, brush, clear } = useDrauu(drawArea, {
	brush: {
		color: "var(--primary)",
		size: 3,
	},
});
const colors = ["oklch(14.5% 0 0)", "oklch(63.7% 0.237 25.331)", "oklch(72.3% 0.219 149.579)", "oklch(68.5% 0.169 237.323)"];

useMouseShortcuts(
	drawContainer,
	{
		onPrimaryClick: () => drawMode(),
		onSecondaryClick: () => eraseMode(),
		onMiddleMouseClick: (e) => {
			clear();
			e.stopPropagation();
		},
		onCtrlClick: () => lineMode(),
		onAltClick: () => saveSvgAsPng(),
	},
	{ capture: true }
);

function lineMode() {
	brush.value.mode = "line";
}

function drawMode() {
	brush.value.mode = "draw";
}

function eraseMode() {
	brush.value.mode = "eraseLine";
}

function saveSvg() {
	if (!fileSaver.value) return;
	const svgUrl = URL.createObjectURL(new Blob([drawArea.value?.outerHTML ?? ""], { type: "image/svg+xml" }));
	fileSaver.value.href = svgUrl;
	fileSaver.value.download = `doodle_${DateTime.now().toISODate()}`;
	fileSaver.value.click();
	URL.revokeObjectURL(svgUrl);
}

function saveSvgAsPng() {
	if (!drawArea.value) return;
	const serializedSvg = new XMLSerializer().serializeToString(drawArea.value);
	const svgUrl = URL.createObjectURL(new Blob([serializedSvg], { type: "image/svg+xml" }));
	const doodleImage = new Image();
	doodleImage.onload = () => {
		if (!canvasDrawer.value || !fileSaver.value) return;
		canvasDrawer.value.width = drawAreaWidth.value;
		canvasDrawer.value.height = drawAreaHeight.value;
		const drawContext = canvasDrawer.value.getContext("2d");
		drawContext?.clearRect(0, 0, canvasDrawer.value.width, canvasDrawer.value.height);
		drawContext?.drawImage(doodleImage, 0, 0);
		const pngUrl = canvasDrawer.value.toDataURL("image/png");
		fileSaver.value.href = pngUrl;
		fileSaver.value.download = `doodle_${DateTime.now().toISODate()}`;
		fileSaver.value.click();
		URL.revokeObjectURL(svgUrl);
	};
	doodleImage.src = svgUrl;
    //TODO: snackbar... succefully downloaded and get path somehow 
}

function setColor(color: string) {
	brush.value.color = color;
}
</script>
<template>
	<FunctionCard title="Doodle">
		<template #header-left-actions>
			<div class="flex gap-1 md:gap-2 mx-2">
				<button
					@click="setColor(color)"
					v-for="color in colors"
					:key="color"
					class="rounded-full shadow-sm ring-0 ring-gray-200 w-1/6 max-w-6 min-w-3 aspect-square transition-shadow"
					:style="{ backgroundColor: color }"
					:class="{
						'ring-3': brush.color === color,
					}"
				></button>
			</div>
		</template>
		<template #default>
			<div ref="draw-container" class="size-full p-1 rounded-lg dot-background relative">
				<svg ref="draw-area" :viewBox="`0 0 ${drawAreaWidth} ${drawAreaHeight}`" @contextmenu.prevent class="size-full rounded-lg" xmlns="http://www.w3.org/2000/svg"></svg>
				<canvas ref="canvas-drawer" class="hidden absolute" />
			</div>
			<a ref="file-saver" class="hidden absolute" />
		</template>
		<template #header-right-actions>
			<!-- <div class="flex justify-end gap-2 mx-4">
        <Button @click="drawMode" variant="ghost" class="size-6 rounded-full text-gray-400 hover:text-primary transition-colors">
          <BrushIcon />
        </Button>
        <Button @click="eraseMode" variant="ghost" class="size-6 rounded-full text-gray-400 hover:text-primary transition-colors">
          <EraserIcon />
        </Button>
        <Button @clikc="clear" variant="ghost" class="size-6 rounded-full text-gray-400 hover:text-primary transition-colors">
          <BrushCleaningIcon />
        </Button>
        <Button @click="saveSvg" variant="ghost" class="size-6 rounded-full text-gray-400 hover:text-primary transition-colors">
          <SaveIcon />
        </Button>
      </div> -->
		</template>
	</FunctionCard>
</template>
