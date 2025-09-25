<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="px-6 py-8">
      <div class="flex items-center justify-center max-w-4xl mx-auto relative">
        <div class="flex items-center gap-2">
          <h1 class="text-3xl font-bold text-blue-600">{{ getRelativeDay() }}</h1>
          <button 
            @click="showDatePicker = true"
            class="text-xs font-medium text-gray-400 hover:text-blue-600 transition-colors"
          >
            {{ formatDate() }}
          </button>
        </div>
        
        <div class="absolute right-0 text-2xl font-medium text-gray-500">
          {{ currentTime }}
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-6 max-w-4xl mx-auto space-y-6">
      <!-- Monthly Goals Card -->
      <div class="bg-white rounded-xl shadow-sm p-6 relative">
        <!-- Centered add button aligned with card text -->
        <div class="text-center mb-6 relative">
          <h2 class="text-2xl font-bold text-gray-900">Monthly Goals</h2>
          <p class="text-lg text-gray-500 mt-1">{{ getMonthName() }}</p>
          <button
            @click="showAddGoal = true"
            class="absolute right-0 top-0 w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all flex items-center justify-center"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <!-- Goals List -->
        <div class="space-y-2">
          <div 
            v-for="goal in goals" 
            :key="goal.id"
            @click="addPoint(goal.id)"
            @click.ctrl="editGoal(goal.id)"
            @contextmenu.prevent="subtractPoint(goal.id)"
            class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer relative"
            :class="{ 'animate-pulse': goal.isAnimating }"
          >
            <!-- Updated animated border with conic gradient moving effect -->
            <div 
              v-if="goal.showBorder" 
              class="absolute inset-0 rounded-lg border-gradient-animated"
              :style="{ 
                '--border-color': goal.gradient.split(',')[0].replace('linear-gradient(135deg, ', '').replace(' 0%', ''),
                '--border-angle': '0turn'
              }"
            ></div>
            
            <div class="relative">
              <div 
                class="w-12 h-12 rounded-full"
                :style="{ background: goal.gradient }"
              >
              </div>
            </div>

            <!-- Goal Content -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-semibold text-gray-900">{{ goal.title }}</h3>
                <span 
                  class="px-2 py-1 text-xs font-medium rounded-full text-white"
                  :style="{ backgroundColor: goal.tagColor }"
                >
                  {{ goal.category }}
                </span>
              </div>
              <p class="text-sm text-gray-600">{{ goal.description }}</p>
            </div>

            <!-- Made points text even smaller (text-2xs) -->
            <div class="relative flex items-center justify-center">
              <div v-if="goal.maxPoints" class="absolute inset-0 flex items-center justify-center">
                <svg class="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(0,0,0,0.1)"
                    stroke-width="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    :stroke="goal.gradient.split(',')[0].replace('linear-gradient(135deg, ', '')"
                    stroke-width="2"
                    :stroke-dasharray="`${(goal.points / goal.maxPoints) * 100}, 100`"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              
              <button
                @click.stop="addPoint(goal.id)"
                class="flex items-center gap-1 px-2 py-1 rounded-lg transition-all relative z-10"
              >
                <span 
                  class="font-bold"
                  style="font-size: 10px;"
                  :style="{ background: goal.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }"
                >
                  {{ goal.points }}
                </span>
                <span 
                  class="font-bold"
                  style="font-size: 10px;"
                  :style="{ background: goal.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }"
                >
                  +
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Pomodoro Timer card with alt-click for break -->
      <div class="bg-white rounded-xl shadow-sm p-6 relative">
        <div class="text-center mb-6 relative">
          <h2 class="text-2xl font-bold text-gray-900">Pomodoro Timer</h2>
          <div class="absolute left-0 top-0 flex items-center gap-1 text-gray-400">
            <span class="text-sm">{{ completedPomodoros }}</span>
            <div class="flex">
              <svg v-for="n in Math.min(completedPomodoros, 10)" :key="n" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <div 
            @click="toggleTimer"
            @click.ctrl="showEditTimer = true"
            @click.alt="completePomodoro"
            @contextmenu.prevent="resetTimer"
            class="relative w-32 h-32 cursor-pointer"
          >
            <!-- Progress circle -->
            <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(0,0,0,0.1)"
                stroke-width="3"
              />
              <path
                v-if="isTimerActive || isBreakActive"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                :stroke="isBreakActive ? 'url(#breakGradient)' : 'url(#pomodoroGradient)'"
                stroke-width="3"
                :stroke-dasharray="`${(timeRemaining / (currentTimerDuration * 60)) * 100}, 100`"
                stroke-linecap="round"
              />
            </svg>
            
            <!-- Timer display -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <span class="text-2xl font-bold text-gray-700">
                  {{ formatTime(timeRemaining) }}
                </span>
                <div v-if="isBreakActive" class="text-xs text-gray-500 mt-1">Break</div>
              </div>
            </div>

            <!-- SVG gradient definitions -->
            <svg width="0" height="0">
              <defs>
                <linearGradient id="pomodoroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <!-- Updated Notes card - removed dashed border and renamed to "Notes" -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Notes</h2>
        </div>
        
        <div 
          @click="focusNotes"
          class="min-h-32 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-text"
        >
          <textarea
            ref="notesTextarea"
            v-model="todaysNotes"
            placeholder="Click here to add your thoughts, reflections, or notes for today..."
            class="w-full h-full min-h-24 resize-none border-none outline-none text-gray-700 placeholder-gray-400 bg-transparent"
          ></textarea>
        </div>
      </div>

      <!-- Added new Gratitude card -->
      <div class="bg-white rounded-xl shadow-sm p-6 relative">
        <div class="text-center mb-6 relative">
          <h2 class="text-2xl font-bold text-gray-900">Gratitude</h2>
          <button
            @click="showAddGratitude = true"
            class="absolute right-0 top-0 w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all flex items-center justify-center"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div class="space-y-3">
          <div 
            v-for="gratitude in gratitudes" 
            :key="gratitude.id"
            class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div 
              class="w-3 h-3 rounded-full mt-1 flex-shrink-0"
              :style="{ backgroundColor: gratitude.color }"
            ></div>
            
            <div class="flex-1">
              <p class="text-gray-900 leading-relaxed">
                <span 
                  v-for="(word, index) in gratitude.words" 
                  :key="index"
                  @click="toggleWordColor(gratitude.id, index)"
                  class="cursor-pointer transition-all duration-200 gratitude-word"
                  :style="{ 
                    color: word.isColored ? gratitude.color : 'inherit',
                    '--hover-color': gratitude.color
                  }"
                >
                  {{ word.text }}{{ index < gratitude.words.length - 1 ? ' ' : '' }}
                </span>
              </p>
              <p v-if="gratitude.description" class="text-xs text-gray-500 mt-1">{{ gratitude.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!--  Updated Tasks card layout to be vertical and added collapsible Later section with deadlines and priorities -->
      <div class="bg-white rounded-xl shadow-sm p-6 relative">
        <div class="text-center mb-6 relative">
          <h2 class="text-2xl font-bold text-gray-900">Tasks</h2>
          <button
            @click="showAddTask = true"
            class="absolute right-0 top-0 w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all flex items-center justify-center"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div class="space-y-6">
          <!-- Today Section -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Today</h3>
            <div class="space-y-2">
              <div 
                v-for="task in todayTasks" 
                :key="task.id"
                class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <button
                  @click="toggleTaskStatus(task.id)"
                  class="mt-1 w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
                  :class="{
                    'bg-green-500 border-green-500': task.status === 'completed',
                    'bg-yellow-500 border-yellow-500': task.status === 'partial',
                    'border-gray-300 hover:border-blue-500': task.status === 'pending'
                  }"
                >
                  <svg v-if="task.status === 'completed'" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <div v-else-if="task.status === 'partial'" class="w-2 h-2 bg-white rounded-full"></div>
                </button>
                
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h4 class="font-medium text-gray-900" :class="{ 'line-through text-gray-500': task.status === 'completed' }">
                      {{ task.title }}
                    </h4>
                    <span 
                      class="px-2 py-1 text-xs font-medium rounded-full text-white"
                      :style="{ backgroundColor: task.activityColor }"
                    >
                      {{ task.activity }}
                    </span>
                    <!-- Priority indicator -->
                    <div v-if="task.priority" class="flex items-center">
                      <svg 
                        v-for="n in task.priority" 
                        :key="n"
                        class="w-3 h-3"
                        :class="{
                          'text-red-500': task.priority === 3,
                          'text-orange-500': task.priority === 2,
                          'text-blue-500': task.priority === 1
                        }"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fill-rule="evenodd" d="M10 3l7 7-7 7V3z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <!-- Deadline indicator -->
                    <div v-if="task.deadline" class="flex items-center gap-1 text-xs text-gray-600">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                      </svg>
                      <span>{{ getTimeLeft(task.deadline) }}</span>
                    </div>
                  </div>
                  <p v-if="task.description" class="text-sm text-gray-600">{{ task.description }}</p>
                </div>
                
                <button
                  @click="moveTask(task.id, 'later')"
                  class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-all"
                  title="Move to Later"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Later/General Section - Collapsible -->
          <div>
            <button
              @click="laterSectionCollapsed = !laterSectionCollapsed"
              class="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors"
            >
              <svg 
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-90': !laterSectionCollapsed }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              Later ({{ laterTasks.length }})
            </button>
            <div v-show="!laterSectionCollapsed" class="space-y-2">
              <div 
                v-for="task in laterTasks" 
                :key="task.id"
                class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <button
                  @click="toggleTaskStatus(task.id)"
                  class="mt-1 w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
                  :class="{
                    'bg-green-500 border-green-500': task.status === 'completed',
                    'bg-yellow-500 border-yellow-500': task.status === 'partial',
                    'border-gray-300 hover:border-blue-500': task.status === 'pending'
                  }"
                >
                  <svg v-if="task.status === 'completed'" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <div v-else-if="task.status === 'partial'" class="w-2 h-2 bg-white rounded-full"></div>
                </button>
                
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h4 class="font-medium text-gray-900" :class="{ 'line-through text-gray-500': task.status === 'completed' }">
                      {{ task.title }}
                    </h4>
                    <span 
                      class="px-2 py-1 text-xs font-medium rounded-full text-white"
                      :style="{ backgroundColor: task.activityColor }"
                    >
                      {{ task.activity }}
                    </span>
                    <!-- Priority indicator -->
                    <div v-if="task.priority" class="flex items-center">
                      <svg 
                        v-for="n in task.priority" 
                        :key="n"
                        class="w-3 h-3"
                        :class="{
                          'text-red-500': task.priority === 3,
                          'text-orange-500': task.priority === 2,
                          'text-blue-500': task.priority === 1
                        }"
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fill-rule="evenodd" d="M10 3l7 7-7 7V3z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <!-- Deadline indicator -->
                    <div v-if="task.deadline" class="flex items-center gap-1 text-xs text-gray-600">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                      </svg>
                      <span>{{ getTimeLeft(task.deadline) }}</span>
                    </div>
                  </div>
                  <p v-if="task.description" class="text-sm text-gray-600">{{ task.description }}</p>
                </div>
                
                <button
                  @click="moveTask(task.id, 'today')"
                  class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-all"
                  title="Move to Today"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Added new Pinned Notes card -->
      <div class="bg-white rounded-xl shadow-sm p-6 relative">
        <div class="text-center mb-6 relative">
          <h2 class="text-2xl font-bold text-gray-900">Things to Remember</h2>
          <button
            @click="showAddReminder = true"
            class="absolute right-0 top-0 w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all flex items-center justify-center"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div class="space-y-3">
          <div 
            v-for="reminder in reminders" 
            :key="reminder.id"
            class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
          >
            <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div class="flex-1">
              <p class="text-gray-900 font-medium">{{ reminder.text }}</p>
            </div>
            <button
              @click="removeReminder(reminder.id)"
              class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!--  Added Doodle card with dot grid, color picker, and drawing functionality -->
      <div class="bg-white rounded-xl shadow-sm p-6 relative">
        <div class="flex justify-between items-center mb-4">
          <!-- Color picker - top left -->
          <div class="flex gap-2">
            <button
              v-for="color in doodleColors"
              :key="color"
              @click="selectedDoodleColor = color"
              class="w-6 h-6 rounded-full border-2 transition-all"
              :class="{ 'border-gray-800 scale-110': selectedDoodleColor === color, 'border-gray-300': selectedDoodleColor !== color }"
              :style="{ backgroundColor: color }"
            ></button>
          </div>
          
          <!-- Clear and Save buttons - top right -->
          <div class="flex gap-2">
            <button
              @click="clearDoodle"
              class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear
            </button>
            <button
              @click="saveDoodle"
              class="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>

        <div class="text-center mb-4">
          <h2 class="text-2xl font-bold text-gray-900">Doodle</h2>
        </div>

        <canvas
          ref="doodleCanvas"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          class="w-full border border-gray-200 rounded-lg cursor-crosshair"
          width="600"
          height="400"
        ></canvas>
      </div>

      <!--  Added Eisenhower Matrix card for task visualization -->
      <div class="bg-white rounded-xl shadow-sm p-6 relative">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Eisenhower Matrix</h2>
          <p class="text-sm text-gray-600 mt-1">Tasks plotted by Urgency vs Importance</p>
        </div>

        <div class="relative w-full h-96 border border-gray-200 rounded-lg">
          <!-- Grid lines -->
          <div class="absolute inset-0">
            <div class="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300"></div>
            <div class="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
          </div>

          <!-- Quadrant labels -->
          <div class="absolute top-2 left-2 text-xs font-medium text-gray-600">Important & Urgent</div>
          <div class="absolute top-2 right-2 text-xs font-medium text-gray-600">Important & Not Urgent</div>
          <div class="absolute bottom-2 left-2 text-xs font-medium text-gray-600">Not Important & Urgent</div>
          <div class="absolute bottom-2 right-2 text-xs font-medium text-gray-600">Not Important & Not Urgent</div>

          <!-- Axis labels -->
          <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">Urgency →</div>
          <div class="absolute -left-16 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-700">Importance ↑</div>

          <!-- Task dots -->
          <div
            v-for="task in allTasks"
            :key="task.id"
            class="absolute w-3 h-3 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
            :style="{
              backgroundColor: task.activityColor,
              left: `${getTaskUrgency(task)}%`,
              top: `${100 - getTaskImportance(task)}%`
            }"
            :title="`${task.title} - ${task.activity}`"
          ></div>
        </div>
      </div>
    </main>

    <!-- Date Picker Modal -->
    <div v-if="showDatePicker" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 shadow-xl">
        <h3 class="text-lg font-semibold mb-4">Select Date</h3>
        <input
          type="date"
          v-model="selectedDateInput"
          @change="updateSelectedDate"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
        <div class="flex gap-3 mt-4">
          <button
            @click="showDatePicker = false"
            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="showDatePicker = false"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>

    <!-- Added Edit Timer Modal -->
    <div v-if="showEditTimer" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Edit Timer Duration</h3>
        <form @submit.prevent="updateTimerDuration">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                v-model.number="newTimerDuration"
                type="number"
                min="1"
                max="60"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="25"
              >
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="showEditTimer = false"
              class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Goal Modal -->
    <div v-if="showAddGoal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Add New Goal</h3>
        <form @submit.prevent="addGoal">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                v-model="newGoal.title"
                type="text"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Goal title"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="newGoal.description"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Goal description"
                rows="3"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                v-model="newGoal.category"
                type="text"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Health, Work, Personal"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max Points (optional)</label>
              <input
                v-model.number="newGoal.maxPoints"
                type="number"
                min="1"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Leave empty for unlimited"
              >
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="showAddGoal = false"
              class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Goal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Goal Modal -->
    <div v-if="showEditGoal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Edit Goal</h3>
        <form @submit.prevent="updateGoal">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                v-model="editingGoal.title"
                type="text"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Goal title"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                v-model="editingGoal.description"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Goal description"
                rows="3"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                v-model="editingGoal.category"
                type="text"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Health, Work, Personal"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Max Points (optional)</label>
              <input
                v-model.number="editingGoal.maxPoints"
                type="number"
                min="1"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Leave empty for unlimited"
              >
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="showEditGoal = false"
              class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update Goal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Gratitude Modal -->
    <div v-if="showAddGratitude" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Add New Gratitude</h3>
        <form @submit.prevent="addGratitude">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">What are you grateful for?</label>
              <textarea
                v-model="newGratitude.text"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="I'm grateful for..."
                rows="3"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <input
                v-model="newGratitude.description"
                type="text"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional details..."
              >
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="showAddGratitude = false"
              class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Gratitude
            </button>
          </div>
        </form>
      </div>
    </div>

    <!--  Updated Add Task Modal to include deadline and priority fields -->
    <div v-if="showAddTask" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Add New Task</h3>
        <form @submit.prevent="addTask">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
              <input
                v-model="newTask.title"
                type="text"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What needs to be done?"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <textarea
                v-model="newTask.description"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional details..."
                rows="2"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Activity</label>
              <input
                v-model="newTask.activity"
                type="text"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Work, Personal, Health"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                v-model="newTask.section"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="later">Later</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Deadline (optional)</label>
              <input
                v-model="newTask.deadline"
                type="datetime-local"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Priority (optional)</label>
              <select
                v-model="newTask.priority"
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">No Priority</option>
                <option value="1">Low Priority</option>
                <option value="2">Medium Priority</option>
                <option value="3">High Priority</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="showAddTask = false"
              class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Reminder Modal -->
    <div v-if="showAddReminder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Add Reminder</h3>
        <form @submit.prevent="addReminder">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">What to remember?</label>
              <textarea
                v-model="newReminder.text"
                required
                class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Something important to remember..."
                rows="3"
              ></textarea>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="showAddReminder = false"
              class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { DateTime } from 'luxon'

