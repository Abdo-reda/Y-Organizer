<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-gray-900">Activity Summary</h2>
      <button 
        @click="openCreateModal"
        class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
      >
        <Plus class="w-5 h-5" />
      </button>
    </div>

     Chart Container 
    <div class="relative mb-6">
      <div class="flex items-center justify-center">
        <svg width="200" height="200" class="transform -rotate-90">
           Background Circle 
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#f3f4f6"
            stroke-width="12"
          />
          
           Activity Segments 
          <circle
            v-for="(activity, index) in activitiesWithData"
            :key="activity.id"
            cx="100"
            cy="100"
            r="80"
            fill="none"
            :stroke="activity.color"
            stroke-width="12"
            :stroke-dasharray="`${activity.circumference} ${totalCircumference}`"
            :stroke-dashoffset="activity.offset"
            class="transition-all duration-500 hover:stroke-width-16 cursor-pointer"
            @click="openEditModal(activity)"
          />
        </svg>
        
         Center Text 
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900">{{ totalHours }}h</div>
            <div class="text-sm text-gray-500">Total</div>
          </div>
        </div>
      </div>
    </div>

     Activity List 
    <div class="space-y-3">
      <div 
        v-for="activity in activitiesWithData" 
        :key="activity.id"
        class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
        @click="openEditModal(activity)"
      >
        <div class="flex items-center space-x-3">
          <div 
            class="w-4 h-4 rounded-full"
            :style="{ backgroundColor: activity.color }"
          ></div>
          <div>
            <div class="font-medium text-gray-900">{{ activity.name }}</div>
            <div class="text-sm text-gray-500">{{ activity.description }}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-semibold text-gray-900">{{ activity.hours }}h</div>
          <div class="text-sm text-gray-500">{{ activity.percentage }}%</div>
        </div>
      </div>
    </div>

     <!-- Activity Modal 
    <ActivityModal 
      v-if="showModal"
      :activity="selectedActivity"
      :is-editing="isEditing"
      @close="closeModal"
      @save="saveActivity"
    /> -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
// import ActivityModal from './activity-modal.vue'

// Sample activities with mock data
const activities = ref([
  { 
    id: 1, 
    name: 'Work', 
    description: 'Professional tasks and meetings',
    color: '#3B82F6', 
    categories: ['productivity'],
    hours: 32 
  },
  { 
    id: 2, 
    name: 'Exercise', 
    description: 'Physical fitness and health',
    color: '#10B981', 
    categories: ['health'],
    hours: 8 
  },
  { 
    id: 3, 
    name: 'Study', 
    description: 'Learning and skill development',
    color: '#8B5CF6', 
    categories: ['education'],
    hours: 12 
  },
  { 
    id: 4, 
    name: 'Personal', 
    description: 'Personal projects and hobbies',
    color: '#F59E0B', 
    categories: ['personal'],
    hours: 6 
  }
])

// Modal state
const showModal = ref(false)
const selectedActivity = ref(null)
const isEditing = ref(false)

// Computed properties
const totalHours = computed(() => {
  return activities.value.reduce((sum, activity) => sum + activity.hours, 0)
})

const totalCircumference = 2 * Math.PI * 80

const activitiesWithData = computed(() => {
  let cumulativeOffset = 0
  
  return activities.value.map(activity => {
    const percentage = Math.round((activity.hours / totalHours.value) * 100)
    const circumference = (activity.hours / totalHours.value) * totalCircumference
    const offset = -cumulativeOffset
    
    cumulativeOffset += circumference
    
    return {
      ...activity,
      percentage,
      circumference,
      offset
    }
  })
})

// Modal functions
const openCreateModal = () => {
  selectedActivity.value = null
  isEditing.value = false
  showModal.value = true
}

const openEditModal = (activity) => {
  selectedActivity.value = { ...activity }
  isEditing.value = true
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedActivity.value = null
}

const saveActivity = (activityData) => {
  if (isEditing.value) {
    const index = activities.value.findIndex(a => a.id === activityData.id)
    if (index !== -1) {
      activities.value[index] = { ...activityData }
    }
  } else {
    const newActivity = {
      ...activityData,
      id: Date.now(),
      hours: 0
    }
    activities.value.push(newActivity)
  }
  closeModal()
}
</script>
