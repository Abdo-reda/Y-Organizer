import { type DateTime } from "luxon";

export interface IStorageService {
	DATABASE_NAME: Readonly<String>;
	init(): void;
	initDB(): void;
	initDay(day: DateTime): void;
	getNotes(day: DateTime): Promise<string>;
	updateNotes(day: DateTime, notes: string): void;
}