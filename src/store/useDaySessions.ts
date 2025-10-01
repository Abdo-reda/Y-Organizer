import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { computed, inject, reactive } from "vue";
import { LoggingService } from "@/core/services/loggingService";
import { ISession } from "@/core/interfaces/entities/ISession";
import { useCurrentTime } from "@/store/useCurrentTime";
import useActivity from "./useActivity";
import { DateTime } from "luxon";

const { currentTime } = useCurrentTime();
const sessions = reactive<ISession[]>([]);

export default function useDaySessions() {
	const storageService = inject(StorageServiceKey)!;
	const { activities } = useActivity();
    
	const currentSession = computed(() => sessions.find((s) => currentTime.value >= s.startTime && currentTime.value <= s.endTime));
	const currentActivity = computed(() => activities.find((a) => a.name === currentSession?.value?.activity));

	async function fetchSessions(day: DateTime) {
		LoggingService.log("fetching sessions...");
		Object.assign(sessions, await storageService.getSessions(day));
	}

	async function createSession(session: ISession) {
		LoggingService.log("creating session...", session)
		sessions.push(session);
		await storageService.createSession(session);
	}

	async function updateSession(id: number, session: ISession) {
		LoggingService.log("updating session...", session)
		await storageService.updateSession(id, session);
	}

	async function deleteSession(id: number) {
		const index = sessions.findIndex((s) => s.id === id);
		if (index > -1) sessions.splice(index, 1);
		LoggingService.log("deleting sessions...", id)
		await storageService.deleteSession(id);
	}

	return {
		sessions,
		currentSession,
		currentActivity,
        fetchSessions,
        createSession,
        updateSession,
        deleteSession
	};
}
