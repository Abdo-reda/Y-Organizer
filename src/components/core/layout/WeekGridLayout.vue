<script setup lang="ts">
import useDayState from "@/store/useDayState";
import { computed } from "vue";
import WeekSummaryCard from "../cards/week/WeekSummaryCard.vue";
import WeekScheduleCard from "../cards/week/WeekScheduleCard.vue";

const { selectedDay } = useDayState();
const startOfWeek = computed(() => selectedDay.value.setLocale("en-US").startOf("week", { useLocaleWeeks: true }));
</script>

<template>
	<div class="h-full flex gap-4 p-2">
		<WeekScheduleCard :start-of-week="startOfWeek" class="flex-1" />
		<WeekSummaryCard :start-of-week="startOfWeek" class="w-1/4" />
	</div>
</template>
