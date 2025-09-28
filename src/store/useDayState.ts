// import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { DateTime } from "luxon";
import { ref } from "vue";

//---- Shared State
const selectedDay = ref(DateTime.now());

export default function useDayState() {
	// const storageService = inject(StorageServiceKey)!;

    //TODO: should we init a day if the selectedDay changes? should we init any day the selectedDay is on?

	return {
		selectedDay,
	};
}
