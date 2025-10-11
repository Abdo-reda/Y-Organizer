<script setup lang="ts">
import { LifeCategoryIconMapper } from "@/core/enums/lifeCategoryEnum";
import { ISession } from "@/core/interfaces/entities/ISession";
import useActivity from "@/store/useActivity";
import { DateTime } from "luxon";
import { type ReferenceElement } from "reka-ui";

interface IDayScheduleProps {
	date: DateTime<true>;
    sessions: ISession[];
}

defineProps<IDayScheduleProps>();
const emits = defineEmits<{
    preview: [target: ReferenceElement, session: ISession];
}>();

const { activities } = useActivity();

function handleSessionPrimary(event: MouseEvent, session: ISession) {
    emits('preview', event.currentTarget as ReferenceElement, session);
}
</script>
<template>
	<div class="flex-1 h-full flex flex-col gap-1">
		<div class="flex gap-1 items-end">
			<p> <span class="font-semibold"> {{ date.weekdayLong }} </span>  <span class="text-xs mx-1"> {{ `${date.day}\`${date.monthShort}` }}  </span></p>
		</div>
		<div class="flex-1 overflow-hidden grid grid-rows-[repeat(24,1fr)] gap-1 relative select-none">
			<TransitionGroup name="auto">
				<template v-if="sessions.length">
					<template v-for="session in sessions" :key="session.id">
						<div
                            class="overflow-hidden"
							:style="{
								'--color-hover': activities.find((a) => a.name === session.activity)?.color ?? 'var(--primary)',
								gridRow: `${session.startTime.hour + 1} / ${session.endTime.hour === 0 ? 25 : session.endTime.hour + 1}`,
							}"
						>
							<div
								@click="handleSessionPrimary($event, session)"
								class="relative rounded-sm h-full flex-1 !overflow-hidden hover:inset-ring-3 inset-ring-black/25 transition-shadow bg-hover"
							>
								<div class="flex items-start justify-between gap-1">
									<p class="capitalize text-black font-extrabold text-xl px-1 opacity-30">{{ session.activity }}</p>
								</div>
								<div class="absolute opacity-15 left-0 -mx-2 flex">
									<component
										v-for="category in activities.find((a) => a.name === session.activity)?.categories ?? []"
										:is="LifeCategoryIconMapper[category]"
										class="size-8 text-black"
									/>
								</div>
							</div>
						</div>
					</template>
				</template>
				<template v-else>
					<p class="text-center my-2">- No Sessions -</p>
				</template>
			</TransitionGroup>
		</div>
	</div>
</template>
