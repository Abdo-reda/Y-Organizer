import { type DateTime } from "luxon";
import { IGratitude } from "../entities/IGratitude";

export interface IStorageService {
	DATABASE_NAME: Readonly<String>;
	init(): void;
	initDB(): void;
	initDay(day: DateTime): void;
    
	getNotes(day: DateTime): Promise<string>;
	updateNotes(day: DateTime, notes: string): Promise<void>;

	getGratitudes(day: DateTime): Promise<IGratitude[]>;
	createGratitude(gratitude: IGratitude): Promise<void>;
	updateGratitude(gratitude: IGratitude): Promise<void>;
	deleteGratitude(id: number): Promise<void>;
}