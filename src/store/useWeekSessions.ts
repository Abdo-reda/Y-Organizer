import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, reactive } from "vue";
import { LoggingService } from "@/core/services/loggingService";
import { ISession } from "@/core/interfaces/entities/ISession";
import { DateTime } from "luxon";

export default function useWeekSessions() {
    const sessions = reactive<ISession[]>([]);
	const storageService = inject(StorageServiceKey)!;

	async function fetchSessions(day: DateTime) {
		LoggingService.log("fetching sessions...");
		sessions.length = 0;
		Object.assign(sessions, await storageService.getSessions(day));
	}

	return {
		sessions,
		fetchSessions,
	};
}
