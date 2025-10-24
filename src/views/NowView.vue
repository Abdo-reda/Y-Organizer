<script setup lang="ts">
import TaskFormPopover from "@/components/popovers/TaskFormPopover.vue";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { NowTaskStatusOrder, TaskStatusEnum } from "@/core/enums/taskStatusEnum";
import { getDefaultSessionTask, ITask } from "@/core/interfaces/entities/ITask";
import { useCurrentTime } from "@/store/useCurrentTime";
import useDaySessions from "@/store/useDaySessions";
import useSettings from "@/store/useSettings";
import useTasks from "@/store/useTasks";
import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { CheckCheckIcon, CheckIcon, FullscreenIcon, NotepadTextIcon, PlusIcon, XIcon, ZapIcon } from "lucide-vue-next";
import { computed, ref, watchEffect } from "vue";

const { formattedTime, currentTime } = useCurrentTime();
const { currentSession, updateSession } = useDaySessions();
const { tasks, createTask, updateTask, deleteTask, completeTask } = useTasks();
const { appView, settings } = useSettings();
const editTask = ref<ITask>(getDefaultSessionTask(currentSession.value));
const appWindow = isTauri() ? getCurrentWindow() : undefined;

const remainingTime = computed(() => (currentSession.value ? Math.ceil(currentSession.value.endTime.diff(currentTime.value, "minutes", { conversionAccuracy: "casual" }).minutes) : 0));
const suggestedTasks = computed(() =>
	tasks.filter((t) => t.session !== currentSession.value?.id && t.status !== TaskStatusEnum.COMPLETED && t.activity === currentSession.value?.activity && t.isToday)
);
const allSessionTasks = computed(() => tasks.filter((t) => t.session === currentSession.value?.id).sort((a,b) => NowTaskStatusOrder[a.status] - NowTaskStatusOrder[b.status]));
const activeSessionTask = computed(() => tasks.find((t) => t.session === currentSession.value?.id && t.status === TaskStatusEnum.ACTIVE));

watchEffect(() => {
	const curActive = activeSessionTask.value;
	const firstPending = allSessionTasks.value.find(s => s.status === TaskStatusEnum.PENDING);
    console.log("--- hello?", curActive, firstPending)
	if (!curActive && firstPending) setAutoActiveTask(firstPending);
});

function handleTaskPrimary(event: MouseEvent, task: ITask) {
    if (event.ctrlKey) {
        handleOpenPopover(event, task);
    } else {
        markTaskActive(task);
    }
}

function handleTaskSecondary(event: MouseEvent, task: ITask) {
	if (event.altKey) {
		deleteTask(task.id);
	} else {
		updateTask(task.id, { ...task, session: null, status: TaskStatusEnum.PENDING });
	}
}

function handleOpenPopover(_event: MouseEvent, task?: ITask) {
	if (!currentSession.value) return;
	editTask.value = task ?? getDefaultSessionTask(currentSession.value);
}

async function markTaskActive(task: ITask) {
	if (task.status === TaskStatusEnum.ACTIVE) return;
	if (activeSessionTask.value) {
		updateTask(activeSessionTask.value.id, { ...activeSessionTask.value, status: TaskStatusEnum.PENDING });
	}
	updateTask(task.id, { ...task, status: TaskStatusEnum.ACTIVE });
}

function markTaskCompleted(task: ITask) {
	completeTask(task);
}

function updateSessionNotes() {
	if (!currentSession.value) return;
	updateSession(currentSession.value?.id, currentSession.value);
}

function setAutoActiveTask(newActive: ITask) {
    console.log("--- setting auto active?")
	newActive.status = TaskStatusEnum.ACTIVE;
	updateTask(newActive.id, newActive);
}

function handleCreateTask(task: ITask) {
	createTask(task);
	handleClosePopover();
}

function handleUpdateTask(id: number, task: ITask) {
	updateTask(id, task);
	handleClosePopover();
}

function handleClosePopover() {
	editTask.value = getDefaultSessionTask(currentSession.value);
}

async function toggleFullscreen() {
	if (!appWindow) return;
	const isFullscreen = await appWindow.isFullscreen();
	appWindow.setFullscreen(!isFullscreen);
}
</script>

