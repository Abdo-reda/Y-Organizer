import { type DateTime } from "luxon";
import { IGratitude } from "../entities/IGratitude";
import { IRemember } from "../entities/IRemember";

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

	getRemembers(): Promise<IRemember[]>;
	createRemember(remember: IRemember): Promise<void>;
	updateRemember(remember: IRemember): Promise<void>;
	deleteRemember(id: number): Promise<void>;
}