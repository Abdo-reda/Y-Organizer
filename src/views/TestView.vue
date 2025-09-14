<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8">
    <div class="relative mb-8">
      <!-- Single circle that transforms between solid and ring -->
      <div 
        @click="toggleState"
        class="relative w-48 h-48 rounded-full cursor-pointer transition-all duration-700 ease-out transform hover:scale-105"
        :style="circleStyle"
      >
        <!-- Progress indicator when in ring mode -->
        <div 
          v-if="isRing" 
          class="absolute inset-0 flex items-center justify-center text-white font-bold text-xl transition-opacity duration-300"
        >
          {{ Math.round(progress) }}%
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-col items-center space-y-4">
      <div class="flex items-center space-x-4">
        <label class="text-white font-medium">Progress:</label>
        <input 
          v-model="progress" 
          type="range" 
          min="0" 
          max="100" 
          class="w-48 accent-purple-500"
        >
        <span class="text-white font-mono">{{ Math.round(progress) }}%</span>
      </div>
      
      <div class="flex space-x-4">
        <button 
          @click="reset"
          class="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
        <button 
          @click="animateProgress"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
        >
          Animate Progress
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isRing = ref(false)
const progress = ref(75)

const toggleState = () => {
  isRing.value = !isRing.value
}

const reset = () => {
  isRing.value = false
  progress.value = 75
}

const animateProgress = () => {
  if (!isRing.value) return
  
  let current = 0
  const target = 100
  const duration = 2000
  const steps = 60
  const increment = target / steps
  const stepDuration = duration / steps
  
  const animate = () => {
    if (current < target) {
      current += increment
      progress.value = Math.min(current, target)
      setTimeout(animate, stepDuration)
    }
  }
  
  progress.value = 0
  animate()
}

//  Simplified the ring implementation using CSS mask for cleaner code
const circleStyle = computed(() => {
  const baseGradient = 'conic-gradient(from 0deg, #8b5cf6, #06b6d4, #10b981, #8b5cf6)'
  
  if (!isRing.value) {
    // Solid circle state
    return {
      background: baseGradient,
      boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
    }
  } else {
    // Ring state with progress
    const progressAngle = (progress.value / 100) * 360
    
    return {
      background: `conic-gradient(from 0deg, #8b5cf6 0deg, #06b6d4 ${progressAngle * 0.33}deg, #10b981 ${progressAngle * 0.66}deg, #8b5cf6 ${progressAngle}deg, transparent ${progressAngle}deg)`,
      mask: 'radial-gradient(circle, transparent 60px, black 60px)',
      WebkitMask: 'radial-gradient(circle, transparent 60px, black 60px)',
      boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)'
    }
  }
})
</script>