<template>
	<div class="flex flex-col h-full">
		<div class="app-drag h-20" />
		<div class="flex-1 flex gap-10 px-20">
			<div class="flex-1 flex flex-col items-center justify-center h-full gap-4 text-center">
				<p class="text-7xl font-extrabold text-primary capitalize drop-shadow-md">{{ currentSession?.activity ?? "FREE SLOT" }}</p>
				<p class="text-4xl font-semibold text-primary/75 capitalize">{{ currentSession?.title ?? "No Active Session" }}</p>
				<div v-if="currentSession" class="text-2xl text-muted-foreground">
					<span> {{ currentSession.startTime.toFormat(settings.DATE_FORMAT) }} - {{ currentSession.endTime.toFormat(settings.DATE_FORMAT) }} </span> •
					<span v-if="remainingTime">
						<span class="text-primary font-semibold">
							<span v-if="remainingTime >= 60"> {{ Math.floor(remainingTime / 60) }}h </span>
							{{ remainingTime % 60 }}m
						</span>
						remaining
					</span>
				</div>
				<div v-if="currentSession" class="w-full px-12 flex gap-2">
					<NotepadTextIcon class="text-foreground size-6" />
					<div class="flex-1 mask-b-from-40% mask-b-to-90%">
						<textarea
							@focusout="updateSessionNotes"
							v-model="currentSession.notes"
							:spellcheck="false"
							class="w-full resize-none outline-none h-full scroll-hidden text-lg"
							placeholder="Session Notes..."
							:rows="6"
						/>
					</div>
				</div>
			</div>
			<div class="flex-1 flex flex-col gap-4 overflow-hidden p-1">
				<div class="flex justify-center relative">
					<p class="text-6xl text-center font-semibold p-6">{{ formattedTime }}</p>
					<div class="flex gap-2 absolute right-0">
						<Button @click="toggleFullscreen" variant="ghost" size="icon" class="size-10">
							<FullscreenIcon class="size-6" />
						</Button>
						<Button @click="appView = 'day'" variant="ghost" size="icon" class="size-10">
							<XIcon class="size-6" />
						</Button>
					</div>
				</div>
				<TransitionGroup @contextmenu.prevent name="auto" tag="ul" class="space-y-4 flex-1 select-none relative">
					<li
						v-for="task in allSessionTasks"
						:key="task.id"
						@contextmenu="handleTaskSecondary($event, task)"
						@click="handleTaskPrimary($event, task)"
						class="relative p-4 flex items-center min-w-0 justify-between ring rounded-md transition-shadow gap-4 bg-background"
						:class="{
							'ring-primary': task.status === TaskStatusEnum.ACTIVE,
							'ring-muted-foreground/25 bg-muted opacity-75': task.status === TaskStatusEnum.COMPLETED,
							'ring-muted-foreground/75': task.status !== TaskStatusEnum.COMPLETED,
							'hover:ring-primary/75': task.status !== TaskStatusEnum.ACTIVE,
						}"
					>
						<Button v-if="task.status !== TaskStatusEnum.COMPLETED" @click.stop="markTaskCompleted(task)" variant="ghost" size="icon" class="text-foreground size-7 border border-foreground">
							<CheckIcon class="size-4"  />
						</Button>
                        <div v-else class="size-7 flex items-center justify-center bg-primary rounded-full">
                            <CheckCheckIcon class="size-4 text-background" />
                        </div>
						<div class="flex-1 min-w-0">
							<div class="text-lg text-foreground truncate" :class="{
                                'line-through': task.status === TaskStatusEnum.COMPLETED,
                                'font-bold': task.status === TaskStatusEnum.ACTIVE
                            }">{{ task.title }}</div>
							<div v-if="task.description && task.status !== TaskStatusEnum.COMPLETED" class="text-base text-muted-foreground mt-1 truncate" :class="{
                                'font-medium': task.status === TaskStatusEnum.ACTIVE
                            }">{{ task.description }}</div>
						</div>
						<div
							class="absolute top-0 right-0 m-2 opacity-0 transition-opacity"
							:class="{
								'opacity-100': task.status === TaskStatusEnum.ACTIVE,
							}"
						>
							<ZapIcon class="fill-primary stroke-transparent size-4"> </ZapIcon>
							<div class="absolute top-0 bg-primary/50 size-4 rounded-full animate-ping"></div>
						</div>
					</li>
					<Accordion type="single" class="flex-1" key="form" collapsible>
						<AccordionItem
							:disabled="!currentSession"
							value="task_form"
							class="!border-1 bg-background border-dashed shadow-sm has-[.trigger:hover]:border-primary rounded-md transition-colors"
						>
							<AccordionTrigger class="trigger w-full p-4 text-foreground/75 hover:text-primary transition-colors hover:[&>svg]:text-primary">
								<span v-if="currentSession" class="flex items-center justify-center gap-2"> <PlusIcon class="size-4" /> Add Task </span> <span v-else> - No Session - </span>
							</AccordionTrigger>
							<AccordionContent>
								<TaskFormPopover class="px-4 py-0.5" :existingTask="editTask" :suggestedTasks="suggestedTasks" @create="handleCreateTask" @update="handleUpdateTask" />
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</TransitionGroup>
			</div>
		</div>
	</div>
</template>
