<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useActivity from "@/store/useActivity";
import useActivityStats from "@/store/useActivityStats";
import useDayLearnings from "@/store/useDayLearnings";
import useDaySessions from "@/store/useDaySessions";
import useDayState from "@/store/useDayState";
import useTasks from "@/store/useTasks";
import { CheckCheckIcon } from "lucide-vue-next";
import { computed } from "vue";

const CIRCUMFERENCE = 2 * Math.PI * 45;
const { selectedDay } = useDayState();
const { tasks } = useTasks();
const { activities } = useActivity();
const { sessions } = useDaySessions();
const { sessionActivities } = useActivityStats(activities, sessions);
const { learnings, updateLearnings } = useDayLearnings();

const completedTasks = computed(() => tasks.filter((t) => t.completedDay === selectedDay.value.toISODate()));
const points = computed(() => completedTasks.value.reduce((prev, t) => prev + t.points, 0));
const topActivites = computed(() => sessionActivities.value.slice(0, 3));
// const goals = computed(() => completedTasks.value.forEach())
function handleSaveLearnings() {
    updateLearnings(learnings.value);
}
</script>

<template>
	<div class="h-full overflow-hidden flex flex-col gap-2 p-0">
		<div class="flex gap-4 overflow-hidden">
			<div class="flex-1 flex flex-col justify-between py-4">
				<div class="p-2">
					<p class="text-2xl flex items-center gap-0.5 font-bold text-green-600 dark:text-green-400"><CheckCheckIcon class="stroke-[2.5]" /> {{ completedTasks.length }}</p>
					<p class="text-base text-muted-foreground">Tasks completed</p>
					<p class="text-xs text-green-700 dark:text-green-300">nice!</p>
				</div>
				<div class="border-t" />
				<div class="p-2">
					<p class="text-2xl font-bold text-purple-600 dark:text-purple-400">+{{ points }}</p>
					<p class="text-base text-muted-foreground">Points earned</p>
					<p class="text-xs text-purple-700 dark:text-purple-300">across {{ 3 }} goals</p>
				</div>
			</div>
			<div class="border-l" />
			<div class="flex-1 flex flex-col select-none overflow-hidden gap-1">
				<div class="flex items-center justify-center overflow-hidden">
					<svg viewBox="0 0 100 100" class="w-full h-full">
						<circle v-if="!sessionActivities.length" cx="50" cy="50" r="45" fill="none" class="stroke-muted-foreground/85" stroke-width="6" />
						<circle
							v-for="activity in sessionActivities"
							:key="activity.name"
							cx="50"
							cy="50"
							r="45"
							fill="none"
							:stroke="activity.color"
							stroke-width="6"
							stroke-linecap="round"
							:stroke-dasharray="`${(activity.ratio / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`"
							:stroke-dashoffset="-((CIRCUMFERENCE * activity.offset) / 100)"
							class="transition-all duration-500"
						/>
					</svg>
				</div>
				<div v-if="topActivites.length" class="grid grid-rows-3 gap-1 p-0.5">
					<div
						v-for="activity in topActivites"
						:key="activity.name"
						class="flex items-center justify-between p-1 px-2 group rounded-md hover:ring ring-hover duration-300 transition-shadow group"
						:style="{ '--color-hover': activity.color }"
					>
						<div class="flex items-center gap-3 min-w-0 flex-1">
							<div class="size-2 rounded-full" :style="{ backgroundColor: activity.color }"></div>
							<div class="min-w-0 flex-1 flex justify-between items-center gap-2 text-xs">
								<p class="truncate">{{ activity.name }}</p>
								<p class="flex items-center gap-1">
									<span class="transition-colors font-semibold duration-300 group-hover:text-hover"> {{ activity.duration/60 }}h </span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex-1 flex flex-col gap-1.5">
			<Label for="learnings"> Learnings </Label>
			<Textarea v-model="learnings" @focus-out="handleSaveLearnings" id="learnings" placeholder="learnings & reflections..." class="resize-none" :rows="4" />
		</div>
	</div>
</template>
