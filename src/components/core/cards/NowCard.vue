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
import { computed, ref, shallowRef } from "vue";

const { currentTime } = useCurrentTime();
const { currentSession, updateSession } = useDaySessions();
const { tasks, updateTask } = useTasks();
const { settings } = useSettings();
const editTask = ref<ITask>(getDefaultSessionTask(currentSession.value));
const editTaskPopoverOpen = ref(false);
const taskPopoverAnchor = shallowRef<ReferenceElement | undefined>();

//TODO: CURRENT SESSION CARD
//- underneath them is the active task
//- underneath it is 3 slots for tasks, each task can be cleared, deleted, edited, and marked as done and marked as active
//- shortcuts?
//- clear
//- delete
//- edit
//- create
//- mark as done
//- mark as active

const remainingTime = computed(() => currentSession.value ? Math.ceil(currentSession.value.endTime.diff(currentTime.value, 'minutes', { conversionAccuracy: 'casual' }).minutes) : 0)

const pendingSessionTasks = computed(() => tasks.filter(t => t.session === currentSession.value?.id && t.status !== TaskStatusEnum.PENDING));
const completedSessionsTasks = computed(() => tasks.filter(t => t.session === currentSession.value?.id && t.status === TaskStatusEnum.COMPLETED));
const activeSessionTask = computed(() => tasks.find(t => t.session === currentSession.value?.id && t.status === TaskStatusEnum.ACTIVE));

function handleOpenPopover(event: MouseEvent) {
    editTask.value = getDefaultSessionTask(currentSession.value);
    taskPopoverAnchor.value = event.currentTarget as ReferenceElement;
    editTaskPopoverOpen.value = true;
}

function markTaskActive(task: ITask) {
    if (activeSessionTask.value) {
        activeSessionTask.value.status = TaskStatusEnum.PENDING;
        updateTask(activeSessionTask.value.id, activeSessionTask.value);
    }
    task.status = TaskStatusEnum.ACTIVE;
    updateTask(task.id, task);
}

function markTaskCompleted(task: ITask) {
    task.status = TaskStatusEnum.COMPLETED;
    updateTask(task.id, task);
}

function updateSessionNotes() {
    if (!currentSession.value) return;
    updateSession(currentSession.value?.id, currentSession.value);
}

</script>

<template>
    <FunctionCard title="Now" :highlight="!!currentSession">
        <template #default>
            <Popover v-model:open="editTaskPopoverOpen">
                <PopoverAnchor :reference="taskPopoverAnchor"> </PopoverAnchor>
                <TaskFormPopover :existingTask="editTask" />
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
                <div class="flex-1 flex justify-center gap-3 px-2 py-1 overflow-hidden w-full">

                    <!-- TASKS -->
                    <div class="grid gap-1.5 grid-rows-[1fr_auto_1fr_1fr] w-full" v-auto-animate>
                        <template v-if="activeSessionTask">
                            <div
                                class="p-2 flex items-center min-w-0 border border-primary/75 justify-between rounded-md relative">
                                <div class="flex min-w-0 items-center gap-2">
                                    <div class="flex-1 min-w-0">
                                        <p class="font-medium text-sm text-gray-800 truncate"> {{
                                            activeSessionTask.title }} </p>
                                        <p class="text-xs text-gray-600 mt-1 truncate"> {{ activeSessionTask.description
                                        }} </p>
                                    </div>
                                </div>
                                <Button @click="markTaskCompleted(activeSessionTask)" variant="ghost" size="icon"
                                    class="text-gray-400 size-6">
                                    <CheckIcon class="size-3.5" />
                                </Button>
                                <div class="absolute top-0 right-0 m-1">
                                    <ZapIcon class="fill-primary stroke-transparent size-3">
                                    </ZapIcon>
                                    <div class="absolute top-0 bg-primary/50 size-3 rounded-full animate-ping">
                                    </div>
                                </div>
                            </div>
                        </template>
                        <button @click="handleOpenPopover" v-else
                            class="w-full h-full border-2 border-dashed border-gray-300 rounded-xs text-gray-600 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                            <PlusIcon class="size-4" />
                            Add Task
                        </button>
                        <div class="border-t w-1/3 border-dashed border-primary mx-auto"></div>
                        <div v-for="task in pendingSessionTasks.slice(0, 2)" :key="task.id"
                            class="p-2 flex items-center min-w-0 justify-between bg-gray-50 border border-gray-200 rounded-sm">
                            <div class="flex-1 min-w-0">
                                <div class="font-medium text-sm text-gray-800 truncate">{{ task.id }}
                                </div>
                                <div class="text-xs text-gray-600 mt-1 truncate"> {{ task.description }} </div>
                            </div>
                            <div class="flex items-center gap-1">
                                <Button @click="markTaskActive(task)" variant="ghost" size="icon"
                                    class="text-gray-400 size-6">
                                    <ZapIcon class="size-3.5" />
                                </Button>
                                <Button @click="markTaskCompleted(task)" variant="ghost" size="icon"
                                    class="text-gray-400 size-6">
                                    <CheckIcon class="size-3.5" />
                                </Button>
                            </div>
                        </div>
                        <button @click="handleOpenPopover" v-if="pendingSessionTasks.length < 2 && activeSessionTask"
                            class="w-full h-full border-2 border-dashed border-gray-300 rounded-xs text-gray-600 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                            <PlusIcon class="size-4" />
                            Add Task
                        </button>
                    </div>
                    <!-- NOTES -->
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
                            class="relative p-1.5 h-full flex flex-col gap-0.5 border border-gray-400 border-dashed rounded-sm text-gray-500 text-sm">
                            <div class="flex items-center gap-1.5">
                                <ListCheckIcon class="size-4" />
                                <p class="font-semibold">Completed</p>
                                <span
                                    class="bg-gray-100 text-xs mx-1 flex items-center justify-center rounded-full size-5">
                                    {{ completedSessionsTasks.length }}
                                </span>
                            </div>
                            <div class="flex-1 flex flex-col gap-2 scroll-hidden" v-auto-animate>
                                <div v-for="task in completedSessionsTasks" :key="task.id"
                                    class="flex items-center gap-2 p-1">
                                    <CheckCheckIcon class="size-3" />
                                    <span class="text-sm text-gray-500 line-through">{{ task.title }}</span>
                                </div>
                            </div>
                            <div
                                class="absolute rounded-sm inset-0 bg-gradient-to-b from-transparent from-75% to-white/75 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </FunctionCard>
</template>
