import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { DateTime } from "luxon";
import { inject, ref, watch } from "vue";
import useDayState from "./useDayState";

const { selectedDay } = useDayState();

export default function useDayNotes() {
	const storageService = inject(StorageServiceKey)!;
	const notes = ref("");

	async function fetchNotes() {
		console.log("-- fetch notes");
		notes.value = await storageService.getNotes(selectedDay.value);
	}

	function updateNotes(notes: string) {
		storageService.updateNotes(selectedDay.value, notes);
	}

	watch(selectedDay, () => fetchNotes(), { immediate: true });

	return {
		notes,
		updateNotes,
	};
}
