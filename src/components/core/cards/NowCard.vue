<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import Accordion from '@/components/ui/accordion/Accordion.vue';
import AccordionContent from '@/components/ui/accordion/AccordionContent.vue';
import AccordionItem from '@/components/ui/accordion/AccordionItem.vue';
import { Button } from '@/components/ui/button/index';
import { ISession } from '@/core/interfaces/entities/ISession';
import { ITask } from '@/core/interfaces/entities/ITask';
import { NotepadTextIcon } from 'lucide-vue-next';
import { ref } from 'vue';


//TODO: CURRENT SESSION CARD
//- current activity title in bold and underneath it in gray is the start and end time of the session and how much is left from now //make it a string for now, I don't want any date calcluations.
//- underneath them is the active task
//- underneath it is 3 slots for tasks, each task can be cleared, deleted, edited, and marked as done and marked as active
//- max of 3 tasks you can add. other than the active task //maybe only three slots
//- a way to make a task active, and mark task as done
//- a way to add task.. tasks should be simple only a title //maybe a description
//- a way to clear a task (not going to work on that session)
//- tasks are automatically put on the slots but you can clear them
//- when you create a task, you write title and description or choose an existing task from today so the modal will have small cards or suggestions on the right, 
//- shortcuts? 
//- clear
//- delete
//- edit
//- create
//- mark as done
//- mark as active

interface INowCardProps {
    currentSession: ISession;
}

const cardData: INowCardProps = {
    currentSession: {
        title: 'working on stuff related to stuff',
        activity: {
            categories: [],
            color: '#11323',
            description: 'some description',
            name: 'playing'
        },
        endTime: '2:00',
        notes: 'some notes, i think I should try to remove eveyrthing from the planet why is this happening',
        startTime: '1:00',
    }
}

const currentSession = cardData.currentSession;

const currentTask: ITask = {
    activity: "activity",
    title: "some title",
    description: "some description",
}

const openNotes = ref('notes');

</script>

<template>
    <FunctionCard title="Now">
        <!-- TODO: make the borderColor depend on activity, and make shadow color as well and transition when activity gets active -->
        <template #header-right-actions>
            <div class="flex justify-end items-center">
                <Button @click="openNotes = openNotes ? '' : 'notes'" variant="ghost"
                    class="size-6 hidden text-gray-400 hover:cursor-pointer hover:text-primary transition-colors">
                    <NotepadTextIcon class="size-4" v-if="currentSession.notes" />
                </Button>
            </div>
        </template>
        <template #default>
            <div class="flex flex-col gap-0.5 items-center">
                <p class="text-3xl font-bold capitalize"> {{ currentSession.activity.name }} </p>
                <p v-if="currentSession.title" class="text-base text-gray-600 font-semibold capitalize"> {{
                    currentSession.title }}
                </p>
                <div class="text-xs text-gray-500">
                    <span> {{ currentSession.startTime }} - {{ currentSession.endTime }} </span>
                    <span class="text-xs"> • 1h 23m remaining</span>
                </div>
                <div v-if="currentSession.notes" class="mx-4">
                    <Accordion class="w-full" v-model="openNotes">
                        <AccordionItem value="notes">
                            <AccordionContent class="p-2 bg-gray-50 border border-dashed rounded-lg">
                                <NotepadTextIcon class="size-4 text-gray-500 inline mx-1" />
                                <p class="text-gray-500 text-sm inline">
                                    {{ currentSession.notes }}
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
                <div v-if="currentTask" class="px-4 rounded-lg">
                    <div class="flex items-center gap-3">
                        <div class="relative">
                            <div class="w-3 h-3 rounded-full animate-ping"
                                :style="{ backgroundColor: currentActivity?.color || '#3b82f6' }"></div>
                            <div class="absolute inset-0 w-3 h-3 rounded-full"
                                :style="{ backgroundColor: currentActivity?.color || '#3b82f6' }"></div>
                        </div>
                        <div class="flex-1">
                            <div class="font-bold text-gray-800">{{ currentTask.title }}</div>
                            <div v-if="currentTask.description" class="text-sm text-gray-600 mt-1">{{
                                currentTask.description }}</div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p> ---- no active task --- </p>
                </div>
            </div>
            <div class="border-t border-gray-200 m-4"></div>
            <div class="flex flex-col gap-2">
                <!-- v-for="(slot, index) in taskSlots" :key="index" -->

                <div class="p-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <div class="font-medium text-gray-800">{{ currentTask.title }}</div>
                            <div v-if="currentTask.description" class="text-sm text-gray-600 mt-1">{{
                                currentTask.description }}</div>
                        </div>
                        <div class="flex items-center gap-2 ml-3">
                            <button
                                class="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Set as active task">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </button>
                            <button
                                class="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                title="Mark as done">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <button
                        class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Task
                    </button>
                </div>
            </div>
        </template>
    </FunctionCard>
</template>
