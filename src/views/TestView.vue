<template>
  <div class="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 shadow-sm border border-white/50 max-w-md mx-auto">
    <!-- Removed all logo variations, kept only enhanced glass sphere with gradient background -->
    <div class="flex flex-col items-center space-y-8 mb-8">
      <!-- Enhanced Glass Sphere Logo -->
      <div class="flex flex-col items-center space-y-4">
        <div class="relative">
          <div class="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-500" 
               style="background: linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1)); 
                      backdrop-filter: blur(20px); 
                      border: 1px solid rgba(255,255,255,0.4);
                      box-shadow: 0 20px 60px rgba(0,0,0,0.15), 
                                  inset 0 2px 0 rgba(255,255,255,0.6), 
                                  inset 0 -2px 0 rgba(0,0,0,0.1),
                                  0 0 40px rgba(147, 51, 234, 0.1);">
            <span class="text-gray-800 text-5xl font-bold drop-shadow-sm">Y</span>
            <!-- Enhanced glass reflection effects -->
            <div class="absolute top-4 left-6 w-8 h-8 rounded-full bg-white/40 blur-sm"></div>
            <div class="absolute top-8 right-8 w-4 h-4 rounded-full bg-white/20 blur-sm"></div>
            <div class="absolute bottom-6 left-8 w-6 h-6 rounded-full bg-white/10 blur-md"></div>
          </div>
          <!-- Subtle glow effect around the sphere -->
          <div class="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-xl -z-10 animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- About Text -->
    <div class="text-center space-y-4">
      <h2 class="text-2xl font-semibold text-gray-900">Organizer</h2>
      <p class="text-gray-600 text-sm leading-relaxed">
        A beautiful and intuitive productivity app designed to help you organize your life, track your habits, and achieve your goals with elegance and simplicity.
      </p>
      <div class="pt-4 border-t border-white/30">
        <p class="text-xs text-gray-500">
          Created with ❤️ by <span class="font-medium text-gray-700">Your Name</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Removed all unused animations, kept only subtle pulse for glow effect */
</style>
