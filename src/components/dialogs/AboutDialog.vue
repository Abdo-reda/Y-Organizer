<script setup lang="ts">
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog"

const version = import.meta.env.VITE_APP_VERSION

</script>

<template>
    <DialogContent class="bg-white/40 backdrop-blur-md border-none select-none">
        <DialogHeader>
            <DialogDescription class="hidden"> About Y-Organizer </DialogDescription>
        </DialogHeader>
        <div class="flex flex-col items-center gap-4">
            <div class="flex flex-col items-center gap-2">
                <div class="rounded-full aspect-square p-2 flex items-center justify-center">
                    <span class="text-4xl font-bold">Y</span>
                </div>
            </div>
            <div class="w-2/3 border-t border-t-gray-400" />
            <div class="text-gray-600 text-sm leading-relaxed text-center">
                <p>
                    Made by NoPoint <span class="text-gray-400"> v{{ version }} </span>
                </p>
            </div>
        </div>
    </DialogContent>
</template>