const selectedDate = ref(new Date())
const selectedDateInput = ref('')
const currentTime = ref('')
const showDatePicker = ref(false)
const showAddGoal = ref(false)
const showEditGoal = ref(false)
const editingGoal = ref({})
const todaysNotes = ref('')
const notesTextarea = ref(null)
const newGoal = ref({
  title: '',
  description: '',
  category: '',
  maxPoints: null
})

// Added Pomodoro timer reactive variables
const isTimerActive = ref(false)
const timerDuration = ref(25) // minutes
const timeRemaining = ref(25 * 60) // seconds
const completedPomodoros = ref(3)
const showEditTimer = ref(false)
const newTimerDuration = ref(25)
let timerInterval = null

const goals = ref([
  {
    id: 1,
    title: 'Exercise Daily',
    description: 'Complete 30 minutes of physical activity',
    category: 'Health',
    points: 45,
    maxPoints: 100,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    tagColor: '#10b981',
    isAnimating: false,
    showSplash: false,
    showBorder: false
  },
  {
    id: 2,
    title: 'Read Books',
    description: 'Read for at least 20 minutes daily',
    category: 'Learning',
    points: 30,
    maxPoints: 60,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    tagColor: '#3b82f6',
    isAnimating: false,
    showSplash: false,
    showBorder: false
  },
  {
    id: 3,
    title: 'Side Project',
    description: 'Work on personal coding projects',
    category: 'Career',
    points: 25,
    maxPoints: null,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    tagColor: '#8b5cf6',
    isAnimating: false,
    showSplash: false,
    showBorder: false
  }
])

