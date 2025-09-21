<template>
  <div class="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 h-64 cursor-pointer group transition-all duration-500 hover:shadow-xl hover:scale-[1.02]" @click="nextReflection">
    <!-- Floating particles background -->
    <div class="absolute inset-0 overflow-hidden">
      <div 
        v-for="i in 12" 
        :key="i"
        class="absolute w-2 h-2 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full opacity-30 animate-float"
        :style="{
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 4 + 's',
          animationDuration: (3 + Math.random() * 2) + 's'
        }"
      ></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 h-full flex flex-col justify-between">
      <!-- Header -->
      <div class="text-center">
        <h3 class="text-lg font-medium text-indigo-800 mb-1">Daily Reflection</h3>
        <div class="w-12 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 mx-auto rounded-full"></div>
      </div>

      <!-- Reflection prompt -->
      <div class="flex-1 flex items-center justify-center px-4">
        <div class="text-center transition-all duration-700 ease-out" :class="isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'">
          <p class="text-gray-700 text-lg leading-relaxed font-light">
            {{ currentReflection }}
          </p>
        </div>
      </div>

      <!-- Bottom indicator -->
      <div class="flex justify-center items-center space-x-2">
        <div 
          v-for="(_, index) in reflections" 
          :key="index"
          class="w-2 h-2 rounded-full transition-all duration-300"
          :class="index === currentIndex ? 'bg-indigo-400 scale-125' : 'bg-gray-300'"
        ></div>
        <div class="ml-4 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Tap to reflect
        </div>
      </div>
    </div>

    <!-- Ripple effect on click -->
    <div 
      v-if="showRipple"
      class="absolute inset-0 pointer-events-none"
    >
      <div class="absolute w-4 h-4 bg-indigo-200 rounded-full animate-ping opacity-75" :style="rippleStyle"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const reflections = [
  "What brought you joy today?",
  "How did you grow as a person?",
  "What are you grateful for right now?",
  "What would you do differently?",
  "How did you help someone today?",
  "What challenged you the most?",
  "What made you smile?",
  "How did you take care of yourself?"
]

const currentIndex = ref(0)
const isTransitioning = ref(false)
const showRipple = ref(false)
const rippleStyle = ref({})

const currentReflection = computed(() => reflections[currentIndex.value])

const nextReflection = (event) => {
  // Create ripple effect
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  rippleStyle.value = {
    left: x - 8 + 'px',
    top: y - 8 + 'px'
  }
  
  showRipple.value = true
  setTimeout(() => showRipple.value = false, 600)

  // Transition to next reflection
  isTransitioning.value = true
  
  setTimeout(() => {
    currentIndex.value = (currentIndex.value + 1) % reflections.length
    isTransitioning.value = false
  }, 350)
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.6;
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}
</style>
