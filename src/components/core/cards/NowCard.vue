<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import { ISession } from '@/core/interfaces/entities/ISession';

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

defineProps<INowCardProps>();


</script>

<template>
    <FunctionCard title="Now">
        <!-- TODO: make the borderColor depend on activity, and make shadow color as well and transition when activity gets active -->
        <template #default>
            <p class="text-3xl font-bold"> {{ currentSession.activity.name }} </p>
            <!-- TODO: subtitle -->
            <div class="text-sm text-gray-500 mb-4">
                <span> {{ currentSession.startTime }} - {{ currentSession.endTime }} </span>
                <span class="text-xs mt-1"> 1h 23m remaining</span>
            </div>
            <div v-if="activeTask" class="mb-4 p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <div class="w-3 h-3 rounded-full animate-ping"
                            :style="{ backgroundColor: currentActivity?.color || '#3b82f6' }"></div>
                        <div class="absolute inset-0 w-3 h-3 rounded-full"
                            :style="{ backgroundColor: currentActivity?.color || '#3b82f6' }"></div>
                    </div>
                    <div class="flex-1">
                        <div class="font-bold text-gray-800">{{ activeTask.title }}</div>
                        <div v-if="activeTask.description" class="text-sm text-gray-600 mt-1">{{
                            activeTask.description }}</div>
                    </div>
                </div>
            </div>
            <div v-else>
                <!-- TODO: -->
                //---------- no active task 
            </div>
            <div class="border-t border-gray-200 mb-4"></div>
        </template>
    </FunctionCard>
    <div class="max-w-md mx-auto">


        <!-- Simplified task slots with only set active icon and mark done buttons -->
        <div class="space-y-3">
            <div v-for="(slot, index) in taskSlots" :key="index" class="transition-all">
                <!-- Show + Add Task button in place of first empty slot -->
                <div v-if="!slot.task && index === firstEmptySlotIndex">
                    <button @click="showAddTaskModal = true"
                        class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Task
                    </button>
                </div>

                <!-- Regular task slot -->
                <div v-else-if="slot.task" class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <div class="font-medium text-gray-800">{{ slot.task.title }}</div>
                            <div v-if="slot.task.description" class="text-sm text-gray-600 mt-1">{{
                                slot.task.description }}</div>
                        </div>
                        <div class="flex items-center gap-2 ml-3">
                            <!-- Set active as icon instead of button -->
                            <button @click="markTaskActive(slot.task)"
                                class="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                :disabled="slot.task.id === activeTask?.id"
                                :class="{ 'opacity-50 cursor-not-allowed': slot.task.id === activeTask?.id }"
                                title="Set as active task">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </button>
                            <!-- Only kept mark as done button -->
                            <button @click="markTaskDone(slot.task.id)"
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
            </div>
        </div>
    </div>
</template>