// Added Pomodoro timer functions
const toggleTimer = () => {
  isTimerActive.value = !isTimerActive.value
  
  if (isTimerActive.value) {
    timerInterval = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--
      } else {
        // Timer completed
        isTimerActive.value = false
        if (!isBreakActive.value) {
          completedPomodoros.value++
        } else {
          isBreakActive.value = false
          currentTimerDuration.value = timerDuration.value
        }
        resetTimer()
        clearInterval(timerInterval)
      }
    }, 1000)
  } else {
    clearInterval(timerInterval)
  }
}

const resetTimer = () => {
  isTimerActive.value = false
  isBreakActive.value = false
  currentTimerDuration.value = timerDuration.value
  timeRemaining.value = timerDuration.value * 60
  if (timerInterval) {
    clearInterval(timerInterval)
  }
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const updateTimerDuration = () => {
  timerDuration.value = newTimerDuration.value
  resetTimer()
  showEditTimer.value = false
}

const completePomodoro = () => {
  if (!isBreakActive.value) {
    // Complete current pomodoro and start break
    isTimerActive.value = false
    completedPomodoros.value++
    isBreakActive.value = true
    currentTimerDuration.value = 5 // 5 minute break
    timeRemaining.value = 5 * 60
    isTimerActive.value = true
    
    if (timerInterval) clearInterval(timerInterval)
    
    timerInterval = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--
      } else {
        // Break completed
        isTimerActive.value = false
        isBreakActive.value = false
        currentTimerDuration.value = timerDuration.value
        resetTimer()
        clearInterval(timerInterval)
      }
    }, 1000)
  }
}

