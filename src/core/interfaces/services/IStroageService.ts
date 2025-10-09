import { type DateTime } from "luxon";
import { IGratitude } from "../entities/IGratitude";
import { IRemember } from "../entities/IRemember";
import { IActivity } from "../entities/IActivity";
import { SettingsCodeEnum, SettingsCodeValueMap } from "@/core/enums/settingsCodeEnum";
import { ISetting } from "../entities/ISetting";
import { ISession } from "../entities/ISession";
import { ITask } from "../entities/ITask";
import { IGoal } from "../entities/IGoal";

export interface IStorageService {
	DATABASE_NAME: Readonly<String>;
	init(): Promise<void>;
	initDB(): Promise<void>;
	initDay(day: DateTime): Promise<void>;

    getSettings(): Promise<ISetting<SettingsCodeEnum>[]>;
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

    getSessions(day: DateTime): Promise<ISession[]>;
	createSession(session: ISession): Promise<number|undefined>;
	updateSession(id: number, session: ISession): Promise<void>;
	deleteSession(id: number): Promise<void>;

    getTasks(day: DateTime): Promise<ITask[]>;
	createTask(task: ITask): Promise<number|undefined>;
	updateTask(id: number, task: ITask): Promise<void>;
	deleteTask(id: number): Promise<void>;

    getGoals(): Promise<IGoal[]>;
	createGoal(monthlyGoal: IGoal): Promise<number|undefined>;
	updateGoal(id: number, monthlyGoal: IGoal): Promise<void>;
	deleteGoal(id: number): Promise<void>;
}