<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { LifeCategoryColorMapper, LifeCategoryEnum, LifeCategoryIconMapper } from "@/core/enums/lifeCategoryEnum";
import { ISession } from "@/core/interfaces/entities/ISession";
import useActivity from "@/store/useActivity";
import useMonthlyGoals from "@/store/useMonthlyGoals";
import useWeekTasks from "@/store/useWeekTasks";
import { ArrowUpIcon, CheckCheckIcon, CircleDotIcon, PartyPopperIcon } from "lucide-vue-next";
import { type DateTime } from "luxon";
import { computed, watch } from "vue";

interface IWeekSummaryCardProps {
	startOfWeek: DateTime;
	sessions: ISession[][];
}

const props = defineProps<IWeekSummaryCardProps>();

const { activities } = useActivity();
const { tasks, fetchTasks } = useWeekTasks();
const { monthlyGoals } = useMonthlyGoals();

const endOfWeek = computed(() => props.startOfWeek.plus({ day: 6 }));
const tasksPoints = computed(() =>
	tasks
		.filter((t) => t.goal)
		.reduce<Record<number, number>>((prev, t) => {
			if (t.goal) prev[t.goal] = (prev[t.goal] ?? 0) + t.points;
			return prev;
		}, {})
);
const totalTasksPoints = computed(() => Object.values(tasksPoints.value).reduce((prev, p) => prev + p, 0));
const tasksGoals = computed(() => {
	const taskGoalIds = tasks.map((t) => t.goal);
	return monthlyGoals.filter((g) => g.id && taskGoalIds.includes(g.id));
});
const goalsPoints = computed(() => tasksGoals.value.reduce((prev, g) => prev + g.totalPoints, 0));
const goalProgress = computed(() => (goalsPoints.value ? Math.round((totalTasksPoints.value * 100) / goalsPoints.value) : 0));

const sessionsData = computed(() => {
	let tracked = 0;
	let activitiesTime: Record<string, number> = {};
	props.sessions.forEach((daySessions) => {
		daySessions.forEach((s) => {
			const endTimeHour = s.endTime.hour ? s.endTime.hour : 24;
			const trackedTime = endTimeHour - s.startTime.hour;
			activitiesTime[s.activity] = (activitiesTime[s.activity] ?? 0) + trackedTime;
			tracked += trackedTime;
		});
	});

	return {
		tracked,
		activitiesTime,
	};
});

const topCategories = computed(() => {
	let categoriesTime: Record<string, number> = {};
	Object.entries(sessionsData.value.activitiesTime).forEach(([name, time]) => {
		const activity = activities.find((a) => a.name === name);
		activity?.categories.forEach((c) => {
			categoriesTime[c] = (categoriesTime[c] ?? 0) + time;
		});
	});
	return Object.entries(categoriesTime)
		.sort((aKP, bKP) => bKP[1] - aKP[1])
		.slice(0, 3);
});

const totalCategories = computed(() => topCategories.value.reduce((prev, cKP) => prev + cKP[1], 0));

const topActivites = computed(() =>
	Object.entries(sessionsData.value.activitiesTime)
		.sort((aKP, bKP) => bKP[1] - aKP[1])
		.slice(0, 3)
);

watch(
	() => props.startOfWeek,
	() => fetchTasks(props.startOfWeek, endOfWeek.value),
	{ immediate: true }
);
</script>

