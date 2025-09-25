<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-6 py-4">
                <div class="flex items-center justify-between">
                    <div class="text-center flex-1">
                        <h1 class="text-3xl font-bold text-gray-900">Daily Organizer</h1>
                    </div>
                    <div class="text-right">
                        <div class="text-lg font-medium text-gray-900">{{ formatDate(new Date()) }}</div>
                        <div class="text-sm text-gray-500">{{ formatTime(currentTime) }}</div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            <!-- Replaced Current Activity card with Now card and matched title styling -->
            <div v-if="currentActivity"
                class="bg-white rounded-xl shadow-sm p-6 relative border-2 transition-all duration-300"
                :class="currentActivity ? 'shadow-lg' : ''" :style="{
                    borderColor: currentActivity?.color || '#e5e7eb',
                    boxShadow: currentActivity ? `0 0 20px ${currentActivity.color}20, 0 4px 6px -1px rgba(0, 0, 0, 0.1)` : ''
                }">
                <div class="text-center mb-6 relative">
                    <h2 class="text-2xl font-bold text-gray-900">Now</h2>
                    <!-- Made activity name much bigger and bold -->
                    <h3 class="text-4xl font-bold mb-3" :style="{ color: currentActivity?.color || '#111827' }">
                        {{ currentActivity?.name || 'No Activity' }}
                    </h3>
                    <!-- Put start and end time under activity name -->
                    <div class="text-sm text-gray-500 mb-4">
                        {{ currentActivity?.startTime || '--:--' }} - {{ currentActivity?.endTime || '--:--' }}
                    </div>
                </div>

                <!-- Made active task bold with ping animation circle -->
                <div v-if="currentActivity?.currentTask" class="mb-4">
                    <div class="flex items-center justify-center gap-2">
                        <div class="relative">
                            <div class="w-2 h-2 rounded-full animate-ping"
                                :style="{ backgroundColor: currentActivity.color }"></div>
                            <div class="absolute inset-0 w-2 h-2 rounded-full"
                                :style="{ backgroundColor: currentActivity.color }"></div>
                        </div>
                        <span class="font-bold text-gray-800">{{ currentActivity.currentTask }}</span>
                    </div>
                </div>

                <!-- Added collapsible other tasks list with drag functionality -->
                <div v-if="currentActivity?.tasks?.length" class="mt-4">
                    <div class="flex items-center justify-between mb-2">
                        <button @click="showOtherTasks = !showOtherTasks"
                            class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800">
                            <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-90': showOtherTasks }"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                            Other Tasks ({{ currentActivity.tasks.length }})
                        </button>
                        <!-- Moved plus button next to other tasks list -->
                        <button @click="showAddActivityTask = true"
                            class="w-6 h-6 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all flex items-center justify-center">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    <div v-show="showOtherTasks" class="space-y-1">
                        <div v-for="task in currentActivity.tasks" :key="task.id"
                            class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                            @click="setCurrentTask(task.title)" draggable="true" @dragstart="draggedTask = task"
                            @dragover.prevent @drop="setCurrentTask(task.title)">
                            <!-- Made other tasks lighter gray and draggable -->
                            <span class="text-gray-500">{{ task.title }}</span>
                            <div class="w-2 h-2 rounded-full bg-gray-300"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Added 24-hour timeline card for session management -->
            <div class="bg-white rounded-xl shadow-sm p-6 relative col-span-full">
                <div class="text-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-900">Daily Timeline</h2>
                    <p class="text-sm text-gray-600 mt-1">Click time slots to create sessions</p>
                </div>

                <div class="relative">
                    <!-- Time slots grid -->
                    <div class="grid grid-cols-24 gap-1 mb-4">
                        <div v-for="hour in 24" :key="hour" class="text-xs text-gray-500 text-center py-1">
                            {{ String(hour - 1).padStart(2, '0') }}
                        </div>
                    </div>

                    <!-- Sessions display -->
                    <div class="relative h-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <div v-for="session in sessions" :key="session.id"
                            class="absolute top-1 bottom-1 rounded-md cursor-pointer transition-all duration-200 hover:shadow-lg group"
                            :style="{
                                left: `${(session.startHour / 24) * 100}%`,
                                width: `${((session.endHour - session.startHour) / 24) * 100}%`,
                                background: session.activity?.color ?
                                    `linear-gradient(135deg, ${session.activity.color}80, ${session.activity.color}40)` :
                                    'repeating-linear-gradient(45deg, #e5e7eb, #e5e7eb 10px, #f3f4f6 10px, #f3f4f6 20px)',
                                border: session.activity?.color ? `2px solid ${session.activity.color}` : '2px dashed #9ca3af'
                            }" @click="editSession(session)" @mousedown="startDragSession(session, $event)">
                            <div class="p-2 h-full flex flex-col justify-center">
                                <div class="text-xs font-medium text-gray-800 truncate">
                                    {{ session.activity?.name || 'Empty' }}
                                </div>
                                <div class="text-xs text-gray-600 truncate">
                                    {{ session.currentTask || '' }}
                                </div>
                            </div>

                            <!-- Session status indicators -->
                            <div class="absolute top-1 right-1 flex gap-1">
                                <div v-if="session.status === 'successful'" class="w-2 h-2 bg-green-500 rounded-full">
                                </div>
                                <div v-if="session.status === 'needs-improvement'"
                                    class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <div v-if="session.notes" class="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>

                            <!-- Resize handles -->
                            <div
                                class="absolute left-0 top-0 bottom-0 w-1 bg-gray-400 opacity-0 group-hover:opacity-100 cursor-w-resize">
                            </div>
                            <div
                                class="absolute right-0 top-0 bottom-0 w-1 bg-gray-400 opacity-0 group-hover:opacity-100 cursor-e-resize">
                            </div>
                        </div>

                        <!-- Empty time slots -->
                        <div v-for="hour in 24" :key="`slot-${hour}`"
                            class="absolute top-0 bottom-0 border-r border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors"
                            :style="{
                                left: `${((hour - 1) / 24) * 100}%`,
                                width: `${(1 / 24) * 100}%`
                            }" @click="createSession(hour - 1)"></div>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <main class="px-6 max-w-4xl mx-auto space-y-6">
                <!--  Added Current Activity card with glow effect and activity-based styling -->
                <div v-if="currentActivity"
                    class="bg-white rounded-xl shadow-sm p-6 relative border-2 transition-all duration-300"
                    :class="currentActivity ? 'shadow-lg' : ''" :style="{
                        borderColor: currentActivity?.color || '#e5e7eb',
                        boxShadow: currentActivity ? `0 0 20px ${currentActivity.color}20, 0 4px 6px -1px rgba(0, 0, 0, 0.1)` : ''
                    }">
                    <div class="text-center mb-6 relative">
                        <h2 class="text-2xl font-bold" :style="{ color: currentActivity?.color || '#111827' }">
                            Current Activity
                        </h2>
                        <div class="flex items-center justify-center gap-4 mt-2 text-sm text-gray-600">
                            <span>{{ currentActivity?.startTime || '--:--' }} - {{ currentActivity?.endTime || '--:--'
                                }}</span>
                        </div>
                        <button @click="showAddActivityTask = true"
                            class="absolute right-0 top-0 w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all flex items-center justify-center">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    <div class="text-center">
                        <h3 class="text-xl font-semibold mb-2" :style="{ color: currentActivity?.color || '#111827' }">
                            {{ currentActivity?.name || 'No Activity' }}
                        </h3>
                        <p v-if="currentActivity?.currentTask" class="text-gray-600 mb-4">
                            Current Task: {{ currentActivity.currentTask }}
                        </p>
                        <div v-if="currentActivity?.tasks?.length" class="space-y-2 mt-4">
                            <h4 class="text-sm font-medium text-gray-700">Activity Tasks:</h4>
                            <div class="space-y-1">
                                <div v-for="task in currentActivity.tasks" :key="task.id"
                                    class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                                    <span>{{ task.title }}</span>
                                    <button @click="setCurrentTask(task.title)"
                                        class="text-xs px-2 py-1 rounded text-white"
                                        :style="{ backgroundColor: currentActivity.color }">
                                        Set Current
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Monthly Goals Card -->
                <div class="bg-white rounded-xl shadow-sm p-6 relative">
                    <!-- Centered add button aligned with card text -->
                    <div class="text-center mb-6 relative">
                        <h2 class="text-2xl font-bold text-gray-900">Monthly Goals</h2>
                        <p class="text-lg text-gray-500 mt-1">{{ getMonthName() }}</p>
                        <button @click="showAddGoal = true"
                            class="absolute right-0 top-0 w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all flex items-center justify-center">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    <!-- Goals List -->
                    <div class="space-y-2">
                        <div v-for="goal in goals" :key="goal.id" @click="addPoint(goal.id)"
                            @click.ctrl="editGoal(goal.id)" @contextmenu.prevent="subtractPoint(goal.id)"
                            class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer relative"
                            :class="{ 'animate-pulse': goal.isAnimating }">
                            <!-- Updated animated border with conic gradient moving effect -->
                            <div v-if="goal.showBorder" class="absolute inset-0 rounded-lg border-gradient-animated"
                                :style="{
                                    '--border-color': goal.gradient.split(',')[0].replace('linear-gradient(135deg, ', '').replace(' 0%', ''),
                                    '--border-angle': '0turn'
                                }"></div>

                            <div class="relative">
                                <div class="w-12 h-12 rounded-full" :style="{ background: goal.gradient }">
                                </div>
                            </div>

                            <!-- Goal Content -->
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <h3 class="font-semibold text-gray-900">{{ goal.title }}</h3>
                                    <span class="px-2 py-1 text-xs font-medium rounded-full text-white"
                                        :style="{ backgroundColor: goal.tagColor }">
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
                                            fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="2" />
                                        <path
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            :stroke="goal.gradient.split(',')[0].replace('linear-gradient(135deg, ', '')"
                                            stroke-width="2"
                                            :stroke-dasharray="`${(goal.points / goal.maxPoints) * 100}, 100`"
                                            stroke-linecap="round" />
                                    </svg>
                                </div>

                                <button @click.stop="addPoint(goal.id)"
                                    class="flex items-center gap-1 px-2 py-1 rounded-lg transition-all relative z-10">
                                    <span class="font-bold" style="font-size: 10px;"
                                        :style="{ background: goal.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }">
                                        {{ goal.points }}
                                    </span>
                                    <span class="font-bold" style="font-size: 10px;"
                                        :style="{ background: goal.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }">
                                        +
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Pomodoro Timer card with alt-click for break -->
                <!-- Updated Pomodoro Timer to use current activity color -->
                <div class="bg-white rounded-xl shadow-sm p-6 relative">
                    <div class="text-center mb-6 relative">
                        <h2 class="text-2xl font-bold text-gray-900">Pomodoro Timer</h2>
                        <div class="absolute left-0 top-0 flex items-center gap-1 text-gray-400">
                            <span class="text-sm">{{ completedPomodoros }}</span>
                            <div class="flex">
                                <svg v-for="n in Math.min(completedPomodoros, 10)" :key="n" class="w-3 h-3"
                                    fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col items-center">
                        <div class="relative w-48 h-48 mb-6">
                            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="8" />
                                <circle cx="50" cy="50" r="45" fill="none" :stroke="currentActivity?.color || '#3b82f6'"
                                    stroke-width="8"
                                    :stroke-dasharray="`${(timeLeft / (isBreak ? 5 * 60 : defaultTimer * 60)) * 283}, 283`"
                                    stroke-linecap="round" class="transition-all duration-1000" />
                            </svg>

                            <div class="absolute inset-0 flex flex-col items-center justify-center">
                                <div class="text-3xl font-bold text-gray-900">
                                    {{ Math.floor(timeLeft / 60) }}:{{ String(timeLeft % 60).padStart(2, '0') }}
                                </div>
                                <div class="text-sm text-gray-500 mt-1">
                                    {{ isBreak ? 'Break Time' : 'Focus Time' }}
                                </div>
                            </div>
                        </div>

                        <button @click="toggleTimer" @click.right.prevent="resetTimer" @click.ctrl="editTimer"
                            @click.alt="markPomodoroComplete" class="px-6 py-3 rounded-lg font-medium transition-all"
                            :class="isRunning ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'">
                            {{ isRunning ? 'Pause' : 'Start' }}
                        </button>

                        <div class="text-xs text-gray-500 mt-2 text-center">
                            Click: Play/Pause • Right-click: Reset<br>
                            Ctrl+Click: Edit • Alt+Click: Mark Complete
                        </div>
                    </div>
                </div>

                <!-- Updated Notes card - removed dashed border and renamed to "Notes" -->
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-900">Notes</h2>
                    </div>

                    <div @click="focusNotes"
                        class="min-h-32 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-text">
                        <textarea ref="notesTextarea" v-model="todaysNotes"
                            placeholder="Click here to add your thoughts, reflections, or notes for today..."
                            class="w-full h-full min-h-24 resize-none border-none outline-none text-gray-700 placeholder-gray-400 bg-transparent"></textarea>
                    </div>
                </div>

                <!-- Added new Gratitude card -->
                <div class="bg-white rounded-xl shadow-sm p-6 relative">
                    <div class="text-center mb-6 relative">
                        <h2 class="text-2xl font-bold text-gray-900">Gratitude</h2>
                        <button @click="showAddGratitude = true"
                            class="absolute right-0 top-0 w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all flex items-center justify-center">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-3">
                        <div v-for="gratitude in gratitudes" :key="gratitude.id"
                            class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                            <div class="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                                :style="{ backgroundColor: gratitude.color }"></div>

                            <div class="flex-1">
                                <p class="text-gray-900 leading-relaxed">
                                    <span v-for="(word, index) in gratitude.words" :key="index"
                                        @click="toggleWordColor(gratitude.id, index)"
                                        class="cursor-pointer transition-all duration-200 gratitude-word" :style="{
                                            color: word.isColored ? gratitude.color : 'inherit',
                                            '--hover-color': gratitude.color
                                        }">
                                        {{ word.text }}{{ index < gratitude.words.length - 1 ? ' ' : '' }} </span>
                                </p>
                                <p v-if="gratitude.description" class="text-xs text-gray-500 mt-1">{{
                                    gratitude.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!--  Updated Tasks card layout to be vertical and added collapsible Later section with deadlines and priorities -->
                <div class="bg-white rounded-xl shadow-sm p-6 relative">
                    <div class="text-center mb-6 relative">
                        <h2 class="text-2xl font-bold text-gray-900">Tasks</h2>
                        <button @click="showAddTask = true"
                            class="absolute right-0 top-0 w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all flex items-center justify-center">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-6">
                        <!-- Today Section -->
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-3">Today</h3>
                            <div class="space-y-2">
                                <div v-for="task in todayTasks" :key="task.id"
                                    class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                                    <button @click="toggleTaskStatus(task.id)"
                                        class="mt-1 w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
                                        :class="{
                                            'bg-green-500 border-green-500': task.status === 'completed',
                                            'bg-yellow-500 border-yellow-500': task.status === 'partial',
                                            'border-gray-300 hover:border-blue-500': task.status === 'pending'
                                        }">
                                        <svg v-if="task.status === 'completed'" class="w-3 h-3 text-white"
                                            fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <div v-else-if="task.status === 'partial'"
                                            class="w-2 h-2 bg-white rounded-full"></div>
                                    </button>

                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-1">
                                            <h4 class="font-medium text-gray-900"
                                                :class="{ 'line-through text-gray-500': task.status === 'completed' }">
                                                {{ task.title }}
                                            </h4>
                                            <span class="px-2 py-1 text-xs font-medium rounded-full text-white"
                                                :style="{ backgroundColor: task.activityColor }">
                                                {{ task.activity }}
                                            </span>
                                            <!-- Priority indicator -->
                                            <div v-if="task.priority" class="flex items-center">
                                                <svg v-for="n in task.priority" :key="n" class="w-3 h-3" :class="{
                                                    'text-red-500': task.priority === 3,
                                                    'text-orange-500': task.priority === 2,
                                                    'text-blue-500': task.priority === 1
                                                }" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 3l7 7-7 7V3z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                            <!-- Deadline indicator -->
                                            <!--  Replaced Luxon toRelative with mock method -->
                                            <div v-if="task.deadline"
                                                class="flex items-center gap-1 text-xs text-gray-500">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{{ getTimeUntilDeadline(task.deadline) }}</span>
                                            </div>
                                        </div>
                                        <p v-if="task.description" class="text-sm text-gray-600">{{ task.description }}
                                        </p>
                                    </div>

                                    <button @click="moveTask(task.id, 'later')"
                                        class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-all"
                                        title="Move to Later">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Later/General Section - Collapsible -->
                        <div>
                            <button @click="laterSectionCollapsed = !laterSectionCollapsed"
                                class="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                                <svg class="w-4 h-4 transition-transform"
                                    :class="{ 'rotate-90': !laterSectionCollapsed }" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                                Later ({{ laterTasks.length }})
                            </button>
                            <div v-show="!laterSectionCollapsed" class="space-y-2">
                                <div v-for="task in laterTasks" :key="task.id"
                                    class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                                    <button @click="toggleTaskStatus(task.id)"
                                        class="mt-1 w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
                                        :class="{
                                            'bg-green-500 border-green-500': task.status === 'completed',
                                            'bg-yellow-500 border-yellow-500': task.status === 'partial',
                                            'border-gray-300 hover:border-blue-500': task.status === 'pending'
                                        }">
                                        <svg v-if="task.status === 'completed'" class="w-3 h-3 text-white"
                                            fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        <div v-else-if="task.status === 'partial'"
                                            class="w-2 h-2 bg-white rounded-full"></div>
                                    </button>

                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-1">
                                            <h4 class="font-medium text-gray-900"
                                                :class="{ 'line-through text-gray-500': task.status === 'completed' }">
                                                {{ task.title }}
                                            </h4>
                                            <span class="px-2 py-1 text-xs font-medium rounded-full text-white"
                                                :style="{ backgroundColor: task.activityColor }">
                                                {{ task.activity }}
                                            </span>
                                            <!-- Priority indicator -->
                                            <div v-if="task.priority" class="flex items-center">
                                                <svg v-for="n in task.priority" :key="n" class="w-3 h-3" :class="{
                                                    'text-red-500': task.priority === 3,
                                                    'text-orange-500': task.priority === 2,
                                                    'text-blue-500': task.priority === 1
                                                }" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fill-rule="evenodd" d="M10 3l7 7-7 7V3z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                            <!-- Deadline indicator -->
                                            <div v-if="task.deadline"
                                                class="flex items-center gap-1 text-xs text-gray-600">
                                                <svg class="w-3 h-3" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12,6 12,12 16,14"></polyline>
                                                </svg>
                                                <span>{{ getTimeLeft(task.deadline) }}</span>
                                            </div>
                                        </div>
                                        <p v-if="task.description" class="text-sm text-gray-600">{{ task.description }}
                                        </p>
                                    </div>

                                    <button @click="moveTask(task.id, 'today')"
                                        class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-all"
                                        title="Move to Today">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5 10l7-7m0 0l7 7m-7-7v18" />
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
                        <button @click="showAddReminder = true"
                            class="absolute right-0 top-0 w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all flex items-center justify-center">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-3">
                        <div v-for="reminder in reminders" :key="reminder.id"
                            class="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                            <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div class="flex-1">
                                <p class="text-gray-900 font-medium">{{ reminder.text }}</p>
                            </div>
                            <button @click="removeReminder(reminder.id)"
                                class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
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
                            <button v-for="color in doodleColors" :key="color" @click="selectedDoodleColor = color"
                                class="w-6 h-6 rounded-full border-2 transition-all"
                                :class="{ 'border-gray-800 scale-110': selectedDoodleColor === color, 'border-gray-300': selectedDoodleColor !== color }"
                                :style="{ backgroundColor: color }"></button>
                        </div>

                        <!-- Clear and Save buttons - top right -->
                        <div class="flex gap-2">
                            <button @click="clearDoodle"
                                class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Clear
                            </button>
                            <button @click="saveDoodle"
                                class="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Save
                            </button>
                        </div>
                    </div>

                    <div class="text-center mb-4">
                        <h2 class="text-2xl font-bold text-gray-900">Doodle</h2>
                    </div>

                    <canvas ref="doodleCanvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing"
                        @mouseleave="stopDrawing" class="w-full border border-gray-200 rounded-lg cursor-crosshair"
                        width="600" height="400"></canvas>
                </div>

                <!--  Added Eisenhower Matrix card for task visualization -->
                <div class="bg-white rounded-xl shadow-sm p-6 relative">
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-900">Eisenhower Matrix</h2>
                        <p class="text-sm text-gray-600 mt-1">Tasks plotted by Urgency vs Importance</p>
                    </div>

                    <div class="relative w-full h-96 border border-gray-200 rounded-lg">
                    </div>

                    <div class="relative w-full h-96 border border-gray-200 rounded-lg">
                        <!-- Grid lines -->
                        <div class="absolute inset-0">
                            <div class="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300"></div>
                            <div class="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
                        </div>

                        <!-- Quadrant labels -->
                        <div class="absolute top-2 left-2 text-xs font-medium text-gray-600">Important & Urgent</div>
                        <div class="absolute top-2 right-2 text-xs font-medium text-gray-600">Important & Not Urgent
                        </div>
                        <div class="absolute bottom-2 left-2 text-xs font-medium text-gray-600">Not Important & Urgent
                        </div>
                        <div class="absolute bottom-2 right-2 text-xs font-medium text-gray-600">Not Important & Not
                            Urgent</div>

                        <!-- Axis labels -->
                        <div
                            class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-gray-700">
                            Urgency →</div>
                        <div
                            class="absolute -left-16 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-700">
                            Importance ↑</div>

                        <!-- Task dots -->
                        <div v-for="task in allTasks" :key="task.id"
                            class="absolute w-3 h-3 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
                            :style="{
                                backgroundColor: task.activityColor,
                                left: `${getTaskUrgency(task)}%`,
                                top: `${100 - getTaskImportance(task)}%`
                            }" :title="`${task.title} - ${task.activity}`"></div>
                    </div>
                </div>
            </main>

            <!-- Date Picker Modal -->
            <div v-if="showDatePicker"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl p-6 shadow-xl">
                    <h3 class="text-lg font-semibold mb-4">Select Date</h3>
                    <input type="date" v-model="selectedDateInput" @change="updateSelectedDate"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <div class="flex gap-3 mt-4">
                        <button @click="showDatePicker = false"
                            class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            Cancel
                        </button>
                        <button @click="showDatePicker = false"
                            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Done
                        </button>
                    </div>
                </div>
            </div>

            <!-- Added Edit Timer Modal -->
            <div v-if="showEditTimer"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
                    <h3 class="text-lg font-semibold mb-4">Edit Timer Duration</h3>
                    <form @submit.prevent="updateTimerDuration">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                                <input v-model.number="newTimerDuration" type="number" min="1" max="60" required
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="25">
                            </div>
                        </div>
                        <div class="flex gap-3 mt-6">
                            <button type="button" @click="showEditTimer = false"
                                class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button type="submit"
                                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                                <input v-model="newGoal.title" type="text" required
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Goal title">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea v-model="newGoal.description"
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Goal description" rows="3"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <input v-model="newGoal.category" type="text" required
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Health, Work, Personal">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Max Points
                                    (optional)</label>
                                <input v-model.number="newGoal.maxPoints" type="number" min="1"
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Leave empty for unlimited">
                            </div>
                        </div>
                        <div class="flex gap-3 mt-6">
                            <button type="button" @click="showAddGoal = false"
                                class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button type="submit"
                                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                                <input v-model="editingGoal.title" type="text" required
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Goal title">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea v-model="editingGoal.description"
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Goal description" rows="3"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <input v-model="editingGoal.category" type="text" required
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Health, Work, Personal">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Max Points
                                    (optional)</label>
                                <input v-model.number="editingGoal.maxPoints" type="number" min="1"
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Leave empty for unlimited">
                            </div>
                        </div>
                        <div class="flex gap-3 mt-6">
                            <button type="button" @click="showEditGoal = false"
                                class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button type="submit"
                                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Update Goal
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Add Gratitude Modal -->
            <div v-if="showAddGratitude"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
                    <h3 class="text-lg font-semibold mb-4">Add New Gratitude</h3>
                    <form @submit.prevent="addGratitude">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">What are you grateful
                                    for?</label>
                                <textarea v-model="newGratitude.text" required
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="I'm grateful for..." rows="3"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Description
                                    (optional)</label>
                                <input v-model="newGratitude.description" type="text"
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Additional details...">
                            </div>
                        </div>
                        <div class="flex gap-3 mt-6">
                            <button type="button" @click="showAddGratitude = false"
                                class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button type="submit"
                                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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
                                <input v-model="newTask.title" type="text" required
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="What needs to be done?">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Description
                                    (optional)</label>
                                <textarea v-model="newTask.description"
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Additional details..." rows="2"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                                <input v-model="newTask.activity" type="text" required
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Work, Personal, Health">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Section</label>
                                <select v-model="newTask.section"
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="today">Today</option>
                                    <option value="later">Later</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Deadline (optional)</label>
                                <input v-model="newTask.deadline" type="datetime-local"
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Priority (optional)</label>
                                <select v-model="newTask.priority"
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">No Priority</option>
                                    <option value="1">Low Priority</option>
                                    <option value="2">Medium Priority</option>
                                    <option value="3">High Priority</option>
                                </select>
                            </div>
                        </div>
                        <div class="flex gap-3 mt-6">
                            <button type="button" @click="showAddTask = false"
                                class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button type="submit"
                                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Add Task
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Add Reminder Modal -->
            <div v-if="showAddReminder"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
                    <h3 class="text-lg font-semibold mb-4">Add Reminder</h3>
                    <form @submit.prevent="addReminder">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">What to remember?</label>
                                <textarea v-model="newReminder.text" required
                                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Something important to remember..." rows="3"></textarea>
                            </div>
                        </div>
                        <div class="flex gap-3 mt-6">
                            <button type="button" @click="showAddReminder = false"
                                class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                Cancel
                            </button>
                            <button type="submit"
                                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Add Reminder
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
//  Removed Luxon import and will use mock methods instead

