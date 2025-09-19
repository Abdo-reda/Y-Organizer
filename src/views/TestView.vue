<script setup lang="ts">
import { ref } from 'vue'

// Mock data for demonstration
const currentSession = {
  title: "working on stuff related to stuff",
  activity: {
    name: "playing",
    color: "#3b82f6"
  },
  endTime: "2:00",
  notes: "some notes about the current session and what I'm working on...",
  startTime: "1:00",
}

const currentTask = {
  title: "Finish this stupid project",
  description: "optional description"
}

const activeTasks = [
  { id: 1, title: "Review code changes", description: "Check the new features" },
  { id: 2, title: "Update documentation", description: "" }
]

const completedTasks = [
  { id: 3, title: "Setup development environment" },
  { id: 4, title: "Create initial wireframes" },
  { id: 5, title: "Research user requirements" },
  { id: 6, title: "Design database schema" }
]

const viewMode = ref('active') // 'active' or 'completed'
</script>

<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-2xl">
    <!-- Header -->
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-1">Now</h2>
      <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
           :style="{ backgroundColor: currentSession.activity.color + '20', color: currentSession.activity.color }">
        {{ currentSession.activity.name }}
      </div>
      <p v-if="currentSession.title" class="text-gray-600 mt-2 font-medium">
        {{ currentSession.title }}
      </p>
      <div class="text-sm text-gray-500 mt-1">
        {{ currentSession.startTime }} - {{ currentSession.endTime }} • 1h 23m remaining
      </div>
    </div>

    <!-- Current Active Task -->
    <div v-if="currentTask" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div class="flex items-center gap-3">
        <div class="relative">
          <div class="absolute bg-blue-500/50 size-2 rounded-full animate-ping"></div>
          <div class="bg-blue-500 size-2 rounded-full"></div>
        </div>
        <div class="flex-1">
          <div class="font-semibold text-gray-900">{{ currentTask.title }}</div>
          <div v-if="currentTask.description" class="text-sm text-gray-600 mt-1">
            {{ currentTask.description }}
          </div>
        </div>
        <button class="p-2 hover:bg-blue-100 rounded-lg transition-colors">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Added task view toggle buttons -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex bg-gray-100 rounded-lg p-1">
        <button 
          @click="viewMode = 'active'"
          :class="[
            'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
            viewMode === 'active' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          Active Tasks
        </button>
        <button 
          @click="viewMode = 'completed'"
          :class="[
            'px-3 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-1',
            viewMode === 'completed' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          Completed
          <span class="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded-full">
            {{ completedTasks.length }}
          </span>
        </button>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-3 gap-4">
      <!-- Tasks Column -->
      <div class="col-span-2 space-y-3">
        <!-- Fixed height container for tasks to prevent card height changes -->
        <div class="h-64 overflow-y-auto">
          <!-- Active Tasks View -->
          <div v-if="viewMode === 'active'" class="space-y-3">
            <div v-for="task in activeTasks" :key="task.id" 
                 class="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="font-medium text-gray-900">{{ task.title }}</div>
                  <div v-if="task.description" class="text-sm text-gray-600 mt-1">{{ task.description }}</div>
                </div>
                <div class="flex gap-1">
                  <button class="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Set Active">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </button>
                  <button class="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Mark Done">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Add Task Button -->
            <button class="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Task
            </button>
          </div>

          <!-- Completed Tasks View -->
          <div v-else class="space-y-2">
            <div 
              v-for="task in completedTasks" 
              :key="task.id"
              class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg class="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span class="text-gray-600 line-through">{{ task.title }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes Column -->
      <div class="space-y-3">
        <h3 class="text-sm font-semibold text-gray-700">Notes</h3>
        <div class="relative">
          <textarea 
            v-model="currentSession.notes"
            class="w-full h-64 p-3 text-sm border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Session notes..."
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
