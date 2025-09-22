import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { IRemember } from "@/core/interfaces/entities/IRemember";
import { inject, reactive } from "vue";


export default function useRemember() {
	const storageService = inject(StorageServiceKey)!;
	const remembers = reactive<IRemember[]>([]);

	async function fetchRemembers() {
		console.log("-- fetch remembers");
		Object.assign(remembers, (await storageService.getRemembers()));
	}

	async function createRemember(rememberTitle: string) {
		const remember: IRemember = {
			title: rememberTitle,
			highlights: [],
		}
		//TODO: get id when I push...
		remembers.push(remember);
		await storageService.createRemember(remember);
	}

	async function updateRemember(remember: IRemember) {
		await storageService.updateRemember(remember);
	}

	async function deleteRemember(id: number) {
		const index = remembers.findIndex((g) => g.id === id);
		if (index > -1) remembers.splice(index, 1);
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
