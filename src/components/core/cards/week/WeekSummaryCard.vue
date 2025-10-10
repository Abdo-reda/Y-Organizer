<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { ChartColumnBigIcon } from "lucide-vue-next";
import { type DateTime } from "luxon";
import { computed } from "vue";

interface IWeekSummaryCardProps {
    startOfWeek: DateTime;
}

const endOfWeek = computed(() => props.startOfWeek.plus({day: 6}));

const props = defineProps<IWeekSummaryCardProps>();

</script>

<template>
	<Card class="gap-0 !overflow-hidden py-4 w-full">
		<CardContent class="flex-1 px-4 pt-2 overflow-hidden flex flex-col gap-4">
			<div class="flex items-center justify-between">
				<div>
					<h2 class="text-2xl font-semibold">Summary</h2>
					<p class="text-sm text-muted-foreground">{{ `${startOfWeek.monthShort} ${startOfWeek.day} - ${endOfWeek.monthShort} ${endOfWeek.day}` }}</p>
				</div>
                <div class="flex rounded-full p-3 items-center justify-center bg-primary/10">
                    <ChartColumnBigIcon class="text-primary size-6" />
                </div>
			</div>
            
			<div class="rounded-md bg-primary/10 p-3 text-center">
				<p class="text-sm text-muted-foreground">You're <span class="font-semibold text-primary"> more amazing </span> than last week! </p>
			</div>

			<div class="grid grid-cols-2 grid-rows-2 gap-4">
				<div class="rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 dark:from-blue-950/30 dark:to-blue-900/20">
					<div class="text-3xl font-bold text-blue-600 dark:text-blue-400">42.5</div>
					<div class="text-sm text-blue-900/70 dark:text-blue-100/70">hours tracked</div>
					<div class="mt-1 text-xs text-muted-foreground">of 168 total</div>
				</div>

				<div class="rounded-lg border bg-gradient-to-br from-green-50 to-green-100/50 p-4 dark:from-green-950/30 dark:to-green-900/20">
					<div class="text-3xl font-bold text-green-600 dark:text-green-400">23</div>
					<div class="text-sm text-green-900/70 dark:text-green-100/70">tasks done</div>
					<div class="mt-1 text-xs text-muted-foreground">+5 from last week</div>
				</div>

				<div class="rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 dark:from-purple-950/30 dark:to-purple-900/20">
					<div class="text-3xl font-bold text-purple-600 dark:text-purple-400">340</div>
					<div class="text-sm text-purple-900/70 dark:text-purple-100/70">points earned</div>
					<div class="mt-1 text-xs text-muted-foreground">across 3 goals</div>
				</div>

				<div class="rounded-lg border bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 dark:from-orange-950/30 dark:to-orange-900/20">
					<div class="text-3xl font-bold text-orange-600 dark:text-orange-400">67%</div>
					<div class="text-sm text-orange-900/70 dark:text-orange-100/70">goal progress</div>
					<div class="mt-1 text-xs text-muted-foreground">on track</div>
				</div>
			</div>

			<div class="">
				<h3 class="mb-3 text-sm font-medium text-muted-foreground">Top Categories</h3>
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

			<div>
				<h3 class="mb-3 text-sm font-medium text-muted-foreground">Top Activities</h3>
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
