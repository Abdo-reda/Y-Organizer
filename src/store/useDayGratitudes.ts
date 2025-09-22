import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, reactive, watch } from "vue";
import useDayState from "./useDayState";
import { IGratitude } from "@/core/interfaces/entities/IGratitude";
import { LoggingService } from "@/core/services/loggingService";

const { selectedDay } = useDayState();

export default function useDayGratitudes() {
	const storageService = inject(StorageServiceKey)!;
	const gratitudes = reactive<IGratitude[]>([]);

	async function fetchGratitudes() {
		LoggingService.log("useDayGratitudes", "fetch gratitudes");
        const dayGratitudes = await storageService.getGratitudes(selectedDay.value);
        Object.assign(gratitudes, dayGratitudes);
	}

	async function createGratitude(gratitude: IGratitude) {
		LoggingService.log("useDayGratitudes", "create gratitudes", gratitude);
		gratitudes.push(gratitude);
		await storageService.createGratitude(gratitude);
	}

	async function updateGratitude(gratitude: IGratitude) {
		LoggingService.log("useDayGratitudes", "update gratitudes", gratitude);
		await storageService.updateGratitude(gratitude);
	}

	async function deleteGratitude(id: number) {
		LoggingService.log("useDayGratitudes", "delete gratitudes", id);
		const index = gratitudes.findIndex((g) => g.id === id);
		if (index > -1) gratitudes.splice(index, 1);
		await storageService.deleteGratitude(id);
	}

	watch(selectedDay, () => fetchGratitudes(), { immediate: true });

	return {
		gratitudes,
		createGratitude,
		updateGratitude,
		deleteGratitude,
	};
}
