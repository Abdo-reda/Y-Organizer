<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">Schedule</h2>
    
    <!-- Timeline Container -->
    <div class="relative">
      <!-- Time Labels and Sessions -->
      <div class="space-y-1">
        <div 
          v-for="hour in hours" 
          :key="hour"
          class="relative flex items-center h-12 group"
        >
          <!-- Time Label -->
          <div class="w-16 text-sm text-gray-500 font-medium">
            {{ formatHour(hour) }}
          </div>
          
          <!-- Session Area -->
          <div class="flex-1 ml-4 relative">
            <!-- Empty Slot -->
            <div 
              v-if="!getSessionAtHour(hour)"
              @click="createSession(hour)"
              class="h-10 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors flex items-center justify-center group-hover:border-gray-300"
            >
              <Plus class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <!-- Existing Session -->
            <div 
              v-else
              @click="editSession(getSessionAtHour(hour))"
              class="relative cursor-pointer"
            >
              <!-- Made sessions more compact with activity-colored backgrounds and proper glow effects -->
              <div 
                :class="[
                  'rounded-lg p-3 transition-all hover:shadow-md relative',
                  getSessionAtHour(hour).successful ? 'ring-2 shadow-lg' : ''
                ]"
                :style="{ 
                  height: '40px',
                  backgroundColor: getActivityBackgroundColor(getSessionAtHour(hour).activity),
                  boxShadow: getSessionAtHour(hour).successful ? 
                    `0 0 20px ${getActivityGlowColor(getSessionAtHour(hour).activity)}, 0 0 40px ${getActivityGlowColor(getSessionAtHour(hour).activity)}` : 
                    '',
                  borderColor: getSessionAtHour(hour).successful ? getActivityGlowColor(getSessionAtHour(hour).activity) : 'transparent'
                }"
              >
                <div class="flex items-center justify-between h-full">
                  <div class="flex-1 min-w-0 flex items-center space-x-3">
                    <!-- Made activity name bigger, bolder with proper color contrast -->
                    <h3 
                      class="text-base font-bold truncate"
                      :style="{ color: getActivityTextColor(getSessionAtHour(hour).activity) }"
                    >
                      {{ getSessionAtHour(hour).activity.name }}
                    </h3>
                    
                    <!-- Session title and notes in compact layout -->
                    <div class="flex items-center space-x-2 text-xs opacity-80">
                      <span 
                        v-if="getSessionAtHour(hour).title"
                        class="truncate max-w-20"
                        :style="{ color: getActivityTextColor(getSessionAtHour(hour).activity) }"
                      >
                        {{ getSessionAtHour(hour).title }}
                      </span>
                      <span 
                        v-if="getSessionAtHour(hour).notes" 
                        class="truncate max-w-32"
                        :style="{ color: getActivityTextColor(getSessionAtHour(hour).activity) }"
                      >
                        "{{ getSessionAtHour(hour).notes.substring(0, 30) }}{{ getSessionAtHour(hour).notes.length > 30 ? '...' : '' }}"
                      </span>
                    </div>
                  </div>
                  
                  <!-- Moved task count to right side with success button -->
                  <div class="flex items-center space-x-2">
                    <div 
                      v-if="getSessionAtHour(hour).tasks.length > 0"
                      class="text-xs font-medium px-2 py-1 rounded-full cursor-pointer"
                      :style="{ 
                        backgroundColor: 'rgba(255,255,255,0.2)', 
                        color: getActivityTextColor(getSessionAtHour(hour).activity) 
                      }"
                      :title="getTasksTooltip(getSessionAtHour(hour).tasks)"
                    >
                      {{ getSessionAtHour(hour).tasks.length }}
                    </div>
                    
                    <button
                      @click.stop="toggleSuccess(getSessionAtHour(hour))"
                      :class="[
                        'p-1 rounded-full transition-all',
                        getSessionAtHour(hour).successful 
                          ? 'bg-white/20 text-white' 
                          : 'bg-white/10 hover:bg-white/20'
                      ]"
                      :style="{ color: getActivityTextColor(getSessionAtHour(hour).activity) }"
                      :title="getSessionAtHour(hour).successful ? 'Mark as needs improvement' : 'Mark as successful'"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Session Planning Modal -->
    <div v-if="showPlanModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold">Plan Session</h3>
          <button @click="closePlanModal" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <!-- Split layout into two columns -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Left Column - Session Details -->
          <div class="space-y-4">
            <!-- Time Range -->
            <div class="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <Clock class="w-4 h-4" />
              <span>{{ formatTime(selectedSession.startTime) }} - {{ formatTime(selectedSession.endTime) }}</span>
            </div>
            
            <!-- Activity Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Activity</label>
              <select 
                v-model="selectedSession.activity"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option v-for="activity in activities" :key="activity.id" :value="activity">
                  {{ activity.name }}
                </option>
              </select>
            </div>
            
            <!-- Session Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Session Title</label>
              <input 
                v-model="selectedSession.title"
                type="text"
                placeholder="Enter session title..."
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea 
                v-model="selectedSession.notes"
                placeholder="Add session notes..."
                rows="4"
                class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              ></textarea>
            </div>
          </div>
          
          <!-- Right Column - Tasks -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-gray-700">Tasks</label>
              <button 
                @click="addTask"
                class="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Task
              </button>
            </div>
            
            <!-- Current Tasks -->
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div 
                v-for="(task, index) in selectedSession.tasks" 
                :key="index"
                class="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
              >
                <input 
                  v-model="task.title"
                  type="text"
                  placeholder="Task title..."
                  class="flex-1 p-1 border-0 bg-transparent focus:ring-0 focus:outline-none"
                />
                <button 
                  @click="removeTask(index)"
                  class="text-red-500 hover:text-red-700"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
              
              <div v-if="selectedSession.tasks.length === 0" class="text-center py-8 text-gray-500">
                No tasks added yet
              </div>
            </div>
            
            <!-- Suggested Tasks -->
            <div class="border-t pt-4">
              <label class="block text-sm font-medium text-gray-700 mb-3">Suggested Tasks</label>
              <div class="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                <div 
                  v-for="suggestedTask in suggestedTasks" 
                  :key="suggestedTask.id"
                  @click="addSuggestedTask(suggestedTask)"
                  class="p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div class="text-sm font-medium text-gray-900">{{ suggestedTask.title }}</div>
                  <div v-if="suggestedTask.description" class="text-xs text-gray-500 mt-1">{{ suggestedTask.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 mt-8 pt-6 border-t">
          <button 
            @click="closePlanModal"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="saveSession"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Session
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, X, Clock } from 'lucide-vue-next'

// Generate hours array (24 hours)
const hours = Array.from({ length: 24 }, (_, i) => i)

// Sample activities
const activities = ref([
  { id: 1, name: 'Work', primary: '#3B82F6', secondary: '#EFF6FF' },
  { id: 2, name: 'Exercise', primary: '#10B981', secondary: '#ECFDF5' },
  { id: 3, name: 'Study', primary: '#8B5CF6', secondary: '#F3E8FF' },
  { id: 4, name: 'Personal', primary: '#F59E0B', secondary: '#FFFBEB' },
  { id: 5, name: 'Break', primary: '#6B7280', secondary: '#F9FAFB' }
])

// Sessions data
const sessions = ref([
  {
    id: 1,
    startTime: 9,
    endTime: 11,
    duration: 2,
    activity: activities.value[0],
    title: 'Morning Focus Work',
    description: 'Deep work session for important projects',
    tasks: [
      { title: 'Review project requirements', completed: false },
      { title: 'Draft initial proposal', completed: false }
    ],
    notes: 'Focus on the most challenging tasks first',
    successful: true
  },
  {
    id: 2,
    startTime: 14,
    endTime: 15,
    duration: 1,
    activity: activities.value[1],
    title: 'Afternoon Workout',
    description: 'Cardio and strength training',
    tasks: [
      { title: '30 min cardio', completed: false },
      { title: 'Upper body workout', completed: false }
    ],
    notes: 'Remember to stretch afterwards',
    successful: false
  }
])

// Modal state
const showPlanModal = ref(false)
const selectedSession = ref(null)

// Suggested tasks data
const suggestedTasks = ref([
  { id: 1, title: 'Review emails', description: 'Check and respond to important emails' },
  { id: 2, title: 'Team standup', description: 'Daily team sync meeting' },
  { id: 3, title: 'Code review', description: 'Review pending pull requests' },
  { id: 4, title: 'Documentation', description: 'Update project documentation' },
  { id: 5, title: 'Planning', description: 'Plan next sprint tasks' },
  { id: 6, title: 'Research', description: 'Research new technologies' },
  { id: 7, title: 'Testing', description: 'Write and run tests' },
  { id: 8, title: 'Debugging', description: 'Fix reported bugs' },
  { id: 9, title: 'Cardio workout', description: '30 minutes cardio exercise' },
  { id: 10, title: 'Strength training', description: 'Weight lifting session' },
  { id: 11, title: 'Stretching', description: 'Flexibility and mobility work' },
  { id: 12, title: 'Reading', description: 'Read technical articles or books' }
])

// Helper functions
const formatHour = (hour) => {
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:00 ${period}`
}

const formatTime = (hour) => {
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:00 ${period}`
}

const getSessionAtHour = (hour) => {
  return sessions.value.find(session => 
    hour >= session.startTime && hour < session.endTime
  )
}

// Session management
const createSession = (hour) => {
  const newSession = {
    id: Date.now(),
    startTime: hour,
    endTime: hour + 1,
    duration: 1,
    activity: activities.value[0],
    title: '',
    description: '',
    tasks: [],
    notes: '',
    successful: false
  }
  
  sessions.value.push(newSession)
  selectedSession.value = { ...newSession }
  showPlanModal.value = true
}

const editSession = (session) => {
  selectedSession.value = { ...session }
  showPlanModal.value = true
}

const saveSession = () => {
  const index = sessions.value.findIndex(s => s.id === selectedSession.value.id)
  if (index !== -1) {
    sessions.value[index] = { ...selectedSession.value }
  }
  closePlanModal()
}

const closePlanModal = () => {
  showPlanModal.value = false
  selectedSession.value = null
}

// Task management
const addTask = () => {
  selectedSession.value.tasks.push({
    title: '',
    completed: false
  })
}

const removeTask = (index) => {
  selectedSession.value.tasks.splice(index, 1)
}

const addSuggestedTask = (suggestedTask) => {
  selectedSession.value.tasks.push({
    title: suggestedTask.title,
    description: suggestedTask.description || '',
    completed: false
  })
}

// Success toggle function
const toggleSuccess = (session) => {
  const sessionIndex = sessions.value.findIndex(s => s.id === session.id)
  if (sessionIndex !== -1) {
    sessions.value[sessionIndex].successful = !sessions.value[sessionIndex].successful
  }
}

// Added helper functions for activity colors
const getActivityBackgroundColor = (activity) => {
  return activity.primary
}

const getActivityTextColor = (activity) => {
  // Use white text for better contrast on colored backgrounds
  return '#FFFFFF'
}

const getTasksTooltip  = () => {
  return 'blah';
}

const getActivityGlowColor = (activity) => {
  return activity.primary
}

</script>