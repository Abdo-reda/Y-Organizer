<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { ISession } from "@/core/interfaces/entities/ISession";
import useActivity from "@/store/useActivity";
import useMonthlyGoals from "@/store/useMonthlyGoals";
import useWeekTasks from "@/store/useWeekTasks";
import { ArrowUpIcon, ChartColumnBigIcon, CheckCheckIcon, CircleDotIcon, PartyPopperIcon } from "lucide-vue-next";
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
			if (t.goal) {
				if (prev[t.goal]) prev[t.goal] += t.points;
				else prev[t.goal] = t.points;
			}
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

	props.sessions.forEach((daySessions) => {
		daySessions.forEach((s) => {
			const endTimeHour = s.endTime.hour ? s.endTime.hour : 24;
			console.log("----", s.endTime.hour, s.startTime.hour);
			tracked += endTimeHour - s.startTime.hour;
		});
	});

	return {
		tracked,
	};
});

watch(
	() => props.startOfWeek,
	() => fetchTasks(props.startOfWeek, endOfWeek.value),
	{ immediate: true }
);
</script>

<template>
	<Card class="gap-0 !overflow-hidden py-4 w-full">
		<CardContent class="flex-1 px-4 pt-2 overflow-hidden flex flex-col gap-4" v-auto-animate>
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-2xl font-semibold">Summary</h2>
					<p class="text-sm text-muted-foreground">{{ `${startOfWeek.monthShort} ${startOfWeek.day} - ${endOfWeek.monthShort} ${endOfWeek.day}` }}</p>
				</div>
				<div class="flex rounded-full p-3 items-center justify-center bg-primary/10">
					<ChartColumnBigIcon class="text-primary size-6" />
				</div>
			</div>

			<div class="rounded-md bg-primary/10 p-3 flex items-center justify-center gap-2">
				<p class="text-center text-sm text-muted-foreground">You are <span class="font-semibold text-primary"> more amazing </span> than last week</p>
				<PartyPopperIcon class="size-3 inline text-primary" />
			</div>

			<div class="grid grid-cols-2 grid-rows-2 gap-4">
				<div class="rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 dark:from-blue-950/30 dark:to-blue-900/20">
					<div class="text-3xl flex font-bold text-blue-600 dark:text-blue-400">{{ sessionsData.tracked }}<ArrowUpIcon class="stroke-3" /></div>
					<div class="text-sm text-blue-900/70 dark:text-blue-100/70">hours tracked</div>
					<div class="mt-1 text-xs text-muted-foreground">of 168 total</div>
				</div>

				<div class="rounded-lg border bg-gradient-to-br from-green-50 to-green-100/50 p-4 dark:from-green-950/30 dark:to-green-900/20">
					<div class="text-3xl flex gap-0.5 font-bold text-green-600 dark:text-green-400">{{ tasks.length }} <CheckCheckIcon class="stroke-3" /></div>
					<div class="text-sm text-green-900/70 dark:text-green-100/70">tasks done</div>
					<div class="mt-1 text-xs text-muted-foreground">nice!</div>
				</div>

				<div class="rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 dark:from-purple-950/30 dark:to-purple-900/20">
					<div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ totalTasksPoints }}+</div>
					<div class="text-sm text-purple-900/70 dark:text-purple-100/70">points earned</div>
					<div class="mt-1 text-xs text-muted-foreground">across {{ tasksGoals.length }} goals</div>
				</div>

				<div class="rounded-lg border bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 dark:from-orange-950/30 dark:to-orange-900/20">
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
					class="rounded-lg border p-2 flex flex-col gap-2"
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
						<div class="h-full rounded-full bg-hover" :style="{width: `${ Math.round((goal.id ? tasksPoints[goal.id] : 0) * 100 / goal.totalPoints)}%`}"></div>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<h3 class="text-sm font-medium text-muted-foreground">Categories</h3>
				<div class="space-y-3">
					<div class="flex items-center gap-3">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
							<div class="h-3 w-3 rounded-full bg-blue-500"></div>
						</div>
						<div class="flex-1">
							<div class="flex items-baseline justify-between">
								<span class="text-sm font-medium">Work</span>
								<span class="text-sm font-semibold">18.5h</span>
							</div>
							<div class="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
								<div class="h-full rounded-full bg-blue-500" style="width: 43%"></div>
							</div>
						</div>
					</div>

					<div class="flex items-center gap-3">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
							<div class="h-3 w-3 rounded-full bg-green-500"></div>
						</div>
						<div class="flex-1">
							<div class="flex items-baseline justify-between">
								<span class="text-sm font-medium">Learning</span>
								<span class="text-sm font-semibold">12.0h</span>
							</div>
							<div class="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
								<div class="h-full rounded-full bg-green-500" style="width: 28%"></div>
							</div>
						</div>
					</div>

					<div class="flex items-center gap-3">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
							<div class="h-3 w-3 rounded-full bg-purple-500"></div>
						</div>
						<div class="flex-1">
							<div class="flex items-baseline justify-between">
								<span class="text-sm font-medium">Personal</span>
								<span class="text-sm font-semibold">8.5h</span>
							</div>
							<div class="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
								<div class="h-full rounded-full bg-purple-500" style="width: 20%"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<h3 class="text-sm font-medium text-muted-foreground">Activities</h3>
				<div class="space-y-2">
					<div class="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
						<div class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-cyan-500"></div>
							<span class="text-sm font-medium">Deep Work</span>
						</div>
						<span class="text-sm font-semibold text-muted-foreground">15.5h</span>
					</div>

					<div class="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
						<div class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-pink-500"></div>
							<span class="text-sm font-medium">Reading</span>
						</div>
						<span class="text-sm font-semibold text-muted-foreground">9.0h</span>
					</div>

					<div class="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2">
						<div class="flex items-center gap-2">
							<div class="h-2 w-2 rounded-full bg-amber-500"></div>
							<span class="text-sm font-medium">Exercise</span>
						</div>
						<span class="text-sm font-semibold text-muted-foreground">6.5h</span>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
</template>
