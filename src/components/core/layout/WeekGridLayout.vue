<script setup lang="ts">
import useDayState from '@/store/useDayState';
import DayScheduleCard from '../cards/week/DayScheduleCard.vue';
import { computed } from 'vue';
import WeekSummaryCard from '../cards/week/WeekSummaryCard.vue';

const { selectedDay } = useDayState();
const startOfWeek = computed(() => selectedDay.value.setLocale('en-US').startOf('week', {useLocaleWeeks: true}));
</script>

<template>
	<div class="h-full flex gap-2 p-2">
		<div class="h-full flex-1 flex gap-2">
            <template v-for="i in 7" :key="i">
                <DayScheduleCard class="flex-1" :date="startOfWeek.plus({day: i-1})" />
            </template>
        </div>
        <div class="h-full w-1/6 flex flex-col gap-2">
            <!-- SUMMARY CARD 1 -->
             <WeekSummaryCard />
        </div>
	</div>
</template>
