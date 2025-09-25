import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, ref, watch } from "vue";
import useDayState from "./useDayState";
import { LoggingService } from "@/core/services/loggingService";

const { selectedDay } = useDayState();

export default function useDayNotes() {
	const storageService = inject(StorageServiceKey)!;
	const notes = ref("");

	async function fetchNotes() {
        LoggingService.log("fetching notes...");
		notes.value = await storageService.getNotes(selectedDay.value);
	}

	function updateNotes(notes: string) {
        LoggingService.log("updating notes...");
		storageService.updateNotes(selectedDay.value, notes);
	}

	watch(selectedDay, () => fetchNotes(), { immediate: true });

	return {
		notes,
		updateNotes,
	};
}
