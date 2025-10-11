import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, reactive } from "vue";
import useDayState from "./useDayState";
import { IGratitude } from "@/core/interfaces/entities/IGratitude";
import { LoggingService } from "@/core/services/loggingService";

export default function useDayGratitudes() {
	const { selectedDay } = useDayState();

	const storageService = inject(StorageServiceKey)!;
	const gratitudes = reactive<IGratitude[]>([]);

	async function fetchGratitudes() {
		LoggingService.log("fetch gratitudes");
		const dayGratitudes = await storageService.getGratitudes(selectedDay.value);
		Object.assign(gratitudes, dayGratitudes);
	}

	async function createGratitude(gratitude: IGratitude) {
		LoggingService.log("create gratitudes", gratitude);
		gratitudes.push(gratitude);
		await storageService.createGratitude(gratitude);
	}

	async function updateGratitude(gratitude: IGratitude) {
		LoggingService.log("update gratitudes", gratitude);
		await storageService.updateGratitude(gratitude);
	}

	async function deleteGratitude(id: number) {
		LoggingService.log("delete gratitudes", id);
		const index = gratitudes.findIndex((g) => g.id === id);
		if (index > -1) gratitudes.splice(index, 1);
		await storageService.deleteGratitude(id);
	}

	// watch(selectedDay, () => fetchGratitudes(), { immediate: true });

	return {
		gratitudes,
        fetchGratitudes,
		createGratitude,
		updateGratitude,
		deleteGratitude,
	};
}
