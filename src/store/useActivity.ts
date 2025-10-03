import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, reactive } from "vue";
import { LoggingService } from "@/core/services/loggingService";
import { IActivity } from "@/core/interfaces/entities/IActivity";
import useDaySessions from "./useDaySessions";

const activities = reactive<IActivity[]>([]);

export default function useActivity() {
	const storageService = inject(StorageServiceKey)!;

    const {removeActivitySessions, switchSessionsActivity} = useDaySessions();

	async function fetchActivities() {
		LoggingService.log("fetching activities...")
		Object.assign(activities, (await storageService.getActivities()));
	}

	async function createActivity(activity: IActivity) {
		LoggingService.log("creating activity...", activity)
		activities.push(activity);
		await storageService.createActivity(activity);
	}

	async function updateActivity(id: string, activity: IActivity) {
		LoggingService.log("updating activity...", activity)
        const oldActivity = activities.find((a) => a.name === id);
        if (!oldActivity) return;
        Object.assign(oldActivity, activity)
		await storageService.updateActivity(id, activity);
        if (id !== activity.name) switchSessionsActivity(id, activity.name);
	}

	async function deleteActivity(id: string) {
		const index = activities.findIndex((a) => a.name === id);
		if (index > -1) activities.splice(index, 1);
		LoggingService.log("deleting activity...", id)
		await storageService.deleteActivity(id);
        removeActivitySessions(id);
	}

	return {
		activities,
		fetchActivities,
		createActivity,
		updateActivity,
		deleteActivity
	};
}
