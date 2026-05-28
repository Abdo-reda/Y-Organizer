<script setup lang="ts">
import FunctionCard from "@/components/common/FunctionCard.vue";
import GoalDialog from "@/components/dialogs/GoalDialog.vue";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { GoalStatusEnum } from "@/core/enums/goalStatusEnum";
import { IGoal } from "@/core/interfaces/entities/IGoal";
import useActivity from "@/store/useActivity";
import useDayState from "@/store/useDayState";
import useMonthlyGoals from "@/store/useMonthlyGoals";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { CheckCheckIcon, PlusIcon } from "lucide-vue-next";
import { computed, ref, useTemplateRef } from "vue";
import { useMouseScroll } from "@/composables/useMouseScroll";

// TODO: can make a separate component for the goal-row

const CIRCUMFERENCE = 2 * Math.PI * 16;
const currentGoalsContainer = useTemplateRef("current-goals-container");
const completedGoalsContainer = useTemplateRef("completed-goals-container");
const backlogGoalsContainer = useTemplateRef("backlog-goals-container");
const currentGoalsContainerEl = computed(() => currentGoalsContainer.value?.$el);
const completedGoalsContainerEl = computed(() => completedGoalsContainer.value?.$el);
const backlogGoalsContainerEl = computed(() => backlogGoalsContainer.value?.$el);
useMouseScroll(currentGoalsContainerEl);
useMouseScroll(completedGoalsContainerEl);
useMouseScroll(backlogGoalsContainerEl);
const { selectedDay } = useDayState();
const { activities } = useActivity();
const { monthlyGoals, createGoal, updateGoal, deleteGoal, updateGoalStatus } = useMonthlyGoals();
const currentMonthGoals = computed(() =>
	monthlyGoals.filter((g) => g.status === GoalStatusEnum.ACTIVE || (g.status === GoalStatusEnum.COMPLETED && g.completedDay === selectedDay.value.toISODate({ precision: "month" }))),
);
const completedGoals = computed(() =>
	monthlyGoals
		.filter((g) => g.status === GoalStatusEnum.COMPLETED)
		.sort((a, b) => {
			if (!a.completedDay && !b.completedDay) return 0;
			if (!a.completedDay) return 1;
			if (!b.completedDay) return -1;
			return b.completedDay.localeCompare(a.completedDay);
		}),
);
const backlogGoals = computed(() => monthlyGoals.filter((g) => g.status === GoalStatusEnum.DISABLED).sort((a, b) => b.points / b.totalPoints - a.points / a.totalPoints));
const completedCurrentMonth = computed(() => currentMonthGoals.value.filter((g) => g.status === GoalStatusEnum.COMPLETED).length);
const currentMonth = computed(() => selectedDay.value.monthLong);
const activitiesColorsMap = computed(() => new Map(activities.map((a) => [a.name, a.color])));
const goalEditDialogOpen = ref(false);
const editGoal = ref<IGoal | null>(null);

function handleGoalPrimary(event: MouseEvent, goal: IGoal) {
	if (event.button === 0 && event.ctrlKey) {
		openEditDialog(goal);
	} else if (event.button === 0 && event.altKey) {
		updateGoalStatus(goal, goal.status === GoalStatusEnum.COMPLETED ? GoalStatusEnum.ACTIVE : GoalStatusEnum.COMPLETED);
	}
}

function handleGoalSecondary(event: MouseEvent, goal: IGoal) {
	if (event.altKey) {
		deleteGoal(goal.id);
	} else {
		if (goal.status === GoalStatusEnum.DISABLED) {
			updateGoalStatus(goal, goal.completedDay ? GoalStatusEnum.COMPLETED : GoalStatusEnum.ACTIVE);
		} else {
			updateGoalStatus(goal, GoalStatusEnum.DISABLED);
		}
	}
}

function handleCreate(goal: IGoal) {
	createGoal(goal);
	closeEditDialog();
}

function handleUpdate(id: number, goal: IGoal) {
	updateGoal(id, goal);
	closeEditDialog();
}

function openEditDialog(goal: IGoal | null = null) {
	editGoal.value = goal;
	goalEditDialogOpen.value = true;
}

function closeEditDialog() {
	editGoal.value = null;
	goalEditDialogOpen.value = false;
}
</script>

