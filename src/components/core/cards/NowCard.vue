<script setup lang="ts">
import FunctionCard from "@/components/common/FunctionCard.vue";
import TaskFormPopover from "@/components/popovers/TaskFormPopover.vue";
import { Button } from "@/components/ui/button";
import { Popover, PopoverAnchor } from "@/components/ui/popover";
import { TaskStatusEnum } from "@/core/enums/taskStatusEnum";
import { getDefaultSessionTask, ITask } from "@/core/interfaces/entities/ITask";
import { useCurrentTime } from "@/store/useCurrentTime";
import useDaySessions from "@/store/useDaySessions";
import useSettings from "@/store/useSettings";
import useTasks from "@/store/useTasks";
import { CheckCheckIcon, CheckIcon, ListCheckIcon, NotepadTextIcon, PlusIcon, ZapIcon } from "lucide-vue-next";
import { ReferenceElement } from "reka-ui";
import { computed, ref, shallowRef, watch } from "vue";

//TODO: fix weird layout shift, when completing the first task in a session, I think I can do this, by make sure there is always an element in the completed card? or in the grid?.

const { currentTime } = useCurrentTime();
const { currentSession, updateSession } = useDaySessions();
const { tasks, createTask, updateTask, deleteTask, completeTask } = useTasks();
const { settings } = useSettings();
const editTask = ref<ITask>(getDefaultSessionTask(currentSession.value));
const editTaskPopoverOpen = ref(false);
const taskPopoverAnchor = shallowRef<ReferenceElement | undefined>();

const remainingTime = computed(() => currentSession.value ? Math.ceil(currentSession.value.endTime.diff(currentTime.value, 'minutes', { conversionAccuracy: 'casual' }).minutes) : 0)
const suggestedTasks = computed(() => tasks.filter(t => t.session !== currentSession.value?.id && t.status !== TaskStatusEnum.COMPLETED && t.activity === currentSession.value?.activity && t.isToday))
const pendingSessionTasks = computed(() => tasks.filter(t => t.session === currentSession.value?.id && t.status === TaskStatusEnum.PENDING));
const completedSessionsTasks = computed(() => tasks.filter(t => t.session === currentSession.value?.id && t.status === TaskStatusEnum.COMPLETED));
const activeSessionTask = computed(() => tasks.find(t => t.session === currentSession.value?.id && t.status === TaskStatusEnum.ACTIVE));
const focusedTasks = computed(() => {
    const list = [];
    if (activeSessionTask.value) list.push(activeSessionTask.value);
    if (pendingSessionTasks.value[0]) list.push(pendingSessionTasks.value[0])
    if (pendingSessionTasks.value[1]) list.push(pendingSessionTasks.value[1])
    return list;
});

watch(activeSessionTask, (newValue) => {
    if (!newValue) setAutoActiveTask();
})

function handleTaskPrimary(event: MouseEvent, task: ITask) {
    switch (event.button) {
        case 0:
            if (event.ctrlKey) {
                handleOpenPopover(event, task)
            } else {
                markTaskActive(task);
            }
            break;
    }
}

function handleTaskSecondary(event: MouseEvent, task: ITask) {
    if (event.altKey) {
        deleteTask(task.id);
    } else {
        updateTask(task.id, { ...task, session: null, status: TaskStatusEnum.PENDING })
    }
}

