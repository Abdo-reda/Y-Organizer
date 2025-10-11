import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, reactive } from "vue";
import { LoggingService } from "@/core/services/loggingService";
import { ISession } from "@/core/interfaces/entities/ISession";
import { DateTime } from "luxon";

export default function useWeekSessions() {
	const sessions = reactive<ISession[][]>([[], [], [], [], [], [], []]);
	const storageService = inject(StorageServiceKey)!;

	async function fetchSessions(day: DateTime) {
		LoggingService.log("fetching sessions...");
		initSessions();
		for (let i = 0; i < 7; i++) {
			Object.assign(sessions[i], await storageService.getSessions(day.plus({ day: i })));
		}
	}

	function initSessions() {
		for (let i = 0; i < 7; i++) {
			sessions[i].length = 0;
		}
	}

	return {
		sessions,
		fetchSessions,
	};
}
