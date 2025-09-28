<script setup lang="ts">
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const version = import.meta.env.VITE_APP_VERSION

</script>

<template>
    <DialogContent class="bg-white/60 backdrop-blur-md select-none">
        <DialogHeader>
            <DialogTitle class="hidden"> Y-Organizer </DialogTitle>
            <DialogDescription class="hidden"> About Y-Organizer </DialogDescription>
        </DialogHeader>
        <div class="flex flex-col items-center gap-4">
            <div class="flex flex-col items-center gap-2">
                <div class="rounded-full aspect-square p-2 flex items-center justify-center">
                    <span class="text-4xl text-gray-700 font-bold">Y</span>
                </div>
            </div>
            <div class="w-2/3 border-t border-t-gray-400/75" />
            <div class="text-gray-600 text-sm leading-relaxed text-center">
                <p>
                    Made by <a href="https://github.com/Abdo-reda" target="_blank" class="cursor-default font-semibold relative highlight-word"> NoPoint  </a>
                </p>
            </div>
        </div>
        <DialogFooter>
            <span class="text-gray-400 text-xs"> v{{ version }} </span>
        </DialogFooter>
    </DialogContent>
</template>

<style lang="css" scoped>
.highlight-word::after {
	content: "";
	position: absolute;
	left: 0;
	bottom: 0;
	width: 0;
	height: 1px;
	background-color: var(--color-gray-600);
	transition: width 0.15s ease-out;
}

.highlight-word:hover::after {
	width: 100%;
}
</style>