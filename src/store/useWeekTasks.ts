import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, reactive } from "vue";
import { LoggingService } from "@/core/services/loggingService";
import { ITask } from "@/core/interfaces/entities/ITask";
import { type DateTime } from "luxon";

export default function useWeekTasks() {
	const storageService = inject(StorageServiceKey)!;
	const tasks = reactive<ITask[]>([]);

	async function fetchTasks(startDate: DateTime, endDate: DateTime) {
		LoggingService.log("fetching tasks...");
		tasks.length = 0;
		Object.assign(tasks, await storageService.getTasks(startDate, endDate));
	}

	return {
		tasks,
		fetchTasks,
	};
}
