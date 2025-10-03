import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { computed, inject, reactive } from "vue";
import { LoggingService } from "@/core/services/loggingService";
import { ISession } from "@/core/interfaces/entities/ISession";
import { useCurrentTime } from "@/store/useCurrentTime";
import { DateTime } from "luxon";

const sessions = reactive<ISession[]>([]);
let removeSessionCallback: (id: number) => void = () => {};

export default function useDaySessions() {
	const { currentTime } = useCurrentTime();
	const storageService = inject(StorageServiceKey)!;

	const currentSession = computed(() => sessions.find((s) => currentTime.value >= s.startTime && currentTime.value <= s.endTime));

	async function fetchSessions(day: DateTime) {
		LoggingService.log("fetching sessions...");
		sessions.length = 0;
		Object.assign(sessions, await storageService.getSessions(day));
	}

	async function createSession(session: ISession): Promise<number | undefined> {
		LoggingService.log("creating session...", session);
		session.id = await storageService.createSession(session);
		sessions.push(session);
		return session.id;
	}

	async function updateSession(id: number | undefined, session: ISession) {
		if (!id) return;
		LoggingService.log("updating session...", session);
		const oldSession = sessions.find((s) => s.id === id);
		if (oldSession) Object.assign(oldSession, session);
		await storageService.updateSession(id, session);
	}

	async function deleteSession(id: number | undefined) {
		if (!id) return;
        removeSessionCallback(id);
		const index = sessions.findIndex((s) => s.id === id);
		if (index > -1) sessions.splice(index, 1);
		LoggingService.log("deleting sessions...", id);
		await storageService.deleteSession(id);
	}

	function removeActivitySessions(activity: string) {
		for (let i = sessions.length - 1; i >= 0; i--) {
			if (sessions[i].activity === activity) {
				const sessionId = sessions[i].id;
                if (sessionId) removeSessionCallback(sessionId);
				sessions.splice(i, 1);
			}
		}
	}

	function switchSessionsActivity(oldActivity: string, newActivity: string) {
		sessions.forEach((s) => {
			if (s.activity === oldActivity) s.activity = newActivity;
		});
	}

    function onRemoveSession(callback: (id:number) => void) {
        removeSessionCallback = callback;
    }

	return {
		sessions,
		currentSession,
		fetchSessions,
		createSession,
		updateSession,
		deleteSession,
        onRemoveSession,
		removeActivitySessions,
		switchSessionsActivity,
	};
}