<template>
	<Card class="gap-0 !overflow-hidden py-4 w-full">
		<CardContent class="flex-1 px-4 pt-2 overflow-hidden flex flex-col gap-4">
			<div class="flex items-center justify-between">
                <h2 class="text-2xl font-semibold">Summary <span class="text-sm text-muted-foreground">{{ `${startOfWeek.monthShort} ${startOfWeek.day} - ${endOfWeek.monthShort} ${endOfWeek.day}` }}</span> </h2>
			</div>

			<div class="rounded-md bg-primary/10 p-3 flex items-center justify-center gap-2">
				<p class="text-center text-sm text-muted-foreground">You are <span class="font-semibold text-primary"> more amazing </span> than last week</p>
				<PartyPopperIcon class="size-3 inline text-primary" />
			</div>

			<div class="grid grid-cols-2 grid-rows-2 gap-2">
				<div class="rounded-lg border hover:ring ring-blue-600 dark:ring-blue-400 duration-300 transition-shadow bg-gradient-to-br from-foreground/5 to-foreground/10 p-4">
					<div class="text-3xl flex font-bold text-blue-600 dark:text-blue-400">{{ sessionsData.tracked }}<ArrowUpIcon class="stroke-3" /></div>
					<div class="text-sm text-blue-900/70 dark:text-blue-100/70">hours tracked</div>
					<div class="mt-1 text-xs text-muted-foreground">of 168 total</div>
				</div>

				<div class="rounded-lg border hover:ring ring-green-600 dark:ring-green-400 duration-300 bg-gradient-to-br from-foreground/5 to-foreground/10 p-4">
					<div class="text-3xl flex gap-0.5 font-bold text-green-600 dark:text-green-400">{{ tasks.length }} <CheckCheckIcon class="stroke-3" /></div>
					<div class="text-sm text-green-900/70 dark:text-green-100/70">tasks done</div>
					<div class="mt-1 text-xs text-muted-foreground">nice!</div>
				</div>

				<div class="rounded-lg border hover:ring ring-purple-600 dark:ring-purple-400 duration-300 bg-gradient-to-br from-foreground/5 to-foreground/10 p-4">
					<div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ totalTasksPoints }}+</div>
					<div class="text-sm text-purple-900/70 dark:text-purple-100/70">points earned</div>
					<div class="mt-1 text-xs text-muted-foreground">across {{ tasksGoals.length }} goals</div>
				</div>

				<div class="rounded-lg border hover:ring ring-orange-600 dark:ring-orange-400 duration-300 bg-gradient-to-br from-foreground/5 to-foreground/10 p-4">
					<div class="text-3xl font-bold text-orange-600 dark:text-orange-400">{{ goalProgress }}%</div>
					<div class="text-sm text-orange-900/70 dark:text-orange-100/70">goal progress</div>
					<div class="mt-1 text-xs text-muted-foreground">on track</div>
				</div>
			</div>

			<div v-if="tasksGoals.length" class="flex flex-col gap-2">
				<h3 class="text-sm font-medium text-muted-foreground">Goals</h3>
				<div
					v-for="goal in tasksGoals"
					:key="goal.id"
					class="rounded-lg border p-2 flex flex-col gap-2 transition-shadows hover:ring ring-hover duration-300"
					:style="{
						'--color-hover': activities.find((a) => a.name === goal.activity)?.color,
					}"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<div class="flex items-center gap-1.5">
								<CircleDotIcon class="size-4 text-hover stroke-3" />
								<span class="text-sm font-medium">{{ goal.title }}</span>
							</div>
						</div>
						<p class="text-xs text-muted-foreground">
							<span class="font-bold text-hover"> {{ goal.id ? tasksPoints[goal.id] : 0 }} </span> of {{ goal.totalPoints }} pts
						</p>
					</div>
					<div class="h-2 overflow-hidden rounded-full bg-muted">
						<div class="h-full rounded-full bg-hover" :style="{ width: `${Math.round(((goal.id ? tasksPoints[goal.id] : 0) * 100) / goal.totalPoints)}%` }"></div>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<h3 class="text-sm font-medium text-muted-foreground">Activities</h3>
				<div
					v-for="activity in topActivites"
					:key="activity[0]"
					class="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2 transition-shadows hover:ring ring-hover duration-300"
					:style="{
						'--color-hover': activities.find((a) => a.name === activity[0])?.color,
					}"
				>
					<div class="flex items-center gap-2">
						<div class="h-2 w-2 rounded-full bg-hover"></div>
						<span class="text-sm font-medium">{{ activity[0] }}</span>
					</div>
					<span class="text-sm font-semibold text-muted-foreground">{{ activity[1] }}h</span>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<h3 class="text-sm font-medium text-muted-foreground">Categories</h3>
				<div
					v-for="category in topCategories"
					:key="category[0]"
					class="flex items-center gap-3 hover:bg-hover/5 transition-colors rounded-lg p-2"
					:style="{
						'--color-hover': LifeCategoryColorMapper[(category[0] as LifeCategoryEnum)],
					}"
				>
					<div class="flex size-8 items-center justify-center rounded-full bg-hover/10">
						<component :is="LifeCategoryIconMapper[(category[0] as LifeCategoryEnum)]" class="size-4 text-hover" />
					</div>
					<div class="flex-1">
						<div class="flex items-baseline justify-between">
							<span class="text-sm font-medium">{{ category[0] }}</span>
							<span class="text-sm font-semibold"> {{ category[1] }}h</span>
						</div>
						<div class="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
							<div class="h-full rounded-full bg-hover" :style="{ width: `${Math.round((category[1] * 100) / totalCategories)}%` }"></div>
						</div>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
</template>
