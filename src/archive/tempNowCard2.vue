<template>
    <div class="max-w-md mx-auto">

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