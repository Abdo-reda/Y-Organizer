<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-80">
    <!-- Simplified header with just the title -->
    <div class="text-center mb-12">
      <h3 class="text-xl font-medium text-gray-800">Focus</h3>
    </div>

    <!-- Enhanced breathing circle with smoother animations and better visual feedback -->
    <div class="flex justify-center mb-12">
      <div 
        @click="toggleBreathing"
        class="w-40 h-40 rounded-full transition-all duration-[3000ms] ease-in-out cursor-pointer flex items-center justify-center relative overflow-hidden"
        :class="[
          breathingPhase === 'inhale' ? 'bg-gradient-to-br from-blue-400 to-blue-600 scale-125 shadow-2xl shadow-blue-400/30' : 
          breathingPhase === 'hold' ? 'bg-gradient-to-br from-purple-400 to-purple-600 scale-125 shadow-2xl shadow-purple-400/30' : 
          breathingPhase === 'exhale' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 scale-90 shadow-lg shadow-emerald-400/20' : 
          'bg-gradient-to-br from-slate-300 to-slate-400 scale-100 hover:scale-105 shadow-lg'
        ]"
      >
        <!-- Added ripple effect and improved center indicator -->
        <div 
          v-if="isBreathing"
          class="absolute inset-0 rounded-full bg-white/10 animate-ping"
        ></div>
        <div 
          class="w-4 h-4 rounded-full bg-white/90 transition-all duration-1000 relative z-10"
          :class="isBreathing ? 'animate-pulse scale-110' : 'scale-100'"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FocusBreathingCard',
  data() {
    return {
      isBreathing: false,
      breathingPhase: null,
      breathingInterval: null,
      phases: [
        { name: 'inhale', duration: 4000 },
        { name: 'hold', duration: 7000 },
        { name: 'exhale', duration: 8000 }
      ],
      currentPhaseIndex: 0
    }
  },
  methods: {
    toggleBreathing() {
      if (this.isBreathing) {
        this.stopBreathing()
      } else {
        this.startBreathing()
      }
    },
    
    startBreathing() {
      this.isBreathing = true
      this.currentPhaseIndex = 0
      this.startPhase()
    },
    
    stopBreathing() {
      this.isBreathing = false
      this.breathingPhase = null
      
      if (this.breathingInterval) {
        clearTimeout(this.breathingInterval)
      }
    },
    
    startPhase() {
      if (!this.isBreathing) return
      
      const phase = this.phases[this.currentPhaseIndex]
      this.breathingPhase = phase.name
      
      this.breathingInterval = setTimeout(() => {
        this.nextPhase()
      }, phase.duration)
    },
    
    nextPhase() {
      this.currentPhaseIndex++
      
      if (this.currentPhaseIndex >= this.phases.length) {
        this.currentPhaseIndex = 0
      }
      
      if (this.isBreathing) {
        this.startPhase()
      }
    }
  },
  
  beforeUnmount() {
    this.stopBreathing()
  }
}
</script>
