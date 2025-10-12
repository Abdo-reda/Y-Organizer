<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { reactiveComputed } from "@vueuse/core";
import { CircleDotIcon, PenIcon } from "lucide-vue-next";
import { Switch } from "../ui/switch";
import { Label } from "@/components/ui/label"
import { ActivityStatusEnum } from "@/core/enums/activityStatusEnum";
import { computed } from "vue";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { getDefaultSessionTask, ITask } from "@/core/interfaces/entities/ITask";
import useActivity from "@/store/useActivity";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from "../ui/number-field";
import useMonthlyGoals from "@/store/useMonthlyGoals";
import { GoalStatusEnum } from "@/core/enums/goalStatusEnum";

const props = defineProps<{ existingTask: ITask | null }>();
const emits = defineEmits<{
    create: [task: ITask];
    update: [id: number, task: ITask];
}>();

const taskForm = reactiveComputed<ITask>(() =>
    props.existingTask ? { ...props.existingTask } : getDefaultSessionTask()
);

const { activities } = useActivity();
const { monthlyGoals } = useMonthlyGoals();
const activeGoals = computed(() => monthlyGoals.filter(g => g.status === GoalStatusEnum.ACTIVE && (taskForm.activity ? g.activity === taskForm.activity : true)))
const activeActivities = computed(() => activities.filter((a) => a.status === ActivityStatusEnum.ACTIVE));
const selectedActivity = computed({
    get: () => activities.find(a => a.name === taskForm.activity),
    set: (activity) => {
        if (activity) taskForm.activity = activity?.name;
        if (selectedGoal.value?.activity !== activity?.name) taskForm.goal = null;
    }
});

const selectedGoal = computed({
    get: () => monthlyGoals.find(g => g.id === taskForm.goal),
    set: (goal) => {
        if (goal?.id) {
            taskForm.goal = goal.id;
            if (!taskForm.activity) taskForm.activity = goal.activity;
        }
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
                        <Input id="title" v-model="taskForm.title" type="text" placeholder="Task title..." />
                    </div>

                    <!-- Activity Selection -->
                    <div class="flex-1 flex flex-col gap-1.5 overflow-hidden">
                        <Label for="title"> Activity </Label>
                        <Select v-model="selectedActivity">
                            <SelectTrigger class="w-full">
                                 <SelectValue>
                                    <span class="flex gap-2 items-center min-w-0" v-if="selectedActivity">
                                        <span class="rounded-full block size-3 shrink-0"
                                            :style="{ backgroundColor: selectedActivity.color }">
                                        </span>
                                        <span class="truncate">
                                            {{ selectedActivity.name }}
                                        </span>
                                    </span>
                                    <span v-else>
                                        Select Activity...
                                    </span>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem v-for="activity in activeActivities" :value="activity"
                                        class="focus:bg-hover/10" :style="{ '--color-hover': activity.color }">
                                        <span class="rounded-full size-3 bg-hover">
                                        </span> {{ activity.name }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <!-- Goal Selection -->
                <div class="flex gap-2">
                    <div class="flex-1 flex flex-col gap-1.5 overflow-hidden">
                        <Label for="goal"> Goal </Label>
                        <Select v-model="selectedGoal">
                            <SelectTrigger class="w-full">
                                <SelectValue>
                                    <span class="flex gap-2 items-center min-w-0" v-if="selectedGoal">
                                        <CircleDotIcon class="stroke-hover stroke-3 shrink-0" :style="{
                                            '--color-hover': selectedActivity?.color
                                        }" />
                                        <span class="truncate">
                                            {{ selectedGoal.title }}
                                        </span>
                                    </span>
                                    <span v-else>
                                        Select Goal...
                                    </span>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <template v-if="activeGoals.length">
                                        <SelectItem v-for="goal in activeGoals" :value="goal" class="focus:bg-hover/10"
                                            :style="{ '--color-hover': activities.find(a => a.name === goal.activity)?.color }">
                                            <CircleDotIcon class="stroke-hover stroke-3" />
                                            {{ goal.title }}
                                        </SelectItem>
                                    </template>
                                    <template v-else>
                                        <p class="text-sm text-highlight select-none">
                                            - No Goals Found -
                                        </p>
                                    </template>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <NumberField class="flex-1" id="points" :disabled="!taskForm.goal" v-model="taskForm.points" :min="0" :step="10">
                        <Label for="points">Points</Label>
                        <NumberFieldContent>
                            <NumberFieldDecrement />
                            <NumberFieldInput />
                            <NumberFieldIncrement />
                        </NumberFieldContent>
                    </NumberField>
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
