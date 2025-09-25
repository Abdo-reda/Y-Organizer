<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CheckIcon, PenLineIcon } from "lucide-vue-next";


function handleSubmit() {

}

import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  activity: Object,
  isEditing: Boolean
})

const emit = defineEmits(['close', 'save'])

const formData = ref({
  name: '',
  description: '',
  color: '#3B82F6',
  categories: [],
  status: 'active'
})

const statusOptions = [
  { value: 'active', label: 'Active', activeClass: 'bg-green-100 text-green-700' },
  { value: 'completed', label: 'Completed', activeClass: 'bg-blue-100 text-blue-700' },
  { value: 'archived', label: 'Archived', activeClass: 'bg-gray-100 text-gray-700' }
]

// Color options
const colorOptions = [
  '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B',
  '#EF4444', '#06B6D4', '#84CC16', '#F97316',
  '#EC4899', '#6366F1', '#14B8A6', '#F59E0B',
  '#8B5CF6', '#EF4444', '#10B981', '#6B7280'
]

// Category options
const categoryOptions = [
  'productivity', 'health', 'education', 'personal',
  'work', 'fitness', 'creative', 'social'
]

// Initialize form data when activity prop changes
watch(() => props.activity, (newActivity) => {
  if (newActivity) {
    formData.value = {
      id: newActivity.id,
      name: newActivity.name || '',
      description: newActivity.description || '',
      color: newActivity.color || '#3B82F6',
      categories: [...(newActivity.categories || [])],
      status: newActivity.status || 'active'
    }
  } else {
    formData.value = {
      name: '',
      description: '',
      color: '#3B82F6',
      categories: [],
      status: 'active'
    }
  }
}, { immediate: true })

// Toggle category selection
const toggleCategory = (category) => {
  const index = formData.value.categories.indexOf(category)
  if (index > -1) {
    formData.value.categories.splice(index, 1)
  } else {
    formData.value.categories.push(category)
  }
}

// Handle save
const handleSave = () => {
  if (formData.value.name.trim()) {
    emit('save', { ...formData.value })
  }
}
</script>

<template>
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Activity</DialogTitle>
        </DialogHeader>
        <form id="activity-form" name="activity-form" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-2">
                <!-- Activity Name -->
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                        Activity Name
                    </label>
                    <input v-model="formData.name" type="text" placeholder="Enter activity name..."
                        class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                </div>
    
                <!-- Description -->
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea v-model="formData.description" placeholder="Describe this activity..." rows="2"
                        class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"></textarea>
                </div>
    
                <!-- Added status selection with compact design -->
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <div class="flex space-x-1">
                        <button v-for="status in statusOptions" :key="status.value" @click="formData.status = status.value"
                            :class="[
                                'flex-1 px-2 py-1 text-xs rounded-md border transition-all',
                                formData.status === status.value
                                    ? `${status.activeClass} border-transparent`
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                            ]">
                            {{ status.label }}
                        </button>
                    </div>
                </div>
    
                <!-- Color Selection -->
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-2">
                        Color
                    </label>
                    <div class="grid grid-cols-8 gap-1">
                        <button v-for="color in colorOptions" :key="color" @click="formData.color = color" :class="[
                            'w-6 h-6 rounded-full border-2 transition-all hover:scale-110',
                            formData.color === color ? 'border-gray-400 ring-1 ring-gray-200' : 'border-gray-200'
                        ]" :style="{ backgroundColor: color }"></button>
                    </div>
    
                    <!-- Custom Color Input -->
                    <div class="mt-2 flex items-center space-x-2">
                        <input v-model="formData.color" type="color"
                            class="w-6 h-6 border border-gray-200 rounded cursor-pointer" />
                        <input v-model="formData.color" type="text" placeholder="#000000"
                            class="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                </div>
    
                <!-- Categories -->
                <div>
                    <label class="block text-xs font-medium text-gray-700 mb-2">
                        Categories
                    </label>
                    <div class="flex flex-wrap gap-1">
                        <button v-for="category in categoryOptions" :key="category" @click="toggleCategory(category)"
                            :class="[
                                'px-2 py-1 text-xs rounded-md border transition-all',
                                formData.categories.includes(category)
                                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                            ]">
                            {{ category }}
                        </button>
                    </div>
                </div>
            </div>
        </form>
        <DialogFooter>
            <Button type="submit" variant="outline" form="activity-form">
                <PenLineIcon /> Submit
            </Button>
        </DialogFooter>
    </DialogContent>
</template>