// Added showOtherTasks and draggedTask variables
const showOtherTasks = ref(false)
const draggedTask = ref(null)

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
        deadline: "relative_date",
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
        deadline: "relative_date",
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
    return "relative_date"
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
        const hoursLeft = 24;
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
const defaultTimer = ref(25)
const isRunning = ref(false)
const timeLeft = ref(defaultTimer.value * 60)
// let timerInterval

const sessions = ref([
    {
        id: 1,
        startHour: 9,
        endHour: 11,
        activity: { name: 'Work', color: '#3b82f6' },
        currentTask: 'Review reports',
        status: 'successful',
        notes: 'Good progress on quarterly review'
    },
    {
        id: 2,
        startHour: 14,
        endHour: 15,
        activity: null,
        currentTask: null,
        status: null,
        notes: null
    }
])

const draggedSession = ref(null)
const showSessionModal = ref(false)
const editingSession = ref(null)

const mockTimeLeft = (deadline) => {
    if (!deadline) return null
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diff = deadlineDate - now

    if (diff < 0) return 'Overdue'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h`
    return 'Due soon'
}

const createSession = (hour) => {
    const newSession = {
        id: Date.now(),
        startHour: hour,
        endHour: hour + 1,
        activity: null,
        currentTask: null,
        status: null,
        notes: null
    }
    sessions.value.push(newSession)
    editSession(newSession)
}

const editSession = (session) => {
    editingSession.value = session
    showSessionModal.value = true
}

const startDragSession = (session, event) => {
    draggedSession.value = session
    // Add drag logic here
}

//  Added current activity reactive variables
const currentActivity = ref({
    name: 'Deep Work',
    color: '#3b82f6',
    startTime: '09:00',
    endTime: '11:00',
    currentTask: 'Working on Vue organizer app',
    tasks: []
})
const showAddActivityTask = ref(false)
const newActivityTask = ref({
    title: '',
    description: ''
})

//  Added mock method to replace Luxon toRelative
const getTimeUntilDeadline = (deadline) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffMs = deadlineDate - now
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (diffMs < 0) return 'Overdue'
    if (diffDays > 0) return `${diffDays}d ${diffHours}h`
    if (diffHours > 0) return `${diffHours}h`
    return 'Due soon'
}

//  Added methods for current activity management
const setCurrentTask = (taskTitle) => {
    if (currentActivity.value) {
        currentActivity.value.currentTask = taskTitle
    }
}

const addActivityTask = () => {
    if (newActivityTask.value.title.trim() && currentActivity.value) {
        currentActivity.value.tasks.push({
            id: Date.now(),
            title: newActivityTask.value.title,
            description: newActivityTask.value.description
        })
        resetNewActivityTask()
        showAddActivityTask.value = false
    }
}

const resetNewActivityTask = () => {
    newActivityTask.value = {
        title: '',
        description: ''
    }
}

//  Added utility function to adjust color brightness for gradients
const adjustColorBrightness = (color, amount) => {
    const usePound = color[0] === '#'
    const col = usePound ? color.slice(1) : color
    const num = parseInt(col, 16)
    let r = (num >> 16) + amount
    let g = (num >> 8 & 0x00FF) + amount
    let b = (num & 0x0000FF) + amount
    r = r > 255 ? 255 : r < 0 ? 0 : r
    g = g > 255 ? 255 : g < 0 ? 0 : g
    b = b > 255 ? 255 : b < 0 ? 0 : b
    return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0')
}

// const toggleTimer = () => {
//     isRunning.value = !isRunning.value
//     if (isRunning.value) {
//         timerInterval = setInterval(() => {
//             if (timeLeft.value > 0) {
//                 timeLeft.value--
//             } else {
//                 clearInterval(timerInterval)
//                 isRunning.value = false
//                 timeLeft.value = 0
//             }
//         }, 1000)
//     } else {
//         clearInterval(timerInterval)
//     }
// }

// const resetTimer = () => {
//     clearInterval(timerInterval)
//     isRunning.value = false
//     timeLeft.value = defaultTimer.value * 60
// }

const editTimer = () => {
    // Implement edit timer logic here
}

const markPomodoroComplete = () => {
    // Implement mark pomodoro complete logic here
}

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

// Existing code continues...
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
    font-family: 'Inter', sans-serif;
}

/* Custom text selection and cursor styling */
::selection {
    background-color: #3b82f6;
    color: white;
}

::-moz-selection {
    background-color: #3b82f6;
    color: white;
}

input,
textarea {
    caret-color: #3b82f6;
}

/* Custom scrollbar styling */
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

/* Firefox scrollbar */
* {
    scrollbar-width: thin;
    scrollbar-color: #3b82f6 transparent;
}

/*  Added gratitude word hover effect with light opacity */
.gratitude-word:hover {
    background-color: var(--hover-color);
    padding: 2px 4px;
    border-radius: 4px;
    transition: all 0.2s ease;
}

/* Moving border animation for goals */
@keyframes rotateBorder {
    0% {
        --angle: 0deg;
    }

    100% {
        --angle: 360deg;
    }
}

.goal-border-animation {
    position: relative;
    background: conic-gradient(from var(--angle), var(--goal-color), transparent 70%, var(--goal-color));
    animation: rotateBorder 2s linear infinite;
    border-radius: 12px;
    padding: 2px;
}

.goal-border-animation>div {
    background: white;
    border-radius: 10px;
}

/* Dot grid pattern for doodle canvas */
.dot-grid {
    background-image: radial-gradient(circle, #ccc 1px, transparent 1px);
    background-size: 20px 20px;
}

/* Added session timeline styling */
.session-timeline {
    position: relative;
    background: repeating-linear-gradient(90deg,
            transparent,
            transparent 4.16%,
            rgba(0, 0, 0, 0.1) 4.16%,
            rgba(0, 0, 0, 0.1) 4.17%);
}
</style>