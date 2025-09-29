import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { DateTime } from "luxon";
import { inject, ref, watch } from "vue";

//---- Shared State
const selectedDay = ref(DateTime.now());

export default function useDayState() {
	const storageService = inject(StorageServiceKey)!;

	watch(selectedDay, async (day) => await storageService.initDay(day));

    //TODO: should we init a day if the selectedDay changes? should we init any day the selectedDay is on?

	return {
		selectedDay,
	};
}
