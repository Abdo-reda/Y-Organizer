<script setup lang="ts">
import WeekScheduleCard from "@/components/core/cards/week/WeekScheduleCard.vue";
import WeekSummaryCard from "@/components/core/cards/week/WeekSummaryCard.vue";
import useDayState from "@/store/useDayState";
import useWeekSessions from "@/store/useWeekSessions";
import useWeekTasks from "@/store/useWeekTasks";
import { computed, watch } from "vue";

const { selectedDay } = useDayState();
const { sessions, fetchSessions } = useWeekSessions();
const { tasks, fetchTasks } = useWeekTasks();
const startOfWeek = computed(() => selectedDay.value.setLocale("en-US").startOf("week", { useLocaleWeeks: true }));

watch(startOfWeek, (date) => {
    fetchSessions(date);
    fetchTasks(date, date.plus({day: 6}));
}, {immediate: true});
</script>

<template>
	<div class="h-full flex gap-4 p-2">
		<WeekScheduleCard :start-of-week="startOfWeek" :sessions="sessions" :tasks="tasks" class="flex-1" />
		<WeekSummaryCard :start-of-week="startOfWeek" :sessions="sessions" :tasks="tasks" class="w-1/4" />
	</div>
</template>
