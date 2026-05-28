<script setup>
import { ref, computed } from 'vue'
import { CheckIcon, CheckCheckIcon, PlusIcon } from 'lucide-vue-next'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

const currentSession = ref({
	activity: 'Development',
	title: 'Build Components',
	startTime: { toFormat: () => '9:00 AM' },
	endTime: { toFormat: () => '11:00 AM' },
	notes: '',
})

const settings = ref({
	DATE_FORMAT: 'h:mm a',
})

const allTasks = ref([
	{ id: 1, title: 'Create button component', description: 'Build reusable button', status: 'ACTIVE' },
	{ id: 2, title: 'Add styling', description: 'Apply Tailwind', status: 'PENDING' },
	{ id: 3, title: 'Test responsiveness', status: 'PENDING' },
	{ id: 4, title: 'Update docs', status: 'COMPLETED' },
])

const TaskStatusEnum = {
	ACTIVE: 'ACTIVE',
	PENDING: 'PENDING',
	COMPLETED: 'COMPLETED',
}

const activeTask = computed(() => allTasks.value.find(t => t.status === TaskStatusEnum.ACTIVE))
const otherTasks = computed(() => allTasks.value.filter(t => t.status !== TaskStatusEnum.ACTIVE))
const suggestedTasks = ref([])
const editTask = ref(null)

const handleTaskPrimary = (event, task) => {
	// Handle task interaction
}

const markTaskCompleted = (task) => {
	task.status = TaskStatusEnum.COMPLETED
}

const handleCreateTask = (newTask) => {
	allTasks.value.push(newTask)
}

const handleUpdateTask = (updatedTask) => {
	const index = allTasks.value.findIndex(t => t.id === updatedTask.id)
	if (index > -1) {
		allTasks.value[index] = updatedTask
	}
}

import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import TaskFormPopover from '@/components/popovers/TaskFormPopover.vue'

const appWindow = getCurrentWebviewWindow();
const isPinned = ref(true);

async function togglePin() {
  isPinned.value = !isPinned.value;
  await appWindow.setAlwaysOnTop(isPinned.value);
};

</script>


<template>
	<div class="flex gap-6 h-full p-6 bg-background">
		<!-- Left Side: Pomodoro Timer -->
		<div class="flex flex-col items-center justify-center">
			<PomodoroTimer />
		</div>

		<!-- Right Side: Session Info & Tasks -->
		<div class="flex-1 flex flex-col gap-4 overflow-hidden">
			<!-- Session Header -->
			<div class="flex flex-col gap-2 pb-4 border-b border-muted">
				<p class="text-3xl font-extrabold text-primary capitalize">{{ currentSession?.activity ?? "FREE SLOT" }}</p>
				<p class="text-xl font-semibold text-primary/75 capitalize">{{ currentSession?.title ?? "No Active Session" }}</p>
				<div v-if="currentSession" class="text-sm text-muted-foreground">
					<span> {{ currentSession.startTime.toFormat(settings.DATE_FORMAT) }} - {{ currentSession.endTime.toFormat(settings.DATE_FORMAT) }} </span>
				</div>
			</div>

			<!-- Active Task (Large) -->
			<div v-if="activeTask" class="p-4 rounded-md ring-2 ring-primary bg-primary/5">
				<div class="flex items-center gap-3">
					<Button @click.stop="markTaskCompleted(activeTask)" variant="ghost" size="icon" class="text-foreground size-6 border border-foreground">
						<CheckIcon class="size-4" />
					</Button>
					<div class="flex-1">
						<div class="text-lg font-bold text-foreground">{{ activeTask.title }}</div>
						<div v-if="activeTask.description" class="text-sm text-muted-foreground mt-1">{{ activeTask.description }}</div>
					</div>
				</div>
			</div>

			<!-- Other Tasks (Accordion) -->
			<Accordion type="single" class="flex-1" collapsible>
				<AccordionItem
					value="other_tasks"
					class="!border-1 bg-muted/30 border-dashed rounded-md"
				>
					<AccordionTrigger class="px-4 text-foreground/75 hover:text-primary transition-colors">
						<span class="flex items-center gap-2">Other Tasks ({{ otherTasks.length }})</span>
					</AccordionTrigger>
					<AccordionContent>
						<div class="space-y-2 px-4 py-2">
							<div
								v-for="task in otherTasks"
								:key="task.id"
								@click="handleTaskPrimary($event, task)"
								class="p-3 flex items-center gap-2 rounded-md ring-1 ring-muted-foreground/25 cursor-pointer hover:ring-primary/50 transition-all bg-background"
								:class="{
									'opacity-75 line-through': task.status === TaskStatusEnum.COMPLETED,
								}"
							>
								<Button v-if="task.status !== TaskStatusEnum.COMPLETED" @click.stop="markTaskCompleted(task)" variant="ghost" size="icon" class="text-foreground size-5 border border-foreground">
									<CheckIcon class="size-3" />
								</Button>
								<div v-else class="size-5 flex items-center justify-center bg-primary rounded-full">
									<CheckCheckIcon class="size-3 text-background" />
								</div>
								<div class="flex-1 min-w-0">
									<div class="text-sm text-foreground truncate">{{ task.title }}</div>
								</div>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<!-- Add Task Accordion -->
			<Accordion type="single" collapsible>
				<AccordionItem
					:disabled="!currentSession"
					value="task_form"
					class="!border-1 bg-background border-dashed shadow-sm has-[.trigger:hover]:border-primary rounded-md transition-colors"
				>
					<AccordionTrigger class="trigger px-4 text-foreground/75 hover:text-primary transition-colors">
						<span v-if="currentSession" class="flex items-center gap-2"> <PlusIcon class="size-4" /> Add Task </span>
						<span v-else> - No Session - </span>
					</AccordionTrigger>
					<AccordionContent>
						<TaskFormPopover class="px-4 py-0.5" :existingTask="editTask" :suggestedTasks="suggestedTasks" @create="handleCreateTask" @update="handleUpdateTask" />
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	</div>
</template>