// Enhanced relative day function
const getRelativeDay = () => {
  const today = new Date()
  const selected = selectedDate.value
  
  const todayStr = today.toDateString()
  const selectedStr = selected.toDateString()
  
  if (todayStr === selectedStr) return 'Today'
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (yesterday.toDateString() === selectedStr) return 'Yesterday'
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (tomorrow.toDateString() === selectedStr) return 'Tomorrow'
  
  const diffTime = selected.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays > 0) return `In ${diffDays} days`
  return `${Math.abs(diffDays)} days ago`
}

const formatDate = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayName = days[selectedDate.value.getDay()]
  const dateStr = selectedDate.value.toISOString().split('T')[0]
  return `${dayName} ${dateStr}`
}

const getMonthName = () => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[selectedDate.value.getMonth()]
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const updateSelectedDate = () => {
  selectedDate.value = new Date(selectedDateInput.value)
}

const addPoint = (goalId) => {
  const goal = goals.value.find(g => g.id === goalId)
  if (goal) {
    goal.points += 1
    
    // Show animated border
    goal.showBorder = true
    setTimeout(() => {
      goal.showBorder = false
    }, 1000)
  }
}

// Added subtract point function
const subtractPoint = (goalId) => {
  const goal = goals.value.find(g => g.id === goalId)
  if (goal && goal.points > 0) {
    goal.points -= 1
  }
}

