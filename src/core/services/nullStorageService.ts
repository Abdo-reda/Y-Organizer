import { DateTime } from "luxon";
import { IStorageService } from "../interfaces/services/stroageServiceInterface";

export class NullStroageService implements IStorageService {
	readonly DATABASE_NAME = "";
	
	init() {}
	
	initDB() {}
	
	initDay(_day: DateTime) {}

	getNotes(_day: DateTime): Promise<string> {
		return Promise.resolve('');
	}

	updateNotes(_day: DateTime, _notes: string) { }

	addTask() {}
}
