<script setup lang="ts">
import { ref } from 'vue';
import FunctionCard from '@/components/common/FunctionCard.vue';
import { IGratitude } from '@/core/interfaces/entities/IGratitude';
import useDayGratitudes from '@/store/useDayGratitudes';
import { LifeCategoryEnum } from '@/core/enums/lifeCategoryEnum';
import { DateTime } from 'luxon';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-vue-next';


const { gratitudes, createGratitude, updateGratitude, deleteGratitude } = useDayGratitudes();

const newGratitude = ref({
    text: '',
    description: ''
})

async function handleCreateGratitude() {
    await createGratitude({
        title: 'Temp',
        description: '',
        category: LifeCategoryEnum.CAREER,
        day: DateTime.now().toISODate(),
        highlights: []
    })
}

function handleDeleteGratitude(id: number) {
    deleteGratitude(id);
}

async function toggleHighlight(gratitudeId: number | undefined, wordIndex: number) {
    const gratitude = gratitudes.find(g => g.id === gratitudeId)
    if (!gratitude) return;
    const highlightIndex = gratitude.highlights.indexOf(wordIndex);
    if (highlightIndex === -1) gratitude.highlights.push(wordIndex);
    else gratitude.highlights.splice(highlightIndex, 1)
    await updateGratitude(gratitude);
}

</script>

<template>
    <FunctionCard title="Gratitude">
        <template #default>
            <div class="flex flex-col gap-2">
                <!-- gratitude.color -->
                <div v-for="gratitude in gratitudes" :key="gratitude.id"
                    class="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div class="size-2.5 rounded-full flex-shrink-0 mt-2" :style="{ backgroundColor: 'red' }">
                    </div>
                    <div class="size-2.5 rounded-full flex-shrink-0 mt-2 absolute animate-ping ping duration-1000"
                        :style="{ backgroundColor: 'red' }">
                    </div>

                    <div class="flex-1">
                        <p class="text-gray-900 leading-relaxed">
                            <template v-for="(word, index) in gratitude.title.trim().split(/\s+/)" :key="index">
                                <span @click="toggleHighlight(gratitude.id, index)"
                                    class="cursor-pointer transition-all duration-200 gratitude-word" :style="{
                                        color: gratitude.highlights.some(h => h === index) ? 'red' : 'inherit',
                                        '--hover-color': 'red'
                                    }">
                                    {{ word }} </span>
                                <span> {{ index < gratitude.title.length - 1 ? ' ' : '' }} </span>
                            </template>
                        </p>
                        <p v-if="gratitude.description" class="text-xs text-gray-500 mt-0.5">{{
                            gratitude.description }}</p>
                    </div>
                </div>
            </div>
        </template>
        <template #header-right-actions>
            <div class="flex items-center justify-end">
                <Button variant="ghost" size="icon" class="text-gray-300">
                    <PlusIcon />
                </Button>
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