// Updated edit goal function to work with ctrl+click
const editGoal = (goalId) => {
  const goal = goals.value.find(g => g.id === goalId)
  if (goal) {
    editingGoal.value = { ...goal }
    showEditGoal.value = true
  }
}

// Added update goal function
const updateGoal = () => {
  const goalIndex = goals.value.findIndex(g => g.id === editingGoal.value.id)
  if (goalIndex !== -1) {
    goals.value[goalIndex] = { ...editingGoal.value }
    showEditGoal.value = false
  }
}

const generateGradient = () => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  ]
  return gradients[Math.floor(Math.random() * gradients.length)]
}

const generateTagColor = () => {
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316']
  return colors[Math.floor(Math.random() * colors.length)]
}

const addGoal = () => {
  if (newGoal.value.title && newGoal.value.category) {
    const goal = {
      id: Date.now(),
      title: newGoal.value.title,
      description: newGoal.value.description,
      category: newGoal.value.category,
      points: 0,
      maxPoints: newGoal.value.maxPoints || null,
      gradient: generateGradient(),
      tagColor: generateTagColor(),
      isAnimating: false,
      showSplash: false,
      showBorder: false
    }
    
    goals.value.push(goal)
    
    // Reset form
    newGoal.value = {
      title: '',
      description: '',
      category: '',
      maxPoints: null
    }
    
    showAddGoal.value = false
  }
}

