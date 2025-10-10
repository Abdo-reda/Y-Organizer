import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { DateTime } from "luxon";
import { inject, ref } from "vue";
import { LoggingService } from "@/core/services/loggingService";

const selectedDay = ref(DateTime.now());
export default function useDayState() {
	const storageService = inject(StorageServiceKey)!;

    function initDay(day: DateTime) {
        LoggingService.log("--- Init day")
        storageService.initDay(day)
    }

	return {
		selectedDay,
        initDay
	};
}
