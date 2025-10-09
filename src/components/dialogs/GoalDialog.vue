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
import useActivity from "@/store/useActivity";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getDefaultGoal, IGoal } from "@/core/interfaces/entities/IGoal";
import { GoalStatusEnum } from "@/core/enums/goalStatusEnum";
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from "../ui/number-field";

const props = defineProps<{ existingGoal: IGoal | null }>();
const emits = defineEmits<{
    create: [goal: IGoal];
    update: [id: number, goal: IGoal];
}>();

const goalForm = reactiveComputed<IGoal>(() =>
    props.existingGoal ? { ...props.existingGoal } : getDefaultGoal()
);
const { activities } = useActivity();
const activeActivities = computed(() => activities.filter((a) => a.status === ActivityStatusEnum.ACTIVE));

const selectedActivity = computed({
    get: () => activities.find(a => a.name === goalForm.activity),
    set: (activity) => {
        if (activity) goalForm.activity = activity.name;
    }
});

const isActive = computed({
    get: () => goalForm.status === GoalStatusEnum.ACTIVE,
    set: (value: boolean) => {
        goalForm.status = value ? GoalStatusEnum.ACTIVE : GoalStatusEnum.DISABLED;
    },
});

function handleSubmit() {
    const updatedGoal = { ...goalForm };
    if (props.existingGoal?.id) {
        emits("update", props.existingGoal?.id, updatedGoal);
    } else {
        emits("create", updatedGoal);
    }
    Object.assign(goalForm, getDefaultGoal())
}
</script>

<template>
    <DialogContent>
        <DialogHeader>
            <div class="flex justify-between">
                <DialogTitle>
                    Monthly Goal
                </DialogTitle>
                <div class="flex items-center gap-2">
                    <Switch v-model="isActive" id="isActive" />
                    <Label for="isActive">Active</Label>
                </div>
            </div>
            <DialogDescription class="hidden"> Create or edit a monthly goal. </DialogDescription>
        </DialogHeader>
        <form id="goal-form" name="goal-form" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-3">
                <!-- Title & Activity -->

                <div class="flex-1 flex flex-col gap-1.5">
                    <Label for="title"> Title </Label>
                    <Input id="title" v-model="goalForm.title" type="text" placeholder="Goal title..." />
                </div>



                <div class="flex gap-2">
                    <div class="flex-2 flex flex-col gap-1.5">
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

                    <NumberField class="flex-1" id="totalPoints" v-model="goalForm.totalPoints" :min="0" :step="10">
                        <Label for="totalPoints">Points</Label>
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
                    <Textarea id="description" v-model="goalForm.description" placeholder="Goal description..."
                        class="resize-none" />
                </div>
            </div>
        </form>
        <DialogFooter>
            <Button type="submit" variant="outline" form="goal-form">
                <PenIcon /> {{ props.existingGoal ? "Update" : "Create" }}
            </Button>
        </DialogFooter>
    </DialogContent>
</template>
