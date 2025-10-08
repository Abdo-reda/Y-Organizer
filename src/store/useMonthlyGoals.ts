import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, reactive } from "vue";
import { LoggingService } from "@/core/services/loggingService";
import { type DateTime } from "luxon";
import { IGoal } from "@/core/interfaces/entities/IGoal";

const monthlyGoals = reactive<IGoal[]>([]);

export default function useMonthlyGoals() {
	const storageService = inject(StorageServiceKey)!;

	async function fetchGoals(yearMonth: DateTime) {
		LoggingService.log("fetching monthly goals...");
        monthlyGoals.length = 0;
		Object.assign(monthlyGoals, (await storageService.getMonthlyGoals(yearMonth)));
	}

	async function createGoal(monthlyGoal: IGoal) {
		LoggingService.log("creating monthly goal...", monthlyGoal)
		monthlyGoal.id = await storageService.createGoal(monthlyGoal);
		monthlyGoals.push(monthlyGoal);
	}

	async function updateGoal(id: number|undefined, monthlyGoal: IGoal) {
        if (!id) return;
		LoggingService.log("updating monthly goal...", monthlyGoal)
        const oldMonthGoal = monthlyGoals.find((t) => t.id === id);
        if (!oldMonthGoal) return;
        Object.assign(oldMonthGoal, monthlyGoal)
		await storageService.updateGoal(id, monthlyGoal);
	}

	async function deleteGoal(id: number|undefined) {
        if (!id) return;
		const index = monthlyGoals.findIndex((t) => t.id === id);
		if (index > -1) monthlyGoals.splice(index, 1);
		LoggingService.log("deleting monthly goal...", id)
		await storageService.deleteGoal(id);
	}

	return {
		monthlyGoals,
        fetchGoals,
        createGoal,
        updateGoal,
        deleteGoal,
	};
}
