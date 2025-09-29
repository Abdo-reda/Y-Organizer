<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ACTIVITY_COLORS } from "@/core/constants/activityColors";
import { LifeCategoryColorMapper, LifeCategoryEnum, LifeCategoryIconMapper } from "@/core/enums/lifeCategoryEnum";
import { DEFAULT_ACTIVITY, IActivity } from "@/core/interfaces/entities/IActivity";
import { reactiveComputed } from "@vueuse/core";
import { PenIcon } from "lucide-vue-next";
import { Switch } from "../ui/switch";

const props = defineProps<{ existingActivity: IActivity | null }>();
const emits = defineEmits<{
	create: [activity: IActivity];
	update: [id: string, activity: IActivity];
}>();
const activityForm = reactiveComputed<IActivity>(() =>
	props.existingActivity ? { ...props.existingActivity } : DEFAULT_ACTIVITY()
);
const categoryOptions = Object.values(LifeCategoryEnum);

function toggleCategory(category: LifeCategoryEnum) {
	const index = activityForm.categories.indexOf(category);
	if (index > -1) activityForm.categories.splice(index, 1);
	else activityForm.categories.push(category);
}

function handleSubmit() {
	if (props.existingActivity) emits("update", props.existingActivity.name, { ...activityForm });
	else emits("create", { ...activityForm });
	Object.assign(activityForm, DEFAULT_ACTIVITY());
}
</script>

<template>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Activity</DialogTitle>
			<DialogDescription class="hidden"> Create or edit an activity. </DialogDescription>
            
		</DialogHeader>
		<form id="activity-form" name="activity-form" @submit.prevent="handleSubmit">
			<div class="flex flex-col gap-2">
				<!-- Activity Name -->
				<div>
					<label class="block text-xs font-medium text-gray-700 my-1"> Activity Name </label>
					<div class="flex gap-6">
						<input
							v-model="activityForm.name"
							type="text"
							placeholder="Enter activity name..."
							class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						/>
						<div class="flex items-center gap-2">
							<Switch id="active" />
							<Label for="active">Active</Label>
						</div>
					</div>
				</div>

				<!-- Description -->
				<div>
					<label class="block text-xs font-medium text-gray-700 my-1"> Description </label>
					<textarea
						v-model="activityForm.description"
						placeholder="Describe this activity..."
						rows="2"
						class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
					></textarea>
				</div>

				<!-- Color Selection -->
				<div>
					<label class="block text-xs font-medium text-gray-700 mb-2"> Color </label>
					<div class="flex gap-4 items-start justify-between">
						<div class="flex-1 flex items-center gap-2">
							<input v-model="activityForm.color" type="color" class="size-6" />
							<input
								v-model="activityForm.color"
								type="text"
								placeholder="#000000"
								class="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div class="grid grid-cols-8 gap-2">
							<button
								type="button"
								v-for="color in ACTIVITY_COLORS"
								:key="color"
								@click="activityForm.color = color"
								:class="[
									'size-5 rounded-full transition-all hover:scale-110',
									activityForm.color === color ? 'ring-2 ring-gray-200 scale-110' : '',
								]"
								:style="{ backgroundColor: color }"
							></button>
						</div>
					</div>
				</div>

				<!-- Categories -->
				<div>
					<label class="block text-xs font-medium text-gray-700 mb-2"> Categories </label>
					<div class="flex flex-wrap gap-1">
						<button
							type="button"
							v-for="category in categoryOptions"
							:key="category"
							@click="toggleCategory(category)"
							:class="[
								'px-2 py-1 text-xs rounded-md border transition-all flex items-center gap-1',
								activityForm.categories.includes(category)
									? 'bg-white border-hover/75 text-hover font-semibold'
									: 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100',
							]"
							:style="{ '--color-hover': LifeCategoryColorMapper[category] }"
						>
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
