<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import TaskDialog from '@/components/dialogs/TaskDialog.vue';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Dialog } from '@/components/ui/dialog';
import { useMouseScroll } from '@/composables/useMouseScroll';
import { TaskStatusEnum, TaskStatusOrder } from '@/core/enums/taskStatusEnum';
import { ITask } from '@/core/interfaces/entities/ITask';
import useActivity from '@/store/useActivity';
import useTasks from '@/store/useTasks';
import { CheckIcon, PlusIcon } from 'lucide-vue-next';
import { computed, ref, useTemplateRef } from 'vue';

const tasksContainer = useTemplateRef('tasks-container');
const backlogContainer = useTemplateRef('backlog-container');
const taskContainerEl = computed(() => tasksContainer.value?.$el)
const backlogContainerEl = computed(() => backlogContainer.value?.$el)
useMouseScroll(taskContainerEl);
useMouseScroll(backlogContainerEl);
const { activities } = useActivity();
const { tasks, createTask, updateTask, deleteTask, completeTask } = useTasks();
const todayTasks = computed(() => tasks.filter(t => t.isToday).sort((a, b) => {
    const statusOrder = TaskStatusOrder[a.status] - TaskStatusOrder[b.status];
    if (statusOrder === 0) return a.activity.localeCompare(b.activity);
    return statusOrder;
}));
const backlogTasks = computed(() => tasks.filter(t => !t.isToday).sort((a, b) => {
    const statusOrder = TaskStatusOrder[a.status] - TaskStatusOrder[b.status];
    if (statusOrder === 0) return a.activity.localeCompare(b.activity);
    return statusOrder;
}));
const taskEditDialogOpen = ref(false);
const editTask = ref<ITask | null>(null);

function handleTaskPrimary(event: MouseEvent, task: ITask) {
    if (event.button === 0 && event.ctrlKey) openEditDialog(task);
}

function handleTaskSecondary(event: MouseEvent, task: ITask) {
    if (event.altKey) {
        deleteTask(task.id);
    } else {
        updateTask(task.id, { ...task, session: null, isToday: !task.isToday })
    }
}

function handleCreate(task: ITask) {
    createTask(task);
    closeEditDialog();
}

function handleUpdate(id: number, task: ITask) {
    updateTask(id, task);
    closeEditDialog();
}

function markTaskCompleted(task: ITask) {
    completeTask(task);
}

function openEditDialog(task: ITask | null = null) {
    editTask.value = task;
    taskEditDialogOpen.value = true;
}

function closeEditDialog() {
    editTask.value = null;
    taskEditDialogOpen.value = false;
}


</script>

<template>
    <FunctionCard title="Tasks">
        <template #default>
            <Dialog v-model:open="taskEditDialogOpen">
                <TaskDialog :existing-task="editTask" @create="handleCreate" @update="handleUpdate" />
            </Dialog>
            <Carousel>
                <CarouselContent @contextmenu.prevent>
                    <CarouselItem>
                        <div class="flex flex-col h-full">
                            <p class="text-sm"> Today </p>
                            <TransitionGroup ref="tasks-container" name="auto" tag="ul"
                                class="scroll-drag flex-1 select-none space-y-2 p-2">
                                <li v-for="task in todayTasks" :key="task.id"
                                    @contextmenu="handleTaskSecondary($event, task)"
                                    @click="handleTaskPrimary($event, task)"
                                    class="relative p-1 flex items-center min-w-0 justify-between ring ring-transparent rounded-md transition-shadow gap-2.5 hover:ring-hover/80"
                                    :class="{
                                        'opacity-50': task.status === TaskStatusEnum.COMPLETED
                                    }" :style="{
                                        '--color-hover': activities.find(a => a.name === task.activity)?.color
                                    }">
                                    <Button v-if="task.status !== TaskStatusEnum.COMPLETED"
                                        @click.stop="markTaskCompleted(task)" variant="ghost" size="icon"
                                        class="text-muted-foreground/85 size-5 hover:text-hover">
                                        <CheckIcon class="size-3" />
                                    </Button>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex gap-1.5 items-center">
                                            <span class="size-2 rounded-full bg-hover aspect-square"> </span>
                                            <p class="font-medium text-sm truncate" :class="{
                                                'line-through': task.status === TaskStatusEnum.COMPLETED
                                            }"> {{ task.title }} </p>
                                        </div>
                                        <div v-if="task.status !== TaskStatusEnum.COMPLETED"
                                            class="text-xs text-muted-foreground mt-1 truncate"> {{
                                                task.description ? task.description : '- no description -' }} </div>
                                    </div>
                                </li>
                            </TransitionGroup>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div class="flex flex-col h-full">
                            <p class="text-sm"> Backlog </p>
                            <TransitionGroup ref="backlog-container" name="auto" tag="ul"
                                class="scroll-drag flex-1 select-none space-y-2 p-2">
                                <li v-for="task in backlogTasks" :key="task.id"
                                    @contextmenu="handleTaskSecondary($event, task)"
                                    @click="handleTaskPrimary($event, task)"
                                    class="relative p-1 flex items-center min-w-0 justify-between ring ring-transparent rounded-md transition-shadow gap-2.5 hover:ring-hover/80"
                                    :class="{
                                        'opacity-50': task.status === TaskStatusEnum.COMPLETED
                                    }" :style="{
                                        '--color-hover': activities.find(a => a.name === task.activity)?.color
                                    }">
                                    <Button v-if="task.status !== TaskStatusEnum.COMPLETED"
                                        @click.stop="markTaskCompleted(task)" variant="ghost" size="icon"
                                        class="text-muted-foreground/85 size-5 hover:text-hover">
                                        <CheckIcon class="size-3" />
                                    </Button>
                                    <div class="flex-1 min-w-0">
                                        <div class="flex gap-1.5 items-center">
                                            <span class="size-2 rounded-full bg-hover aspect-square"> </span>
                                            <p class="font-medium text-sm truncate" :class="{
                                                'line-through': task.status === TaskStatusEnum.COMPLETED
                                            }"> {{ task.title }} </p>
                                        </div>
                                        <div v-if="task.status !== TaskStatusEnum.COMPLETED"
                                            class="text-xs text-muted-foreground mt-1 truncate"> {{
                                                task.description ? task.description : '- no description -' }} </div>
                                    </div>
                                </li>
                            </TransitionGroup>
                        </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </template>
        <template #header-right-actions>
            <div class="flex justify-end gap-1">
                <Button @click="openEditDialog()" variant="ghost" size="icon">
                    <PlusIcon />
                </Button>
            </div>
        </template>
    </FunctionCard>
</template>