const focusNotes = () => {
  if (notesTextarea.value) {
    notesTextarea.value.focus()
  }
}

// Added gratitude-related reactive variables
const showAddGratitude = ref(false)
const newGratitude = ref({
  text: '',
  description: ''
})

const gratitudes = ref([
  {
    id: 1,
    text: 'My family and their unwavering support',
    description: 'They always believe in me',
    color: '#10b981',
    words: []
  },
  {
    id: 2,
    text: 'The beautiful sunrise this morning',
    description: '',
    color: '#f59e0b',
    words: []
  },
  {
    id: 3,
    text: 'Having a job that I truly enjoy',
    description: 'It makes every day meaningful',
    color: '#8b5cf6',
    words: []
  }
])

// Added gratitude-related functions
const generateRandomColor = () => {
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#14b8a6']
  return colors[Math.floor(Math.random() * colors.length)]
}

const splitIntoWords = (text) => {
  return text.split(' ').map(word => ({
    text: word,
    isColored: false
  }))
}

const toggleWordColor = (gratitudeId, wordIndex) => {
  const gratitude = gratitudes.value.find(g => g.id === gratitudeId)
  if (gratitude) {
    gratitude.words[wordIndex].isColored = !gratitude.words[wordIndex].isColored
  }
}

const addGratitude = () => {
  if (newGratitude.value.text) {
    const gratitude = {
      id: Date.now(),
      text: newGratitude.value.text,
      description: newGratitude.value.description,
      color: generateRandomColor(),
      words: splitIntoWords(newGratitude.value.text)
    }
    
    gratitudes.value.push(gratitude)
    
    newGratitude.value = {
      text: '',
      description: ''
    }
    
    showAddGratitude.value = false
  }
}

