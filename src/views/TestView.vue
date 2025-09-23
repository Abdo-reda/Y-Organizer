<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-md">
    <!-- Header -->
    <div class="text-center mb-6">
      <h3 class="text-lg font-semibold text-gray-800">Remember</h3>
      <p class="text-sm text-gray-500 mt-1">Insights & Reflections</p>
    </div>

    <!-- Remember Items -->
    <div class="space-y-4 mb-4">
      <div 
        v-for="(item, index) in remembers" 
        :key="index"
        class="group relative"
      >
        <!-- Display Mode -->
        <div 
          v-if="editingIndex !== index"
          class="text-gray-700 leading-relaxed cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
          @click="handleRememberClick($event, index)"
          @click.ctrl.prevent="startEditing(index)"
        >
          <span 
            v-for="(word, wordIndex) in item.words" 
            :key="wordIndex"
            :class="[
              'transition-all duration-200 cursor-pointer hover:bg-blue-100 rounded px-1',
              word.highlighted ? 'bg-blue-200 text-blue-800 underline decoration-2 underline-offset-2' : ''
            ]"
            @click.stop="toggleWordHighlight(index, wordIndex)"
          >
            {{ word.text }}{{ wordIndex < item.words.length - 1 ? ' ' : '' }}
          </span>
        </div>

        <!-- Edit Mode -->
        <div v-else class="relative">
          <textarea
            ref="editTextarea"
            v-model="editingText"
            class="w-full p-2 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="2"
            @blur="saveEdit"
            @keydown.enter.prevent="saveEdit"
            @keydown.escape="cancelEdit"
          />
          <div class="flex justify-end mt-2 space-x-2">
            <button 
              @click="cancelEdit"
              class="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
            >
              Cancel
            </button>
            <button 
              @click="saveEdit"
              class="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add New Remember -->
    <div class="relative">
      <!-- Add Button (appears on hover or when adding) -->
      <div 
        v-if="!isAdding"
        class="opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity duration-200 text-center"
        @mouseenter="showAddButton = true"
        @mouseleave="showAddButton = false"
      >
        <button 
          @click="startAdding"
          class="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-gray-50"
        >
          + Add Remember
        </button>
      </div>

      <!-- Add Input -->
      <div v-else class="mt-2">
        <textarea
          ref="addTextarea"
          v-model="newRememberText"
          placeholder="What do you want to remember?"
          class="w-full p-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
          rows="2"
          @keydown.enter.prevent="addRemember"
          @keydown.escape="cancelAdding"
        />
        <div class="flex justify-end mt-2 space-x-2">
          <button 
            @click="cancelAdding"
            class="text-xs text-gray-500 hover:text-gray-700 px-3 py-1 rounded"
          >
            Cancel
          </button>
          <button 
            @click="addRemember"
            class="text-xs text-blue-600 hover:text-blue-700 px-3 py-1 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

// State
const remembers = ref([
  {
    words: [
      { text: 'Focus', highlighted: false },
      { text: 'on', highlighted: false },
      { text: 'progress,', highlighted: true },
      { text: 'not', highlighted: false },
      { text: 'perfection', highlighted: true }
    ]
  },
  {
    words: [
      { text: 'Small', highlighted: true },
      { text: 'consistent', highlighted: true },
      { text: 'actions', highlighted: false },
      { text: 'create', highlighted: false },
      { text: 'lasting', highlighted: false },
      { text: 'change', highlighted: false }
    ]
  },
  {
    words: [
      { text: 'Every', highlighted: false },
      { text: 'challenge', highlighted: true },
      { text: 'is', highlighted: false },
      { text: 'an', highlighted: false },
      { text: 'opportunity', highlighted: true },
      { text: 'to', highlighted: false },
      { text: 'grow', highlighted: false }
    ]
  }
])

const editingIndex = ref(-1)
const editingText = ref('')
const isAdding = ref(false)
const newRememberText = ref('')
const showAddButton = ref(false)

// Refs
const editTextarea = ref(null)
const addTextarea = ref(null)

// Methods
const toggleWordHighlight = (rememberIndex, wordIndex) => {
  remembers.value[rememberIndex].words[wordIndex].highlighted = 
    !remembers.value[rememberIndex].words[wordIndex].highlighted
}

const handleRememberClick = (event, index) => {
  // Only handle if not clicking on a word
  if (event.target.tagName === 'SPAN') return
}

const startEditing = (index) => {
  editingIndex.value = index
  editingText.value = remembers.value[index].words.map(w => w.text).join(' ')
  nextTick(() => {
    if (editTextarea.value) {
      editTextarea.value.focus()
    }
  })
}

const saveEdit = () => {
  if (editingText.value.trim()) {
    const words = editingText.value.trim().split(' ').map(text => ({
      text,
      highlighted: false
    }))
    remembers.value[editingIndex.value] = { words }
  }
  cancelEdit()
}

const cancelEdit = () => {
  editingIndex.value = -1
  editingText.value = ''
}

const startAdding = () => {
  isAdding.value = true
  nextTick(() => {
    if (addTextarea.value) {
      addTextarea.value.focus()
    }
  })
}

const addRemember = () => {
  if (newRememberText.value.trim() && remembers.value.length < 3) {
    const words = newRememberText.value.trim().split(' ').map(text => ({
      text,
      highlighted: false
    }))
    remembers.value.push({ words })
  }
  cancelAdding()
}

const cancelAdding = () => {
  isAdding.value = false
  newRememberText.value = ''
}
</script>
