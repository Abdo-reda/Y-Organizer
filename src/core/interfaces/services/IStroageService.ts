import { type DateTime } from "luxon";
import { IGratitude } from "../entities/IGratitude";
import { IRemember } from "../entities/IRemember";
import { IActivity } from "../entities/IActivity";
import { SettingsCodeEnum, SettingsCodeValueMap } from "@/core/enums/settingsCodeEnum";

export interface IStorageService {
	DATABASE_NAME: Readonly<String>;
	init(): void;
	initDB(): void;
	initDay(day: DateTime): void;

    getSetting<T extends SettingsCodeEnum>(code: T): Promise<SettingsCodeValueMap[T]|null>;
    updateSetting<T extends SettingsCodeEnum>(code: T, value: SettingsCodeValueMap[T]|null): Promise<void>;

	getNotes(day: DateTime): Promise<string>;
	updateNotes(day: DateTime, notes: string): Promise<void>;

    getDoodle(day: DateTime): Promise<string>;
	updateDoodle(day: DateTime, doodle: string): Promise<void>;

	getGratitudes(day: DateTime): Promise<IGratitude[]>;
	createGratitude(gratitude: IGratitude): Promise<void>;
	updateGratitude(gratitude: IGratitude): Promise<void>;
	deleteGratitude(id: number): Promise<void>;

	getRemembers(): Promise<IRemember[]>;
	createRemember(remember: IRemember): Promise<number|undefined>;
	updateRemember(id: number, remember: IRemember): Promise<void>;
	deleteRemember(id: number): Promise<void>;

    getActivities(): Promise<IActivity[]>;
	createActivity(activity: IActivity): Promise<void>;
	updateActivity(id: string, activity: IActivity): Promise<void>;
	deleteActivity(id: string): Promise<void>;
}