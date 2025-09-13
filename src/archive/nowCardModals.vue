<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Current activity data
const currentActivity = ref({
    name: 'Deep Work',
    color: '#3b82f6',
    startTime: '09:00',
    endTime: '11:00',
    timeLeft: '1h 23m remaining'
})

// Active task
const activeTask = ref({
    id: 1,
    title: 'Review project proposal',
    description: 'Go through the client requirements and prepare feedback'
})

// Task slots (max 3)
const taskSlots = ref([
    {
        task: {
            id: 2,
            title: 'Update documentation',
            description: 'Add new API endpoints to the docs'
        }
    },
    {
        task: {
            id: 3,
            title: 'Team standup prep',
            description: 'Prepare updates for the daily standup'
        }
    },
    {
        task: null
    }
])

// Modal states
const showAddTaskModal = ref(false)
const showEditTaskModal = ref(false)

// Form data
const newTask = ref({
    title: '',
    description: ''
})

const editingTask = ref({
    id: null,
    title: '',
    description: ''
})

// Mock today tasks for suggestions
const todayTaskSuggestions = ref([
    {
        id: 101,
        title: 'Code review for PR #234',
        description: 'Review the authentication changes',
        activity: 'Development'
    },
    {
        id: 102,
        title: 'Client call preparation',
        description: 'Prepare slides for the quarterly review',
        activity: 'Business'
    },
    {
        id: 103,
        title: 'Database optimization',
        description: 'Optimize slow queries in the user table',
        activity: 'Development'
    }
])

// Methods
const markTaskActive = (task) => {
    activeTask.value = { ...task }
}

const markTaskDone = (taskId) => {
    // Remove task from slots
    taskSlots.value = taskSlots.value.map(slot =>
        slot.task?.id === taskId ? { task: null } : slot
    )

    // Clear active task if it's the one being marked done
    if (activeTask.value?.id === taskId) {
        activeTask.value = null
    }
}

const editTask = (task) => {
    editingTask.value = { ...task }
    showEditTaskModal.value = true
}

const clearTask = (slotIndex) => {
    taskSlots.value[slotIndex] = { task: null }
}

const deleteTask = (taskId) => {
    // Remove from slots
    taskSlots.value = taskSlots.value.map(slot =>
        slot.task?.id === taskId ? { task: null } : slot
    )

    // Clear active task if it's the one being deleted
    if (activeTask.value?.id === taskId) {
        activeTask.value = null
    }
}

const addNewTask = () => {
    if (!newTask.value.title.trim()) return

    const task = {
        id: Date.now(),
        title: newTask.value.title,
        description: newTask.value.description
    }

    // Find first empty slot
    const emptySlotIndex = taskSlots.value.findIndex(slot => !slot.task)
    if (emptySlotIndex !== -1) {
        taskSlots.value[emptySlotIndex] = { task }
    }

    // Reset form
    newTask.value = { title: '', description: '' }
    showAddTaskModal.value = false
}

const selectSuggestedTask = (task) => {
    newTask.value = {
        title: task.title,
        description: task.description
    }
}

const updateTask = () => {
    // Update in slots
    taskSlots.value = taskSlots.value.map(slot =>
        slot.task?.id === editingTask.value.id
            ? { task: { ...editingTask.value } }
            : slot
    )

    // Update active task if it's the one being edited
    if (activeTask.value?.id === editingTask.value.id) {
        activeTask.value = { ...editingTask.value }
    }

    showEditTaskModal.value = false
}

</script>
<template>
    <!--  Add Task Modal with suggestions from today tasks -->
    <div v-if="showAddTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex">
            <!-- Left side - Form -->
            <div class="flex-1 p-6">
                <h3 class="text-lg font-semibold mb-4">Add New Task</h3>
                <form @submit.prevent="addNewTask" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                        <input v-model="newTask.title" type="text" required
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="What needs to be done?">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                        <textarea v-model="newTask.description"
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Additional details..." rows="3"></textarea>
                    </div>
                    <div class="flex gap-3 mt-6">
                        <button type="button" @click="showAddTaskModal = false"
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

            <!-- Right side - Suggestions -->
            <div class="w-80 bg-gray-50 p-6 border-l">
                <h4 class="text-sm font-medium text-gray-700 mb-3">Suggestions from Today</h4>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    <div v-for="task in todayTaskSuggestions" :key="task.id" @click="selectSuggestedTask(task)"
                        class="p-3 bg-white rounded-lg border hover:border-blue-300 cursor-pointer transition-colors">
                        <div class="font-medium text-gray-800 text-sm">{{ task.title }}</div>
                        <div v-if="task.description" class="text-xs text-gray-600 mt-1">{{ task.description }}</div>
                        <div class="text-xs text-gray-500 mt-1">{{ task.activity }}</div>
                    </div>
                </div>
                <div v-if="todayTaskSuggestions.length === 0" class="text-sm text-gray-500 text-center py-4">
                    No tasks available for suggestions
                </div>
            </div>
        </div>
    </div>

    <!--  Edit Task Modal -->
    <div v-if="showEditTaskModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
            <h3 class="text-lg font-semibold mb-4">Edit Task</h3>
            <form @submit.prevent="updateTask" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                    <input v-model="editingTask.title" type="text" required
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea v-model="editingTask.description"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"></textarea>
                </div>
                <div class="flex gap-3 mt-6">
                    <button type="button" @click="showEditTaskModal = false"
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


    <!-- Add Task Modal with suggestions from today tasks -->
    <div v-if="showAddTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex">
            <!-- Left side - Form -->
            <div class="flex-1 p-6">
                <h3 class="text-lg font-semibold mb-4">Add New Task</h3>
                <form @submit.prevent="addNewTask" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                        <input v-model="newTask.title" type="text" required
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="What needs to be done?">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                        <textarea v-model="newTask.description"
                            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Additional details..." rows="3"></textarea>
                    </div>
                    <div class="flex gap-3 mt-6">
                        <button type="button" @click="showAddTaskModal = false"
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

            <!-- Right side - Suggestions -->
            <div class="w-80 bg-gray-50 p-6 border-l">
                <h4 class="text-sm font-medium text-gray-700 mb-3">Suggestions from Today</h4>
                <div class="space-y-2 max-h-96 overflow-y-auto">
                    <div v-for="task in todayTaskSuggestions" :key="task.id" @click="selectSuggestedTask(task)"
                        class="p-3 bg-white rounded-lg border hover:border-blue-300 cursor-pointer transition-colors">
                        <div class="font-medium text-gray-800 text-sm">{{ task.title }}</div>
                        <div v-if="task.description" class="text-xs text-gray-600 mt-1">{{ task.description }}</div>
                        <div class="text-xs text-gray-500 mt-1">{{ task.activity }}</div>
                    </div>
                </div>
                <div v-if="todayTaskSuggestions.length === 0" class="text-sm text-gray-500 text-center py-4">
                    No tasks available for suggestions
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Task Modal -->
    <div v-if="showEditTaskModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
            <h3 class="text-lg font-semibold mb-4">Edit Task</h3>
            <form @submit.prevent="updateTask" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                    <input v-model="editingTask.title" type="text" required
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea v-model="editingTask.description"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows="3"></textarea>
                </div>
                <div class="flex gap-3 mt-6">
                    <button type="button" @click="showEditTaskModal = false"
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
</template>