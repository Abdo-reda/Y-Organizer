import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { DateTime } from "luxon";
import { inject, ref } from "vue";

//---- Shared State
const selectedDay = ref(DateTime.now());

export default function useDayState() {
	const storageService = inject(StorageServiceKey)!;

	return {
		selectedDay,
	};
}
