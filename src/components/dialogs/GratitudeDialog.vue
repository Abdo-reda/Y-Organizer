<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LifeCategoryColorMapper, LifeCategoryEnum, LifeCategoryIconMapper } from "@/core/enums/lifeCategoryEnum";
import { reactiveComputed } from "@vueuse/core";
import { PenIcon } from "lucide-vue-next";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { cloneGratitude, getDefaultGratitude, IGratitude } from "@/core/interfaces/entities/IGratitude";
import useDayState from "@/store/useDayState";

const props = defineProps<{ existingGratitude: IGratitude | null }>();
const emits = defineEmits<{
	create: [gratitude: IGratitude];
	update: [id: number, gratitude: IGratitude];
}>();

const { selectedDay } = useDayState();
const gratitudeForm = reactiveComputed<IGratitude>(() => (props.existingGratitude ? cloneGratitude(props.existingGratitude) : getDefaultGratitude(selectedDay.value)));

const categoryOptions = Object.values(LifeCategoryEnum);

function toggleCategory(category: LifeCategoryEnum) {
	gratitudeForm.category = gratitudeForm.category === category ? null : category;
}

function handleSubmit() {
	const updatedGratitude = cloneGratitude(gratitudeForm);
	updatedGratitude.highlights = updatedGratitude.highlights.filter((h) => h < updatedGratitude.title.trim().split(/\s+/).length);
	if (props.existingGratitude?.id) emits("update", props.existingGratitude.id, updatedGratitude);
	else emits("create", updatedGratitude);
	Object.assign(gratitudeForm, getDefaultGratitude(selectedDay.value));
}
</script>

<template>
	<DialogContent>
		<DialogHeader>
			<div class="flex justify-between">
				<DialogTitle> Gratitude </DialogTitle>
			</div>
			<DialogDescription class="hidden"> Create or edit a gratitude. </DialogDescription>
		</DialogHeader>
		<form id="activity-form" name="activity-form" @submit.prevent="handleSubmit">
			<div class="flex flex-col gap-3">
				<!-- Activity Title -->
				<div class="flex flex-col gap-1.5">
					<Label for="title"> Title </Label>
					<Input id="title" v-model="gratitudeForm.title" type="text" placeholder="Enter gratitude title..." />
				</div>

				<!-- Categories -->
				<div class="flex flex-col gap-2">
					<Label> Categories </Label>
					<div class="flex flex-wrap gap-1">
						<button
							type="button"
							v-for="category in categoryOptions"
							:key="category"
							@click="toggleCategory(category)"
							class="px-2 py-1 text-xs rounded-md border transition-all flex items-center gap-1"
							:class="{
								'bg-background border-hover/75 text-hover font-semibold': gratitudeForm.category === category,
								'bg-muted/10 border-muted text-muted-foreground hover:bg-muted/60': gratitudeForm.category !== category,
							}"
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
			<Button type="submit" variant="outline" form="activity-form"> <PenIcon /> {{ props.existingGratitude ? "Update" : "Create" }} </Button>
		</DialogFooter>
	</DialogContent>
</template>
