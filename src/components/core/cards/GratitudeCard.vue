<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from "vue";
import FunctionCard from "@/components/common/FunctionCard.vue";
import useDayGratitudes from "@/store/useDayGratitudes";
import { Button } from "@/components/ui/button";
import { DotIcon, HeartIcon, PlusIcon } from "lucide-vue-next";
import useDayState from "@/store/useDayState";
import GratitudeDialog from "@/components/dialogs/GratitudeDialog.vue";
import { Dialog } from "@/components/ui/dialog";
import { IGratitude } from "@/core/interfaces/entities/IGratitude";
import { LifeCategoryColorMapper, LifeCategoryIconMapper } from "@/core/enums/lifeCategoryEnum";
import { useMouseScroll } from "@/composables/useMouseScroll";

const { selectedDay } = useDayState();
const { gratitudes, fetchGratitudes, createGratitude, updateGratitude, deleteGratitude } = useDayGratitudes();

const gratitudesContainer = useTemplateRef('gratitudes-container');
const gratitudesContainerEl = computed(() => gratitudesContainer.value?.$el)
useMouseScroll(gratitudesContainerEl);

const editGratitude = ref<IGratitude | null>(null);
const dialogOpen = ref(false);

async function toggleHighlight(gratitudeId: number | undefined, wordIndex: number) {
	const gratitude = gratitudes.find((g) => g.id === gratitudeId);
	if (!gratitude) return;
	const highlightIndex = gratitude.highlights.indexOf(wordIndex);
	if (highlightIndex === -1) gratitude.highlights.push(wordIndex);
	else gratitude.highlights.splice(highlightIndex, 1);
	await updateGratitude(gratitudeId, gratitude);
}

function handlePrimary(event: MouseEvent, gratitude: IGratitude) {
	if (event.ctrlKey && event.button === 0) openEditDialog(gratitude);
}

function handleSecondary(event: MouseEvent, gratitude: IGratitude) {
	if (event.altKey) deleteGratitude(gratitude.id);
}

function openEditDialog(gratitude: IGratitude | null = null) {
	editGratitude.value = gratitude;
	dialogOpen.value = true;
}

function handleCreate(gratitude: IGratitude) {
	createGratitude(gratitude);
	editGratitude.value = null;
	dialogOpen.value = false;
}

function handleUpdate(id: number, gratitude: IGratitude) {
	updateGratitude(id, gratitude);
	editGratitude.value = null;
	dialogOpen.value = false;
}

watch(selectedDay, (day) => fetchGratitudes(day), { immediate: true });

</script>

<template>
	<FunctionCard title="Gratitude">
		<template #default>
			<Dialog v-model:open="dialogOpen">
				<GratitudeDialog :existing-gratitude="editGratitude" @create="handleCreate" @update="handleUpdate" />
			</Dialog>
			<TransitionGroup ref="gratitudes-container" @contextmenu.prevent name="auto" tag="ul" class="flex-1 space-y-1 h-full m-1 relative overflow-auto scroll-hidden select-none">
				<li
					@click="handlePrimary($event, gratitude)"
					@contextmenu="handleSecondary($event, gratitude)"
					v-for="gratitude in gratitudes"
					:key="gratitude.id"
					class="flex items-start gap-3 p-2 rounded-md hover:bg-hover/5 transition-colors"
                    :style="{
                        '--color-hover': gratitude.category ? LifeCategoryColorMapper[gratitude.category] : 'var(--primary)'
                    }"
				>
                    <div class="relative my-2">
                        <component v-if="gratitude.category" :is="LifeCategoryIconMapper[gratitude.category]" class="size-4 text-hover" />
                        <DotIcon v-else class="size-4 text-hover" />
                        <HeartIcon class="size-3.5 fill-hover stroke-background stroke-3 absolute left-full -translate-x-1/2 bottom-full translate-y-1/2" />
                        <HeartIcon class="size-3.5 fill-hover stroke-hover stroke-3 absolute left-full -translate-x-1/2 bottom-full translate-y-1/2 animate-ping ping opacity-50" />
                    </div>
					<div class="flex-1">
						<p class="leading-relaxed">
							<template v-for="(word, index) in gratitude.title.trim().split(/\s+/)" :key="index">
								<span
									@click="toggleHighlight(gratitude.id, index)"
									class="transition-all duration-200 gratitude-word"
                                    :class="{
                                        'font-semibold text-hover': gratitude.highlights.some((h) => h === index)
                                    }"
								>
									{{ word }}
								</span>
								<span> {{ index < gratitude.title.length - 1 ? " " : "" }} </span>
							</template>
						</p>
					</div>
				</li>
			</TransitionGroup>
		</template>
		<template #header-right-actions>
			<div class="flex items-center justify-end">
				<Button @click="openEditDialog()" variant="ghost" size="icon">
					<PlusIcon />
				</Button>
			</div>
		</template>
	</FunctionCard>
</template>

<style lang="css" scoped>
.gratitude-word:hover {
	background-color: color-mix(in srgb, var(--color-hover) 15%, transparent);
	border-radius: 2px;
	padding: 0px 2px;
}

.ping {
	--animate-ping: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
