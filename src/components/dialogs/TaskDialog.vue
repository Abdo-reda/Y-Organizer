<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { reactiveComputed } from "@vueuse/core";
import { PenIcon } from "lucide-vue-next";
import { Switch } from "../ui/switch";
import { Label } from "@/components/ui/label"
import { ActivityStatusEnum } from "@/core/enums/activityStatusEnum";
import { computed } from "vue";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { getDefaultSessionTask, ITask } from "@/core/interfaces/entities/ITask";
import useActivity from "@/store/useActivity";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const props = defineProps<{ existingTask: ITask | null }>();
const emits = defineEmits<{
    create: [task: ITask];
    update: [id: number, task: ITask];
}>();

const taskForm = reactiveComputed<ITask>(() =>
props.existingTask ? { ...props.existingTask } : getDefaultSessionTask()
);

const { activities } = useActivity();
const activeActivities = computed(() => activities.filter((a) => a.status === ActivityStatusEnum.ACTIVE));
const selectedActivity = computed({
    get: () => activities.find(a => a.name === taskForm.activity),
    set: (activity) => {
        if (activity) taskForm.activity = activity?.name;
    }
});


function handleSubmit() {
    const updatedTask = { ...taskForm };
    if (props.existingTask?.id) {
        emits("update", props.existingTask?.id, updatedTask);
    } else {
        emits("create", updatedTask);
    }
    Object.assign(taskForm, getDefaultSessionTask())
}
</script>

<template>
    <DialogContent>
        <DialogHeader>
            <div class="flex justify-between">
                <DialogTitle>
                    Task
                </DialogTitle>
                <div class="flex items-center gap-2">
                    <Switch v-model="taskForm.isToday" id="isToday" />
                    <Label for="isToday">Today</Label>
                </div>
            </div>
            <DialogDescription class="hidden"> Create or edit a task. </DialogDescription>
        </DialogHeader>
        <form id="task-form" name="task-form" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-3">
                <div class="flex gap-2">
                    <!-- Task Title -->
                    <div class="flex-1 flex flex-col gap-1.5">
                        <Label for="title"> Title </Label>
                        <Input id="title" v-model="taskForm.title" type="text" placeholder="Enter task title..." />
                    </div>

                    <!-- Activity Selection -->
                    <div class="flex-1 flex flex-col gap-1.5">
                        <Label for="title"> Activity </Label>
                        <Select v-model="selectedActivity">
                            <SelectTrigger class="w-full">
                                <SelectValue>
                                    <p class="flex gap-2 items-center" v-if="selectedActivity">
                                        <span class="rounded-full block size-3"
                                            :style="{ backgroundColor: selectedActivity.color }">
                                        </span>
                                        {{ selectedActivity.name }}
                                    </p>
                                    <p v-else>
                                        Select Activity...
                                    </p>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem v-for="activity in activeActivities" :value="activity"
                                        class="focus:bg-hover/10" :style="{ '--color-hover': activity.color }">
                                        <span class="rounded-full size-3" :style="{ backgroundColor: activity.color }">
                                        </span> {{ activity.name }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <!-- Description -->
                <div class="flex flex-col gap-1.5">
                    <Label for="description"> Description </Label>
                    <Textarea id="description" v-model="taskForm.description" placeholder="Task description..."
                        class="resize-none" />
                </div>
            </div>
        </form>
        <DialogFooter>
            <Button type="submit" variant="outline" form="task-form">
                <PenIcon /> {{ props.existingTask ? "Update" : "Create" }}
            </Button>
        </DialogFooter>
    </DialogContent>
</template>