function handleOpenPopover(event: MouseEvent, task?: ITask) {
    if (!currentSession.value) return;
    editTask.value = task ?? getDefaultSessionTask(currentSession.value, activeSessionTask.value ? TaskStatusEnum.PENDING : TaskStatusEnum.ACTIVE);
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

function setAutoActiveTask() {
    const pendingTask = pendingSessionTasks.value[0];
    if (pendingTask) {
        pendingTask.status = TaskStatusEnum.ACTIVE;
        updateTask(pendingTask.id, pendingTask);
    }
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
    <FunctionCard title="Now" :highlight="!!currentSession">
        <template #default>
            <Popover v-model:open="editTaskPopoverOpen">
                <PopoverAnchor :reference="taskPopoverAnchor"> </PopoverAnchor>
                <TaskFormPopover :existingTask="editTask" :suggestedTasks="suggestedTasks" @create="handleCreateTask"
                    @update="handleUpdateTask" />
            </Popover>
            <div class="h-full flex flex-col items-center">
                <!-- HEADER INFO -->
                <div class="flex flex-col gap-0.5 items-center">
                    <p class="text-3xl font-extrabold capitalize text-primary">
                        {{ currentSession ? currentSession.activity : "FREE SLOT" }}
                    </p>
                    <p class="text-base text-center text-primary/75 font-semibold capitalize">
                        {{ currentSession ? currentSession.title : 'No Active Session' }}
                    </p>
                    <div v-if="currentSession" class="text-xs text-center text-gray-500">
                        <span> {{ currentSession.startTime.toFormat(settings.DATE_FORMAT) }} - {{
                            currentSession.endTime.toFormat(settings.DATE_FORMAT) }} </span> •
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
                    <div @contextmenu.prevent class="grid gap-3 grid-rows-3 w-full select-none" v-auto-animate>
                        <div v-for="task in focusedTasks" :key="task.id"
                            @contextmenu="handleTaskSecondary($event, task)" @click="handleTaskPrimary($event, task)"
                            class="relative p-2 flex items-center min-w-0 justify-between ring ring-gray-200 rounded-md transition-shadow gap-2"
                            :class="{
                                'ring-primary': task.status === TaskStatusEnum.ACTIVE,
                                'hover:ring-primary/75': task.status !== TaskStatusEnum.ACTIVE
                            }">
                            <Button @click.stop="markTaskCompleted(task)" variant="ghost" size="icon"
                                class="text-gray-400 size-6 border border-gray-300">
                                <CheckIcon class="size-3.5" />
                            </Button>
                            <div class="flex-1 min-w-0">
                                <div class="font-medium text-sm text-gray-800 truncate">{{ task.title }}
                                </div>
                                <div v-if="task.description" class="text-xs text-gray-600 mt-1 truncate"> {{
                                    task.description }} </div>
                            </div>
                            <div class="absolute top-0 right-0 m-2 opacity-0 transition-opacity" :class="{
                                'opacity-100': task.status === TaskStatusEnum.ACTIVE
                            }">
                                <ZapIcon class="fill-primary stroke-transparent size-3">
                                </ZapIcon>
                                <div class="absolute top-0 bg-primary/50 size-3 rounded-full animate-ping">
                                </div>
                            </div>
                        </div>
                        <button @click="handleOpenPopover" v-if="focusedTasks.length < 3"
                            class="w-full h-full border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-primary hover:text-primary transition-all">
                            <span v-if="currentSession" class="flex items-center justify-center gap-2">
                                <PlusIcon class="size-4" /> Add Task
                            </span>
                            <span v-else>
                                - No Session -
                            </span>
                        </button>
                    </div>
                    <!-- NOTES & COMPLETED TASKS -->
                    <div class="w-1/3 h-full flex flex-col gap-2">
                        <div
                            class="relative p-1.5 pb-0 flex flex-col gap-0.5 h-full bg-gray-50 border border-gray-400 border-dashed rounded-sm text-gray-500 text-sm">
                            <div class="flex items-center gap-1.5">
                                <NotepadTextIcon class="size-4" />
                                <p class="font-semibold">Notes</p>
                            </div>
                            <div class="flex-1">
                                <textarea @focusout="updateSessionNotes" v-if="currentSession"
                                    v-model="currentSession.notes" :spellcheck="false"
                                    class="w-full resize-none outline-none h-full scroll-hidden"
                                    placeholder="Session Notes..." />
                                <p v-else> - No Session - </p>
                            </div>
                            <div
                                class="absolute rounded-sm inset-0 bg-gradient-to-b from-transparent from-75% to-white/75 pointer-events-none" />
                        </div>
                        <div
                            class="relative p-1.5 h-full flex flex-col gap-0.5 border border-gray-400 border-dashed rounded-sm text-gray-500 overflow-hidden text-sm">
                            <div class="flex items-center gap-1.5">
                                <ListCheckIcon class="size-4" />
                                <p class="font-semibold">Completed</p>
                                <span
                                    class="bg-gray-100 text-xs mx-1 flex items-center justify-center rounded-full size-5">
                                    {{ completedSessionsTasks.length }}
                                </span>
                            </div>
                            <TransitionGroup name="auto" tag="ul" class="flex-1 overflow-auto scroll-hidden relative">
                                <template v-if="completedSessionsTasks.length">
                                    <li v-for="task in completedSessionsTasks" :key="task.id"
                                        class="flex items-center gap-2 px-1 py-0.5">
                                        <CheckCheckIcon class="size-3" />
                                        <span class="flex-1 text-sm text-gray-500 line-through truncate">{{ task.title
                                            }}</span>
                                    </li>
                                </template>
                                <li v-else class="text-gray-400" key="else">
                                    - Empty -
                                </li>
                            </TransitionGroup>
                            <div
                                class="absolute rounded-sm inset-0 bg-gradient-to-b from-transparent from-75% to-white/75 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </FunctionCard>
</template>
