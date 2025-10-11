<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import DayScheduleCard from "./DayScheduleCard.vue";
import { type DateTime } from "luxon";
import useSettings from "@/store/useSettings";
import { generateDefaultSession, ISession } from "@/core/interfaces/entities/ISession";
import SessionPreviewPopover from '@/components/popovers/SessionPreviewPopover.vue';
import { Popover, PopoverAnchor } from '@/components/ui/popover';
import { ref, shallowRef } from "vue";
import { type ReferenceElement } from "reka-ui";

interface IWeekScheduleCardProps {
	startOfWeek: DateTime;
	sessions: ISession[][];
}

const props = defineProps<IWeekScheduleCardProps>();

const { settings } = useSettings();
const previewSessionOpen = ref(false);
const previewSession = ref<ISession>(generateDefaultSession(props.startOfWeek, 0));
const sessionPopoverAnchor = shallowRef<ReferenceElement | undefined>();

function showPreview(target: ReferenceElement, session: ISession) {
    previewSession.value = session;
    sessionPopoverAnchor.value = target;
    previewSessionOpen.value = true;
}
</script>

<template>
	<Card class="gap-0 !overflow-hidden py-4 w-full relative">
		<CardContent class="flex-1 px-4 pt-2 overflow-hidden flex gap-1.5">
			<Popover v-model:open="previewSessionOpen">
				<PopoverAnchor :reference="sessionPopoverAnchor"> </PopoverAnchor>
				<SessionPreviewPopover :session="previewSession" />
			</Popover>
			<div class="h-full flex flex-col">
				<p class="opacity-0">-</p>
				<div class="flex-1 flex flex-col">
					<template v-for="(_i, index) in 24" :key="index">
						<div class="flex-1 relative flex flex-col items-center justify-between">
							<p class="text-xs text-muted-foreground font-semibold -translate-y-1/2">{{ settings.DATE_FORMAT === "HH:mm" ? index : index % 12 === 0 ? 12 : index % 12 }}:00</p>
							<div class="hidden border-t border-black/10 absolute w-[100cqi] left-8 z-10"></div>
						</div>
					</template>
					<p class="text-xs text-muted-foreground font-semibold absolute bottom-0 -translate-y-1/2">{{ settings.DATE_FORMAT === "HH:mm" ? 24 : 12 }}:00</p>
				</div>
			</div>
			<div class="flex-1 flex gap-2">
				<template v-for="i in 7" :key="i">
					<DayScheduleCard :sessions="sessions[i - 1]" :date="startOfWeek.plus({ day: i - 1 })" @preview="showPreview" />
				</template>
			</div>
		</CardContent>
	</Card>
</template>
