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

	updateNotes(day: DateTime, notes: string): Promise<void> {
		return Promise.resolve();
	}

	getGratitudes(day: DateTime): Promise<IGratitude[]> {
		return Promise.resolve([]);
	}

	createGratitude(gratitude: IGratitude): Promise<void> {
		return Promise.resolve();
	}

	updateGratitude(gratitude: IGratitude): Promise<void> {
		return Promise.resolve();
	}

	deleteGratitude(id: number): Promise<void> {
		return Promise.resolve();
	}
	
	getRemembers(): Promise<IRemember[]> {
		return Promise.resolve([]);
	}

	createRemember(remember: IRemember): Promise<void> {
		return Promise.resolve();
	}

	updateRemember(remember: IRemember): Promise<void> {
		return Promise.resolve();
	}

	deleteRemember(id: number): Promise<void> {
		return Promise.resolve();
	}
}
