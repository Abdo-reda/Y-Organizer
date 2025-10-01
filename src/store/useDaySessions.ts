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

	// async function createActivity(activity: IActivity) {
	// 	LoggingService.log("creating activity...", activity)
	// 	activities.push(activity);
	// 	await storageService.createActivity(activity);
	// }

	// async function updateActivity(id: string, activity: IActivity) {
	// 	LoggingService.log("updating remembers...", activity)
	// 	await storageService.updateActivity(id, activity);
	// }

	// async function deleteActivity(id: string) {
	// 	const index = activities.findIndex((a) => a.name === id);
	// 	if (index > -1) activities.splice(index, 1);
	// 	LoggingService.log("deleting activity...", id)
	// 	await storageService.deleteActivity(id);
	// }

	return {
		sessions,
		currentSession,
		currentActivity,
        fetchSessions,
		// fetchActivities,
		// createActivity,
		// updateActivity,
		// deleteActivity,
	};
}
