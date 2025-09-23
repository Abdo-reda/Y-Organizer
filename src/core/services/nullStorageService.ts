import { DateTime } from "luxon";
import { IStorageService } from "../interfaces/services/stroageServiceInterface";
import { IGratitude } from "../interfaces/entities/IGratitude";
import { IRemember } from "../interfaces/entities/IRemember";

export class NullStroageService implements IStorageService {
	readonly DATABASE_NAME = "";
	
	init() {}
	
	initDB() {}
	
	initDay(_day: DateTime) {}

	getNotes(_day: DateTime): Promise<string> {
		return Promise.resolve('');
	}

	updateNotes(_day: DateTime, _notes: string): Promise<void> {
		return Promise.resolve();
	}

	getGratitudes(_day: DateTime): Promise<IGratitude[]> {
		return Promise.resolve([]);
	}

	createGratitude(_gratitude: IGratitude): Promise<void> {
		return Promise.resolve();
	}

	updateGratitude(_gratitude: IGratitude): Promise<void> {
		return Promise.resolve();
	}

	deleteGratitude(_id: number): Promise<void> {
		return Promise.resolve();
	}
	
	getRemembers(): Promise<IRemember[]> {
		return Promise.resolve([]);
	}

	createRemember(_remember: IRemember): Promise<number|undefined> {
		return Promise.resolve(undefined);
	}

	updateRemember(_remember: IRemember): Promise<void> {
		return Promise.resolve();
	}

	deleteRemember(_id: number): Promise<void> {
		return Promise.resolve();
	}
}
