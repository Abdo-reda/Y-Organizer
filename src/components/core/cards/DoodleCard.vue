<script setup lang="ts">
import FunctionCard from "@/components/common/FunctionCard.vue";
import { useMouseShortcuts } from "@/composables/useMouseShortcuts";
import { useDrauu } from "@vueuse/integrations/useDrauu";
import { useTemplateRef } from "vue";
import { Button } from "@/components/ui/button";
import { BrushCleaningIcon, BrushIcon, EraserIcon, SaveIcon } from "lucide-vue-next";

//TODO:
// - context menu? https://www.shadcn-vue.com/docs/components/context-menu?
// - handle shortcuts? redo, undo, change color and so on...
// - should colors or brush color depend on activity color/primary color

const fileSaver = useTemplateRef<HTMLAnchorElement>("file-saver");
const drawContainer = useTemplateRef<HTMLElement>("draw-container");
const drawArea = useTemplateRef<SVGSVGElement>("draw-area");
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
    onAltClick: () => saveSvg(),
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
  fileSaver.value.download = "doodle.svg";
  fileSaver.value.click();
  URL.revokeObjectURL(svgUrl);
}

function setColor(color: string) {
  brush.value.color = color;
}
</script>

<template>
  <FunctionCard title="Doodle">
    <template #header-left-actions>
      <div class="flex gap-2 mx-4">
        <button
          @click="setColor(color)"
          v-for="color in colors"
          :key="color"
          class="rounded-full shadow-sm ring-0 ring-gray-200 size-6 transition-shadow"
          :style="{ backgroundColor: color }"
          :class="{
            'ring-3': brush.color === color,
          }"
        ></button>
      </div>
    </template>
    <template #default>
      <div ref="draw-container" class="size-full p-1 rounded-lg dot-background relative">
        <svg ref="draw-area" @contextmenu.prevent class="size-full rounded-lg" xmlns="http://www.w3.org/2000/svg"></svg>
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
