<script setup lang="ts">
import TaskFormPopover from "@/components/popovers/TaskFormPopover.vue";
import { Button } from "@/components/ui/button";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { TaskStatusEnum } from "@/core/enums/taskStatusEnum";
import { getDefaultSessionTask, ITask } from "@/core/interfaces/entities/ITask";
import { useCurrentTime } from "@/store/useCurrentTime";
import useDaySessions from "@/store/useDaySessions";
import useSettings from "@/store/useSettings";
import useTasks from "@/store/useTasks";
import { CheckCheckIcon, CheckIcon, ListCheckIcon, NotepadTextIcon, PlusIcon, ZapIcon } from "lucide-vue-next";
import { type ReferenceElement } from "reka-ui";
import { computed, ref, shallowRef, watchEffect } from "vue";

const { currentTime } = useCurrentTime();
const { currentSession, updateSession } = useDaySessions();
const { tasks, createTask, updateTask, deleteTask, completeTask } = useTasks();
const { settings } = useSettings();
const editTask = ref<ITask>(getDefaultSessionTask(currentSession.value));
const editTaskPopoverOpen = ref(false);
const taskPopoverAnchor = shallowRef<ReferenceElement | undefined>();

const remainingTime = computed(() => (currentSession.value ? Math.ceil(currentSession.value.endTime.diff(currentTime.value, "minutes", { conversionAccuracy: "casual" }).minutes) : 0));
const suggestedTasks = computed(() =>
	tasks.filter((t) => t.session !== currentSession.value?.id && t.status !== TaskStatusEnum.COMPLETED && t.activity === currentSession.value?.activity && t.isToday)
);
const pendingSessionTasks = computed(() => tasks.filter((t) => t.session === currentSession.value?.id && t.status === TaskStatusEnum.PENDING));
const completedSessionsTasks = computed(() => tasks.filter((t) => t.session === currentSession.value?.id && t.status === TaskStatusEnum.COMPLETED));
const activeSessionTask = computed(() => tasks.find((t) => t.session === currentSession.value?.id && t.status === TaskStatusEnum.ACTIVE));
const focusedTasks = computed(() => {
	const list = [];
	if (activeSessionTask.value) list.push(activeSessionTask.value);
	if (pendingSessionTasks.value[0]) list.push(pendingSessionTasks.value[0]);
	if (pendingSessionTasks.value[1]) list.push(pendingSessionTasks.value[1]);
	return list;
});

