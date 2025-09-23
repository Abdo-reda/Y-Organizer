import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, ref, watch } from "vue";
import { LoggingService } from "@/core/services/loggingService";


export default function useActivity() {
	const storageService = inject(StorageServiceKey)!;
	// const remembers = reactive<IRemember[]>([]);

	// async function fetchRemembers() {
	// 	LoggingService.log("useRemember","fetching remembers...")
	// 	Object.assign(remembers, (await storageService.getRemembers()));
	// }

	// async function createRemember(rememberTitle: string) {
	// 	const remember: IRemember = {
	// 		title: rememberTitle,
	// 		highlights: [],
	// 	}
	// 	LoggingService.log("useRemember","creating remembers...", remember)
	// 	remember.id = await storageService.createRemember(remember);
	// 	remembers.push(remember);
	// }

	// async function updateRemember(remember: IRemember) {
	// 	LoggingService.log("useRemember","updating remembers...", remember)
	// 	await storageService.updateRemember(remember);
	// }

	// async function deleteRemember(id: number) {
	// 	const index = remembers.findIndex((g) => g.id === id);
	// 	if (index > -1) remembers.splice(index, 1);
	// 	LoggingService.log("useRemember","deleting remembers...", id)
	// 	await storageService.deleteRemember(id);
	// }

	// fetchRemembers();

	return {
		// remembers,
		// createRemember,
		// updateRemember,
		// deleteRemember
	};
}
