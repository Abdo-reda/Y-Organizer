<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import { useMouseShortcuts } from '@/composables/useMouseShortcuts';
import { toRefs } from '@vueuse/core';
import { useDrauu } from '@vueuse/integrations/useDrauu';
import { useTemplateRef } from 'vue';

//TODO: 
// - context menu? https://www.shadcn-vue.com/docs/components/context-menu?
// - handle shortcuts? redo, undo, change color and so on...
// - should colors or brush color depend on activity color/primary color

const drawArea = useTemplateRef<SVGSVGElement>('draw-area');
const { undo, redo, canUndo, canRedo, brush, clear, dump } = useDrauu(drawArea, {
    brush: {
        color: "var(--primary)",
        size: 3
    }
});

function drawMode() {
    brush.value.mode = 'draw'
}

function eraseMode() {
    console.log('--- erase mode')
    brush.value.mode = 'eraseLine';
}

function handleMode(e: MouseEvent) {
    console.log('--- mosue down')
}

function temp() {
    console.log("--- temp")
}

function how() {
    console.log("-- how")
}

</script>

<template>
    <FunctionCard title="Doodle">
        <template #header-left-actions>
        </template>
        <template #default>
            <div class="size-full p-1 rounded-lg dot-background relative">
                <!-- <div class="absolute z-20 w-full h-full bg-red-50/50"> </div> -->
                <svg  @contextmenu.prevent ref="draw-area" class="size-full rounded-lg">
                </svg>
            </div>
        </template>
    </FunctionCard>
</template>