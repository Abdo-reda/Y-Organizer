<script setup lang="ts">
import FunctionCard from "@/components/common/FunctionCard.vue";
import { Button } from "@/components/ui/button";
import { IRemember } from "@/core/interfaces/entities/IRemember";
import useRemember from "@/store/useRemember";
import { PlusIcon, XIcon } from "lucide-vue-next";
import { ref } from "vue";

const { remembers, createRemember, updateRemember, deleteRemember } = useRemember();

const currentRemember = ref("");

async function handleCreate() {
    if (!currentRemember.value) return;
    await createRemember(currentRemember.value);
    currentRemember.value = "";
}

async function handleDelete(id: number | undefined) {
    if (!id) return;
    await deleteRemember(id);
}

async function handlePointer(event: PointerEvent, remember: IRemember) {
    switch (event.button) {
        case 2:
            await handleDelete(remember.id);
            break;
    }
}

async function toggleHighlight(rememberId: number | undefined, wordIndex: number) {
    const remember = remembers.find((r) => r.id === rememberId);
    if (!remember || !rememberId) return;
    const highlightIndex = remember.highlights.indexOf(wordIndex);
    if (highlightIndex === -1) remember.highlights.push(wordIndex);
    else remember.highlights.splice(highlightIndex, 1);
    await updateRemember(rememberId, remember);
}
</script>

<template>
    <FunctionCard title="Remember">
        <template #default>
            <div @contextmenu.prevent class="flex flex-col gap-2 h-full mx-2">
                <div v-auto-animate class="flex-1 flex flex-col gap-2 relative overflow-auto scroll-hidden">
                    <div @pointerdown="handlePointer($event, remember)" v-for="remember in remembers" :key="remember.id"
                        class="flex gap-4 hover:bg-gray-100/75 transition-colors duration-300 group rounded-sm px-2 py-1">
                        <div class="flex items-center">
                            <div class="relative size-2.5 rounded-full bg-primary">
                                <div class="size-2.5 rounded-full absolute animate-ping bg-primary duration-1000"></div>
                            </div>
                        </div>
                        <p class="flex-1 text-base font-semibold capitalize select-none">
                            <template v-for="(word, index) in remember.title.trim().split(/\s+/)" :key="index">
                                <span @click="toggleHighlight(remember.id, index)"
                                    class="relative rounded-xs cursor-pointer transition-all duration-200 hover:cursor-default highlight-word"
                                    :class="{
                                        highlighted: remember.highlights.some((h) => h === index),
                                    }">
                                    {{ word }}
                                </span>
                                <span> {{ index < remember.title.length - 1 ? " " : "" }} </span>
                            </template>
                        </p>
                        <div class="flex items-center">
                            <Button @click="handleDelete(remember.id)" variant="ghost" size="icon"
                                class="text-gray-300 size-6 opacity-0 group-hover:opacity-100 duration-700 bg-transparent">
                                <XIcon />
                            </Button>
                        </div>
                    </div>
                </div>
                <form @submit.prevent="handleCreate" class="flex gap-2 p-2 items-center">
                    <input name="remember-input" type="text" v-model="currentRemember" autocomplete="off"
                        autocorrect="off" placeholder="remember..."
                        class="w-full h-full focus:ring-1 [&::placeholder]:select-none ring-gray-200 transition-shadow bg-gray-50 rounded-md p-1.5 resize-none border-none outline-none text-gray-500 placeholder-gray-300" />
                    <Button type="submit" variant="ghost" size="icon" class="text-gray-300">
                        <PlusIcon />
                    </Button>
                </form>
            </div>
        </template>
    </FunctionCard>
</template>


<style lang="css" scoped>
.highlight-word:hover {
    background-color: color-mix(in srgb, var(--primary) 10%, transparent);
    padding: 0px 2px;
}

.highlight-word::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 3px;
    background-color: var(--primary);
    transition: width 0.25s ease-out;
}

.highlight-word.highlighted {
    color: var(--primary);
}

.highlight-word.highlighted::after {
    width: 100%;
}
</style>