//  Added task-related reactive variables with deadline and priority support
const showAddTask = ref(false)
const laterSectionCollapsed = ref(false)
const newTask = ref({
  title: '',
  description: '',
  activity: '',
  section: 'today',
  deadline: '',
  priority: ''
})

const tasks = ref([
  {
    id: 1,
    title: 'Review project proposal',
    description: 'Go through the client requirements and timeline',
    activity: 'Work',
    activityColor: '#3b82f6',
    section: 'today',
    status: 'pending',
    deadline: DateTime.now().plus({ hours: 4 }).toISO(),
    priority: 3
  },
  {
    id: 2,
    title: 'Call dentist for appointment',
    description: '',
    activity: 'Personal',
    activityColor: '#10b981',
    section: 'today',
    status: 'partial',
    priority: 1
  },
  {
    id: 3,
    title: 'Learn Vue 3 composition API',
    description: 'Complete the advanced tutorial series',
    activity: 'Learning',
    activityColor: '#8b5cf6',
    section: 'later',
    status: 'pending',
    deadline: DateTime.now().plus({ days: 7 }).toISO(),
    priority: 2
  },
  {
    id: 4,
    title: 'Plan weekend trip',
    description: 'Research destinations and book accommodation',
    activity: 'Personal',
    activityColor: '#f59e0b',
    section: 'later',
    status: 'pending'
  }
])

//  Added doodle-related reactive variables and functions
const doodleCanvas = ref(null)
const selectedDoodleColor = ref('#3b82f6')
const doodleColors = ['#3b82f6', '#ef4444', '#10b981']
const isDrawing = ref(false)

//  Added computed properties for task sections and matrix
const todayTasks = computed(() => tasks.value.filter(task => task.section === 'today'))
const laterTasks = computed(() => tasks.value.filter(task => task.section === 'later'))
const allTasks = computed(() => tasks.value)

// Added reminder-related reactive variables
const showAddReminder = ref(false)
const newReminder = ref({
  text: ''
})

const reminders = ref([
  {
    id: 1,
    text: 'Remember to backup important files every Friday'
  },
  {
    id: 2,
    text: 'Mom\'s birthday is next month - plan something special'
  },
  {
    id: 3,
    text: 'Annual health checkup is due in 2 weeks'
  }
])

//  Added task management functions with deadline and priority support
const addTask = () => {
  const activityColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']
  const randomColor = activityColors[Math.floor(Math.random() * activityColors.length)]
  
  tasks.value.push({
    id: Date.now(),
    title: newTask.value.title,
    description: newTask.value.description,
    activity: newTask.value.activity,
    activityColor: randomColor,
    section: newTask.value.section,
    status: 'pending',
    deadline: newTask.value.deadline || null,
    priority: newTask.value.priority ? parseInt(newTask.value.priority) : null
  })
  
  newTask.value = {
    title: '',
    description: '',
    activity: '',
    section: 'today',
    deadline: '',
    priority: ''
  }
  showAddTask.value = false
}

const toggleTaskStatus = (taskId) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    if (task.status === 'pending') task.status = 'partial'
    else if (task.status === 'partial') task.status = 'completed'
    else task.status = 'pending'
  }
}

const moveTask = (taskId, newSection) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.section = newSection
  }
}

const getTimeLeft = (deadline) => {
  if (!deadline) return ''
  const deadlineDate = DateTime.fromISO(deadline)
  return deadlineDate.toRelative()
}

