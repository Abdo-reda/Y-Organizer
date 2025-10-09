import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, reactive } from "vue";
import { LoggingService } from "@/core/services/loggingService";
import { ITask } from "@/core/interfaces/entities/ITask";
import { DateTime } from "luxon";
import { TaskStatusEnum } from "@/core/enums/taskStatusEnum";
import useMonthlyGoals from "./useMonthlyGoals";

const tasks = reactive<ITask[]>([]);

export default function useTasks() {
	const storageService = inject(StorageServiceKey)!;
    const {monthlyGoals, updateGoalPoints} = useMonthlyGoals();

	async function fetchTasks(day: DateTime) {
		LoggingService.log("fetching tasks...");
		tasks.length = 0;
		Object.assign(tasks, await storageService.getTasks(day));
	}

	async function createTask(task: ITask) {
		LoggingService.log("creating task...", task);
		task.id = await storageService.createTask(task);
		tasks.push(task);
	}

	async function updateTask(id: number | undefined, task: ITask) {
		if (!id) return;
		LoggingService.log("updating task...", task);
		const oldTask = tasks.find((t) => t.id === id);
		if (!oldTask) return;
		Object.assign(oldTask, task);
		await storageService.updateTask(id, task);
	}

	async function completeTask(task: ITask) {
		task.status = TaskStatusEnum.COMPLETED;
		task.completedDay = DateTime.now().toISODate();
		await updateTask(task.id, task);
        const taskGoal = monthlyGoals.find(g => g.id === task.goal);
        if (taskGoal) await updateGoalPoints(taskGoal, task.points);
	}

	async function deleteTask(id: number | undefined) {
		if (!id) return;
		const index = tasks.findIndex((t) => t.id === id);
		if (index > -1) tasks.splice(index, 1);
		LoggingService.log("deleting task...", id);
		await storageService.deleteTask(id);
	}

	return {
		tasks,
		fetchTasks,
		createTask,
		updateTask,
		deleteTask,
        completeTask,
	};
}
