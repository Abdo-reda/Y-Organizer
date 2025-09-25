import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { IRemember } from "@/core/interfaces/entities/IRemember";
import { LoggingService } from "@/core/services/loggingService";
import { inject, reactive } from "vue";


export default function useRemember() {
	const storageService = inject(StorageServiceKey)!;
	const remembers = reactive<IRemember[]>([]);

	async function fetchRemembers() {
		LoggingService.log("fetching remembers...")
		Object.assign(remembers, (await storageService.getRemembers()));
	}

	async function createRemember(rememberTitle: string) {
		const remember: IRemember = {
			title: rememberTitle,
			highlights: [],
		}
		LoggingService.log("creating remembers...", remember)
		remember.id = await storageService.createRemember(remember);
		remembers.push(remember);
	}

	async function updateRemember(remember: IRemember) {
		LoggingService.log("updating remembers...", remember)
		await storageService.updateRemember(remember);
	}

	async function deleteRemember(id: number) {
		const index = remembers.findIndex((g) => g.id === id);
		if (index > -1) remembers.splice(index, 1);
		LoggingService.log("deleting remembers...", id)
		await storageService.deleteRemember(id);
	}

	fetchRemembers();

	return {
		remembers,
		createRemember,
		updateRemember,
		deleteRemember
	};
}
