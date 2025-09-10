<script setup lang="ts">
import { ref } from 'vue';
import FunctionCard from '../common/FunctionCard.vue';
import { IGratitude } from '@/core/interfaces/entities/IGratitude';

//TODO:


const newGratitude = ref({
    text: '',
    description: ''
})

const gratitudes = ref<IGratitude[]>([
    {
        id: 1,
        title: [{ text: 'Having a job that I truly enjoy', isColored: false }],
        description: 'They always believe in me',
        color: '#10b981',
    },
    {
        id: 2,
        title: [{ text: 'Having a job that I truly enjoy', isColored: false }],
        description: '',
        color: '#f59e0b',
    },
    {
        id: 3,
        title: [{ text: 'Having a job that I truly enjoy', isColored: false }],
        description: 'It makes every day meaningful It makes every day meaningful It makes every day meaningful It makes every day meaningful It makes every day meaningful It makes every day meaningful',
        color: '#8b5cf6',
    }
])


function createGratitude() {

}

function toggleWordColor(gratitudeId: number, word: number) {
    const gratitude = gratitudes.value.find(g => g.id === gratitudeId)
    if (gratitude) {
        gratitude.title[word].isColored = !gratitude.title[word].isColored
    }
}

</script>

<template>
    <FunctionCard title="Gratitude">
        <template #header-right-actions>
            <!-- <button @click="createGratitude"
                class=" right-0 top-0 w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button> -->
        </template>
        <template #default>
            <div class="flex flex-col gap-2">
                <div v-for="gratitude in gratitudes" :key="gratitude.id"
                    class="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div class="size-2.5 rounded-full flex-shrink-0 mt-2" :style="{ backgroundColor: gratitude.color }">
                    </div>
                    <div class="size-2.5 rounded-full flex-shrink-0 mt-2 absolute animate-ping ping duration-1000" :style="{ backgroundColor: gratitude.color }">
                    </div>

                    <div class="flex-1">
                        <p class="text-gray-900 leading-relaxed">
                            <template v-for="(word, index) in gratitude.title" :key="index">
                                <span @click="toggleWordColor(gratitude.id, index)"
                                    class="cursor-pointer transition-all duration-200 gratitude-word" :style="{
                                        color: word.isColored ? gratitude.color : 'inherit',
                                        '--hover-color': gratitude.color
                                    }">
                                    {{ word.text }} </span>
                                <span> {{ index < gratitude.title.length - 1 ? ' ' : '' }} </span>
                            </template>
                        </p>
                        <p v-if="gratitude.description" class="text-xs text-gray-500 mt-0.5">{{
                            gratitude.description }}</p>
                    </div>
                </div>
            </div>
        </template>
    </FunctionCard>
</template>

<style lang="css" scoped>
.gratitude-word:hover {
    background-color: color-mix(in srgb, var(--hover-color) 10%, transparent);
    border-radius: 2px;
    padding: 1px 2px;
}

.ping {
    --animate-ping: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite
}
</style>