import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, reactive } from "vue";
import { IGratitude } from "@/core/interfaces/entities/IGratitude";
import { LoggingService } from "@/core/services/loggingService";
import { type DateTime } from "luxon";

export default function useDayGratitudes() {

	const storageService = inject(StorageServiceKey)!;
	const gratitudes = reactive<IGratitude[]>([]);

	async function fetchGratitudes(day: DateTime) {
		LoggingService.log("fetch gratitudes");
        gratitudes.length = 0;
		Object.assign(gratitudes, await storageService.getGratitudes(day));
	}

	async function createGratitude(gratitude: IGratitude) {
		LoggingService.log("create gratitudes", gratitude);
		gratitude.id = await storageService.createGratitude(gratitude);
		gratitudes.push(gratitude);
	}

	async function updateGratitude(id: number|undefined, gratitude: IGratitude) {
        if (!id) return;
		LoggingService.log("update gratitudes", gratitude);
        const oldGratitude = gratitudes.find((g) => g.id === id);
        if (!oldGratitude) return;
        Object.assign(oldGratitude, gratitude);
		await storageService.updateGratitude(id, gratitude);
	}

	async function deleteGratitude(id: number|undefined) {
        if (!id) return;
		LoggingService.log("delete gratitudes", id);
		const index = gratitudes.findIndex((g) => g.id === id);
		if (index > -1) gratitudes.splice(index, 1);
		await storageService.deleteGratitude(id);
	}


	return {
		gratitudes,
        fetchGratitudes,
		createGratitude,
		updateGratitude,
		deleteGratitude,
	};
}