watchEffect(() => {
	const curActive = activeSessionTask.value;
	const firstPending = pendingSessionTasks.value[0];
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

function handleOpenPopover(event: MouseEvent, task?: ITask) {
	if (!currentSession.value) return;
	editTask.value = task ?? getDefaultSessionTask(currentSession.value);
	taskPopoverAnchor.value = event.currentTarget as ReferenceElement;
	editTaskPopoverOpen.value = true;
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
	editTaskPopoverOpen.value = false;
}
</script>

<template>
	<Popover v-model:open="editTaskPopoverOpen">
		<PopoverAnchor :reference="taskPopoverAnchor" />
		<PopoverContent side="right" align="start" class="w-auto max-w-lg">
			<TaskFormPopover :existingTask="editTask" :suggestedTasks="suggestedTasks" @create="handleCreateTask" @update="handleUpdateTask" />
		</PopoverContent>
	</Popover>
	<div class="h-full flex flex-col items-center">
		<!-- HEADER INFO -->
		<div class="flex flex-col gap-0.5 items-center">
			<p class="text-3xl font-extrabold capitalize text-primary">
				{{ currentSession ? currentSession.activity : "FREE SLOT" }}
			</p>
			<p class="text-base text-center text-primary/75 font-semibold capitalize">
				{{ currentSession ? currentSession.title : "No Active Session" }}
			</p>
			<div v-if="currentSession" class="text-xs text-center text-muted-foreground">
				<span> {{ currentSession.startTime.toFormat(settings.DATE_FORMAT) }} - {{ currentSession.endTime.toFormat(settings.DATE_FORMAT) }} </span> •
				<span v-if="remainingTime">
					<span class="text-primary font-semibold">
						<span v-if="remainingTime >= 60"> {{ Math.floor(remainingTime / 60) }}h </span>
						{{ remainingTime % 60 }}m
					</span>
					remaining
				</span>
			</div>
		</div>
		<div class="border-t border-primary/0 m-1 w-4/5"></div>
		<!-- BODY -->
		<div class="flex-1 flex justify-center gap-3.5 px-2 py-1 overflow-hidden w-full">
			<!-- TASKS -->
			<TransitionGroup @contextmenu.prevent name="auto" tag="ul" class="flex-1 select-none relative overflow-hidden p-0.5">
				<li v-for="task in focusedTasks" :key="task.id" class="h-1/3 pb-3">
					<div
						@contextmenu="handleTaskSecondary($event, task)"
						@click="handleTaskPrimary($event, task)"
						class="relative h-full p-2 flex items-center min-w-0 justify-between ring ring-muted rounded-md transition-shadow gap-2"
						:class="{
							'ring-primary': task.status === TaskStatusEnum.ACTIVE,
							'hover:ring-primary/75': task.status !== TaskStatusEnum.ACTIVE,
						}"
					>
						<Button @click.stop="markTaskCompleted(task)" variant="ghost" size="icon" class="text-muted-foreground/85 size-6 border border-muted-foreground/85">
							<CheckIcon class="size-3.5" />
						</Button>
						<div class="flex-1 min-w-0">
							<div
								class="font-medium text-sm text-foreground/75 truncate"
								:class="{
									'font-semibold': task.status === TaskStatusEnum.ACTIVE,
								}"
							>
								{{ task.title }}
							</div>
							<div v-if="task.description" class="text-xs text-muted-foreground mt-1 truncate">{{ task.description }}</div>
						</div>
						<div
							class="absolute top-0 right-0 m-2 opacity-0 transition-opacity"
							:class="{
								'opacity-100': task.status === TaskStatusEnum.ACTIVE,
							}"
						>
							<ZapIcon class="fill-primary stroke-transparent size-3"> </ZapIcon>
							<div class="absolute top-0 bg-primary/50 size-3 rounded-full animate-ping"></div>
						</div>
					</div>
				</li>
				<li v-if="focusedTasks.length < 3" key="add_task" class="h-1/3 pb-3">
					<button
						@click="handleOpenPopover"
						class="w-full h-full p-3 border-2 border-dashed border-muted-foreground/50 rounded-md text-muted-foreground/75 hover:border-primary hover:text-primary transition-all"
					>
						<span v-if="currentSession" class="flex items-center justify-center gap-2"> <PlusIcon class="size-4" /> Add Task </span>
						<span v-else> - No Session - </span>
					</button>
				</li>
			</TransitionGroup>
			<!-- NOTES & COMPLETED TASKS -->
			<div class="w-1/3 h-full flex flex-col gap-2">
				<div class="w-full relative p-1.5 pb-0 flex flex-col gap-0.5 h-full bg-muted/25 border border-muted-foreground/85 border-dashed rounded-sm text-muted-foreground text-sm">
					<div class="flex items-center gap-1.5">
						<NotepadTextIcon class="size-4" />
						<p class="font-semibold">Notes</p>
					</div>
					<div class="flex-1">
						<textarea
							@focusout="updateSessionNotes"
							v-if="currentSession"
							v-model="currentSession.notes"
							:spellcheck="false"
							class="w-full resize-none outline-none h-full scroll-hidden"
							placeholder="Session Notes..."
						/>
						<p v-else>- No Session -</p>
					</div>
					<div class="absolute rounded-sm inset-0 bg-gradient-to-b from-transparent from-75% to-background/75 pointer-events-none" />
				</div>
				<div class="relative p-1.5 h-full flex flex-col gap-0.5 border border-muted-foreground/85 border-dashed rounded-sm text-muted-foreground overflow-hidden text-sm">
					<div class="flex items-center gap-1.5">
						<ListCheckIcon class="size-4" />
						<p class="font-semibold">Completed</p>
						<span class="bg-muted/50 text-xs mx-1 flex items-center justify-center rounded-full size-5">
							{{ completedSessionsTasks.length }}
						</span>
					</div>
					<TransitionGroup name="auto" tag="ul" class="flex-1 overflow-auto scroll-hidden relative">
						<template v-if="completedSessionsTasks.length">
							<li v-for="task in completedSessionsTasks" :key="task.id" class="flex items-center gap-2 px-1 py-0.5">
								<CheckCheckIcon class="size-3" />
								<span class="flex-1 text-sm text-muted-foreground line-through truncate">{{ task.title }}</span>
							</li>
						</template>
						<li v-else class="text-muted-foreground/85" key="else">- Empty -</li>
					</TransitionGroup>
					<div class="absolute rounded-sm inset-0 bg-gradient-to-b from-transparent from-75% to-background/75 pointer-events-none" />
				</div>
			</div>
		</div>
	</div>
</template>
