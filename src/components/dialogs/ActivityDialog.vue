<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ACTIVITY_COLORS } from "@/core/constants/activityColors";
import { LifeCategoryColorMapper, LifeCategoryEnum, LifeCategoryIconMapper } from "@/core/enums/lifeCategoryEnum";
import { cloneActivity, generateDefaultActivity, IActivity } from "@/core/interfaces/entities/IActivity";
import { reactiveComputed } from "@vueuse/core";
import { PenIcon } from "lucide-vue-next";
import { Switch } from "../ui/switch";
import { Label } from "@/components/ui/label"
import { ActivityStatusEnum } from "@/core/enums/activityStatusEnum";
import { computed } from "vue";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const props = defineProps<{ existingActivity: IActivity | null }>();
const emits = defineEmits<{
    create: [activity: IActivity];
    update: [id: string, activity: IActivity];
}>();
const activityForm = reactiveComputed<IActivity>(() =>
    props.existingActivity ? cloneActivity(props.existingActivity) : generateDefaultActivity()
);
const isActive = computed({
    get: () => activityForm.status === ActivityStatusEnum.ACTIVE,
    set: (value: boolean) => {
        activityForm.status = value ? ActivityStatusEnum.ACTIVE : ActivityStatusEnum.DISABLED;
    },
});

const categoryOptions = Object.values(LifeCategoryEnum);

function toggleCategory(category: LifeCategoryEnum) {
    const index = activityForm.categories.indexOf(category);
    if (index > -1) activityForm.categories.splice(index, 1);
    else activityForm.categories.push(category);
}

function handleSubmit() {
    const updatedActivity = cloneActivity(activityForm);
    if (props.existingActivity) emits("update", props.existingActivity.name, updatedActivity);
    else emits("create", updatedActivity);
    Object.assign(activityForm, generateDefaultActivity());
}
</script>

<template>
    <DialogContent>
        <DialogHeader>
            <div class="flex justify-between">
                <DialogTitle>
                    Activity
                </DialogTitle>
                <div class="flex items-center gap-2">
                    <Switch v-model="isActive" id="active" />
                    <Label for="active">Active</Label>
                </div>
            </div>
            <DialogDescription class="hidden"> Create or edit an activity. </DialogDescription>
        </DialogHeader>
        <form id="activity-form" name="activity-form" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-3">
                <!-- Activity Name -->
                <div class="flex flex-col gap-1.5">
                    <Label for="name"> Name </Label>
                    <Input id="name" v-model="activityForm.name" type="text" placeholder="Enter activity name..." />
                </div>

                <!-- Description -->
                <div class="flex flex-col gap-1.5">
                    <Label for="description"> Description </Label>
                    <Textarea id="description" v-model="activityForm.description" placeholder="Describe this activity..."  class="resize-none" /> 
                </div>

                <!-- Color Selection -->
                <div class="flex flex-col gap-1.5">
                    <Label for="color"> Color </Label>
                    <div class="flex gap-4 items-start justify-between">
                        <div class="flex-1 flex items-center gap-2">
                            <Input v-model="activityForm.color" type="color" class="w-1/4 p-1"/>
                            <Input v-model="activityForm.color" type="text" placeholder="#000000" />
                        </div>
                        <div class="grid grid-cols-8 gap-2">
                            <button type="button" v-for="color in ACTIVITY_COLORS" :key="color"
                                @click="activityForm.color = color" :class="[
                                    'size-5 rounded-full transition-all hover:scale-110',
                                    activityForm.color === color ? 'ring-2 ring-muted scale-110' : '',
                                ]" :style="{ backgroundColor: color }"></button>
                        </div>
                    </div>
                </div>

                <!-- Categories -->
                <div class="flex flex-col gap-2">
                    <Label> Categories </Label>
                    <div class="flex flex-wrap gap-1">
                        <button type="button" v-for="category in categoryOptions" :key="category"
                            @click="toggleCategory(category)" :class="[
                                'px-2 py-1 text-xs rounded-md border transition-all flex items-center gap-1',
                                activityForm.categories.includes(category)
                                    ? 'bg-background border-hover/75 text-hover font-semibold'
                                    : 'bg-muted/10 border-muted text-muted-foreground hover:bg-muted/60',
                            ]" :style="{ '--color-hover': LifeCategoryColorMapper[category] }">
                            <component :is="LifeCategoryIconMapper[category]" class="size-3" />
                            {{ category }}
                        </button>
                    </div>
                </div>
            </div>
        </form>
        <DialogFooter>
            <Button type="submit" variant="outline" form="activity-form">
                <PenIcon /> {{ props.existingActivity ? "Update" : "Create" }}
            </Button>
        </DialogFooter>
    </DialogContent>
</template>