<template>
	<FunctionCard title="Monthly Goals" :sub-title="currentMonth">
		<template #header-left-actions>
			<div class="flex items-center gap-1 rounded-md border border-muted-foreground/85 py-1 px-2 m-1 w-fit">
				<CheckCheckIcon class="size-4" />
				<p class="text-sm">
					{{ `${completedCurrentMonth} / ${currentMonthGoals.length}` }}
				</p>
			</div>
		</template>
		<template #default>
			<Dialog v-model:open="goalEditDialogOpen">
				<GoalDialog :existing-goal="editGoal" @create="handleCreate" @update="handleUpdate" />
			</Dialog>
			<Carousel
				:opts="{
					loop: true,
				}"
			>
				<CarouselContent @contextmenu.prevent>
					<CarouselItem>
						<TransitionGroup ref="current-goals-container" name="auto" tag="ul" class="h-full select-none relative scroll-drag">
							<li
								v-for="goal in currentMonthGoals"
								:key="goal.id"
								@click="handleGoalPrimary($event, goal)"
								@contextmenu="handleGoalSecondary($event, goal)"
								class="flex items-center gap-4 p-2.5 hover:bg-hover/8 rounded-md transition-colors relative"
								:style="{
									'--color-hover': activitiesColorsMap.get(goal.activity),
								}"
							>
								<div class="relative size-10 flex items-center justify-center">
									<svg class="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
										<circle class="text-muted" stroke-width="3" stroke="currentColor" fill="none" r="16" cx="18" cy="18" />
										<circle
											class="text-hover transition-all duration-500 ease-in-out"
											stroke-width="3"
											stroke-dasharray="100"
											:stroke-dashoffset="CIRCUMFERENCE - CIRCUMFERENCE * (goal.points / goal.totalPoints)"
											stroke-linecap="round"
											stroke="currentColor"
											fill="none"
											r="16"
											cx="18"
											cy="18"
										/>
									</svg>
									<div class="size-6 rounded-full bg-gradient-to-br from-hover/50 to-hover flex items-center justify-center">
										<CheckCheckIcon
											class="text-white size-3.5 opacity-0 transition-opacity duration-300"
											:class="{
												'opacity-100': goal.status === GoalStatusEnum.COMPLETED,
											}"
										/>
									</div>
								</div>

								<div class="flex-1 flex gap-3 overflow-hidden justify-between items-start">
									<div class="min-w-0">
										<p class="text-sm font-semibold truncate">
											<span class="strikethrough" :class="{ 'has-strikethrough': goal.status === GoalStatusEnum.COMPLETED }">
												{{ goal.title }}
											</span>
										</p>
										<p class="text-xs text-muted-foreground truncate">
											<span class="strikethrough" :class="{ 'has-strikethrough': goal.status === GoalStatusEnum.COMPLETED }">
												{{ goal.description }}
											</span>
										</p>
									</div>
									<p class="whitespace-nowrap text-xs text-muted-foreground">
										<span class="text-hover"> {{ goal.points }} </span> / {{ goal.totalPoints }}
									</p>
								</div>
							</li>
						</TransitionGroup>
					</CarouselItem>
					<CarouselItem>
						<TransitionGroup ref="backlog-goals-container" name="auto" tag="ul" class="h-full select-none relative scroll-drag">
							<li
								v-for="goal in backlogGoals"
								:key="goal.id"
								@click="handleGoalPrimary($event, goal)"
								@contextmenu="handleGoalSecondary($event, goal)"
								class="flex items-center gap-4 p-2.5 hover:bg-hover/8 rounded-md transition-colors relative"
								:class="{
									'saturate-50 opacity-60': goal.status === GoalStatusEnum.DISABLED,
								}"
								:style="{
									'--color-hover': activitiesColorsMap.get(goal.activity),
								}"
							>
								<div class="relative size-10 flex items-center justify-center">
									<svg class="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
										<circle class="text-muted" stroke-width="3" stroke="currentColor" fill="none" r="16" cx="18" cy="18" />
										<circle
											class="text-hover transition-all duration-500 ease-in-out"
											stroke-width="3"
											stroke-dasharray="100"
											:stroke-dashoffset="CIRCUMFERENCE - CIRCUMFERENCE * (goal.points / goal.totalPoints)"
											stroke-linecap="round"
											stroke="currentColor"
											fill="none"
											r="16"
											cx="18"
											cy="18"
										/>
									</svg>
									<div class="size-6 rounded-full bg-gradient-to-br from-hover/50 to-hover flex items-center justify-center">
										<CheckCheckIcon
											class="text-white size-3.5 opacity-0 transition-opacity duration-300"
											:class="{
												'opacity-100': goal.status === GoalStatusEnum.COMPLETED,
											}"
										/>
									</div>
								</div>

								<div class="flex-1 min-w-0">
									<p class="text-sm font-semibold truncate">
										<span class="strikethrough" :class="{ 'has-strikethrough': goal.status === GoalStatusEnum.COMPLETED }">
											{{ goal.title }}
										</span>
									</p>
									<p class="text-xs text-muted-foreground truncate">
										<span class="strikethrough" :class="{ 'has-strikethrough': goal.status === GoalStatusEnum.COMPLETED }">
											{{ goal.description }}
										</span>
									</p>
								</div>
							</li>
						</TransitionGroup>
					</CarouselItem>
					<CarouselItem>
						<TransitionGroup ref="completed-goals-container" name="auto" tag="ul" class="h-full select-none relative scroll-drag">
							<li
								v-for="goal in completedGoals"
								:key="goal.id"
								@click="handleGoalPrimary($event, goal)"
								@contextmenu="handleGoalSecondary($event, goal)"
								class="flex items-center gap-4 p-2.5 hover:bg-hover/8 rounded-md transition-colors relative"
								:style="{
									'--color-hover': activitiesColorsMap.get(goal.activity),
								}"
							>
								<div class="relative size-10 flex items-center justify-center">
									<svg class="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
										<circle class="text-muted" stroke-width="3" stroke="currentColor" fill="none" r="16" cx="18" cy="18" />
										<circle
											class="text-hover transition-all duration-500 ease-in-out"
											stroke-width="3"
											stroke-dasharray="100"
											stroke-linecap="round"
											stroke="currentColor"
											fill="none"
											r="16"
											cx="18"
											cy="18"
										/>
									</svg>
									<div class="size-6 rounded-full bg-gradient-to-br from-hover/50 to-hover flex items-center justify-center">
										<CheckCheckIcon class="text-white size-3.5 opacity-100" />
									</div>
								</div>

								<div class="flex-1 flex gap-3 overflow-hidden justify-between items-start">
									<div class="min-w-0">
										<p class="text-sm font-semibold truncate">
											<span class="strikethrough has-strikethrough">
												{{ goal.title }}
											</span>
										</p>
										<p class="text-xs text-muted-foreground truncate">
											<span class="">
												{{ goal.description }}
											</span>
										</p>
									</div>
									<p class="whitespace-nowrap text-xs text-muted-foreground">
										<span class="text-hover"> {{ goal.points }} </span> / {{ goal.totalPoints }}
									</p>
								</div>
							</li>
						</TransitionGroup>
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
