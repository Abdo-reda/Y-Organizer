<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import DayScheduleCard from "./DayScheduleCard.vue";
import { type DateTime } from "luxon";
import useSettings from "@/store/useSettings";

interface IWeekScheduleCardProps {
	startOfWeek: DateTime;
}

defineProps<IWeekScheduleCardProps>();

const { settings } = useSettings();
</script>

<template>
	<Card class="gap-0 !overflow-hidden py-4 w-full relative">
		<CardContent class="flex-1 px-4 pt-2 overflow-hidden flex gap-1.5">
            <div class="h-full flex flex-col">
                <p class="opacity-0"> - </p>
                <div class="flex-1 flex flex-col">
                    <template v-for="(_i, index) in 24" :key="index">
                        <div class="flex-1 relative flex flex-col items-center justify-between">
                            <p class="text-xs text-muted-foreground font-semibold -translate-y-1/2">{{ settings.DATE_FORMAT === "HH:mm" ? index : index % 12 === 0 ? 12 : index % 12 }}:00</p>
                            <div class="hidden border-t border-black/10 absolute w-[100cqi] left-8 z-10"> </div> 
                        </div>
                    </template>
                    <p class="text-xs text-muted-foreground font-semibold absolute bottom-0 -translate-y-1/2">{{ settings.DATE_FORMAT === "HH:mm" ? 24 : 12 }}:00</p>
                </div>
            </div>
			<div class="flex-1 flex gap-2">
				<template v-for="i in 7" :key="i">
					<DayScheduleCard :date="startOfWeek.plus({ day: i - 1 })" />
				</template>
			</div>
		</CardContent>
	</Card>
</template>
