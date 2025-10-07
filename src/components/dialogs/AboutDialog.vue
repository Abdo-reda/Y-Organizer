<script setup lang="ts">
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { isTauri } from "@tauri-apps/api/core";
import { openUrl } from "@tauri-apps/plugin-opener";

const version = import.meta.env.VITE_APP_VERSION;

const profileUrl = "https://github.com/Abdo-reda";

function openExternalUrl() {
    if (isTauri()) openUrl(profileUrl);
    else window.open(profileUrl, "_blank");
}
</script>

<template>
    <DialogContent class="bg-white/60 backdrop-blur-md select-none">
        <DialogHeader>
            <DialogTitle class="hidden"> Y-Organizer </DialogTitle>
            <DialogDescription class="hidden"> About Y-Organizer </DialogDescription>
        </DialogHeader>
        <div class="flex flex-col items-center gap-4">
            <div class="flex flex-col items-center gap-2">
                <div class="relative rounded-full aspect-square p-4 flex items-center justify-center">
                    <img class="absolute brightness-85 opacity-60"
                        src="@/assets/images/sphere.png" />
                    <span class="text-4xl text-gray-700 font-bold">Y</span>
                </div>
            </div>
            <div class="w-2/3 border-t border-t-gray-400/75" />
            <div class="text-gray-600 text-sm leading-relaxed text-center">
                <p>Made by <span @click="openExternalUrl" class="cursor-default font-semibold relative highlight-word">
                        NoPoint</span></p>
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
