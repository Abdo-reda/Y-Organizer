import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, ref, watch } from "vue";
import useDayState from "./useDayState";
import { LoggingService } from "@/core/services/loggingService";

export default function useDayNotes() {
	const { selectedDay } = useDayState();

	const storageService = inject(StorageServiceKey)!;
	const notes = ref("");
    let fetchCallback: (() => void) | undefined;

    function onNotesFetched(callback: () => void) {
        fetchCallback = callback;
    }

	async function fetchNotes() {
		LoggingService.log("fetching notes...");
		notes.value = await storageService.getNotes(selectedDay.value);
        fetchCallback?.();
	}

	function updateNotes(notes: string) {
		LoggingService.log("updating notes...");
		storageService.updateNotes(selectedDay.value, notes);
	}

	watch(selectedDay, () => fetchNotes(), { immediate: true });

	return {
		notes,
        onNotesFetched,
		updateNotes,
	};
}
