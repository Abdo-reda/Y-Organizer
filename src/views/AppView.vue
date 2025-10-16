<script setup lang="ts">
import AppHeader from "@/components/core/layout/AppHeader.vue";
import useActivity from "@/store/useActivity";
import { useCurrentTime } from "@/store/useCurrentTime";
import useDayState from "@/store/useDayState";
import useMonthlyGoals from "@/store/useMonthlyGoals";
import useSettings from "@/store/useSettings";
import useTasks from "@/store/useTasks";
import { watch } from "vue";
import DayView from "./DayView.vue";
import WeekView from "./WeekView.vue";
import WelcomeView from "./WelcomeView.vue";
import NowView from "./NowView.vue";

const { currentTime } = useCurrentTime();
const { selectedDay, initDay } = useDayState();
const { appView, fetchSettings } = useSettings();
const { fetchActivities } = useActivity();
const { fetchTasks } = useTasks();
const { fetchGoals } = useMonthlyGoals();

await fetchSettings();
await fetchActivities();

watch(currentTime, (time, oldTime) => {
	if (!time.hasSame(oldTime, "day")) selectedDay.value = time.startOf("day");
});

watch(
	selectedDay,
	(day) => {
		initDay(day);
		fetchTasks(day);
		fetchGoals();
	},
	{ immediate: true }
);
</script>

<template>
	<div class="h-full flex flex-col overflow-hidden">
		<AppHeader v-if="appView !== 'welcome' && appView !== 'now'" />
		<main class="flex-1 px-2 pb-2 overflow-hidden relative" v-auto-animate="{ duration: 100 }">
            <WelcomeView v-if="appView === 'welcome'" />
            <DayView v-else-if="appView === 'day'" key="day" />
            <WeekView v-else-if="appView === 'week'" key="week" />
            <NowView v-else-if="appView === 'now'" key="now" />
		</main>
	</div>
</template>
