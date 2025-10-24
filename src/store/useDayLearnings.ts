import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, ref, watch } from "vue";
import useDayState from "./useDayState";
import { LoggingService } from "@/core/services/loggingService";

export default function useDayLearnings() {
	const { selectedDay } = useDayState();
	const storageService = inject(StorageServiceKey)!;

	const learnings = ref("");

	async function fetchLearnings() {
		LoggingService.log("fetching learnings...");
		learnings.value = await storageService.getLearnings(selectedDay.value);
	}

    function updateLearnings(learnings: string) {
		LoggingService.log("updating learnings...");
		storageService.updateLearnings(selectedDay.value, learnings);
	}

	watch(selectedDay, () => fetchLearnings(), { immediate: true });

	return {
        learnings,
		fetchLearnings,
        updateLearnings,
	};
}