// Added reminder management functions
const addReminder = () => {
  if (newReminder.value.text) {
    const reminder = {
      id: Date.now(),
      text: newReminder.value.text
    }
    
    reminders.value.push(reminder)
    
    newReminder.value = {
      text: ''
    }
    
    showAddReminder.value = false
  }
}

const removeReminder = (reminderId) => {
  const index = reminders.value.findIndex(r => r.id === reminderId)
  if (index !== -1) {
    reminders.value.splice(index, 1)
  }
}

//  Added doodle functions
const initDoodle = () => {
  const canvas = doodleCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  
  // Draw dot grid
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#e5e7eb'
  
  for (let x = 10; x < canvas.width; x += 20) {
    for (let y = 10; y < canvas.height; y += 20) {
      ctx.beginPath()
      ctx.arc(x, y, 1, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
}

const startDrawing = (e) => {
  isDrawing.value = true
  draw(e)
}

const draw = (e) => {
  if (!isDrawing.value) return
  
  const canvas = doodleCanvas.value
  const ctx = canvas.getContext('2d')
  const rect = canvas.getBoundingClientRect()
  
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  ctx.fillStyle = selectedDoodleColor.value
  ctx.beginPath()
  ctx.arc(x, y, 3, 0, 2 * Math.PI)
  ctx.fill()
}

const stopDrawing = () => {
  isDrawing.value = false
}

const clearDoodle = () => {
  initDoodle()
}

const saveDoodle = () => {
  const canvas = doodleCanvas.value
  const link = document.createElement('a')
  link.download = 'doodle.png'
  link.href = canvas.toDataURL()
  link.click()
}

//  Added Eisenhower Matrix functions
const getTaskUrgency = (task) => {
  // Simple algorithm based on deadline and priority
  let urgency = 25 // base urgency
  
  if (task.deadline) {
    const hoursLeft = DateTime.fromISO(task.deadline).diff(DateTime.now(), 'hours').hours
    if (hoursLeft < 24) urgency += 50
    else if (hoursLeft < 72) urgency += 30
    else if (hoursLeft < 168) urgency += 15
  }
  
  if (task.priority) {
    urgency += task.priority * 10
  }
  
  return Math.min(Math.max(urgency, 5), 95)
}

const getTaskImportance = (task) => {
  // Simple algorithm based on activity and priority
  let importance = 25 // base importance
  
  const importantActivities = ['Work', 'Health', 'Learning']
  if (importantActivities.includes(task.activity)) {
    importance += 30
  }
  
  if (task.priority) {
    importance += task.priority * 15
  }
  
  return Math.min(Math.max(importance, 5), 95)
}

const currentTimerDuration = ref(25)
const isBreakActive = ref(false)

let timeInterval

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  selectedDateInput.value = selectedDate.value.toISOString().split('T')[0]
  
  // Initialize words for existing gratitudes
  gratitudes.value.forEach(gratitude => {
    gratitude.words = splitIntoWords(gratitude.text)
  })
  
  // Initialize timer duration input
  newTimerDuration.value = timerDuration.value
  
  nextTick(() => {
    initDoodle()
  })
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
  // Clean up timer interval
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

/* Added custom text selection and cursor styling */
::selection {
  background-color: #3b82f6;
  color: white;
}

::-moz-selection {
  background-color: #3b82f6;
  color: white;
}

input, textarea {
  caret-color: #3b82f6;
}

/* Added custom scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2563eb;
}

/* Added gratitude word hover effect with light opacity */
.gratitude-word:hover {
  background-color: color-mix(in srgb, var(--hover-color) 10%, transparent);
  border-radius: 2px;
  padding: 1px 2px;
}

/* Added CSS for animated border effect similar to the provided example */
@property --border-angle {
  syntax: "<angle>";
  inherits: true;
  initial-value: 0turn;
}

.border-gradient-animated {
  border: solid 2px transparent;
  background: 
    conic-gradient(from var(--border-angle), transparent 25%, var(--border-color), var(--border-color) 99%, transparent) border-box;
  animation: border-spin 2s linear infinite;
}

@keyframes border-spin {
  to {
    --border-angle: 1turn;
  }
}
</style>