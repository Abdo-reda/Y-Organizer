import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, ref, watch } from "vue";
import useDayState from "./useDayState";
import { LoggingService } from "@/core/services/loggingService";

export default function useDayDoodle() {
	const { selectedDay } = useDayState();

	const storageService = inject(StorageServiceKey)!;
	const doodle = ref("");
	const doodleLoading = ref(false);
    let fetchCallback: (() => void) | undefined;

    function onDoodleFetched(callback: () => void) {
        fetchCallback = callback;
    }

	async function fetchDoodle() {
		doodleLoading.value = true;
		LoggingService.log("fetching doodle...");
		doodle.value = await storageService.getDoodle(selectedDay.value);
        fetchCallback?.();
		doodleLoading.value = false;
	}

	function updateDoodle(doodle: string) {
		LoggingService.log("updating doodle...");
		storageService.updateDoodle(selectedDay.value, doodle);
	}

	watch(selectedDay, () => fetchDoodle(), { immediate: true });

	return {
		doodle,
		doodleLoading,
        onDoodleFetched,
		updateDoodle,
	};
}
