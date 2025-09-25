import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, reactive, ref, watch } from "vue";
import { LoggingService } from "@/core/services/loggingService";
import { IActivity } from "@/core/interfaces/entities/IActivity";


export default function useActivity() {
	const storageService = inject(StorageServiceKey)!;
	const activities = reactive<IActivity[]>([]);

	async function fetchActivities() {
		LoggingService.log("fetching activities...")
		Object.assign(activities, (await storageService.getActivities()));
	}

	async function createActivity(activity: IActivity) {
		LoggingService.log("creating activity...", activity)
		activities.push(activity);
		await storageService.createActivity(activity);
	}

	async function updateActivity(activity: IActivity) {
		LoggingService.log("updating remembers...", activity)
		await storageService.updateActivity(activity);
	}

	async function deleteActivity(id: string) {
		// const index = remembers.findIndex((g) => g.id === id);
		// if (index > -1) remembers.splice(index, 1);
		// LoggingService.log("useRemember","deleting remembers...", id)
		// await storageService.deleteRemember(id);
	}

	fetchActivities();

	return {
		activities,
		createActivity,
		updateActivity,
		deleteActivity
	};
}
