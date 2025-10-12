import { DateTime } from "luxon";
import { IStorageService } from "../interfaces/services/IStroageService";
import { IGratitude } from "../interfaces/entities/IGratitude";
import { IRemember } from "../interfaces/entities/IRemember";
import { IActivity } from "../interfaces/entities/IActivity";
import { SettingsCodeEnum, SettingsCodeValueMap } from "../enums/settingsCodeEnum";
import { ISetting } from "../interfaces/entities/ISetting";
import { ISession } from "../interfaces/entities/ISession";
import { ITask } from "../interfaces/entities/ITask";
import { IGoal } from "../interfaces/entities/IGoal";

export class NullStroageService implements IStorageService {
	readonly DATABASE_NAME = "";
	private idCounter = 0;

	init() {
		return Promise.resolve();
	}

	initDB() {
		return Promise.resolve();
	}

	initDay(_day: DateTime) {
		return Promise.resolve();
	}

    close() {
        return Promise.resolve();
    }

	getSettings(): Promise<ISetting<SettingsCodeEnum>[]> {
		return Promise.resolve([]);
	}

	updateSetting<T extends SettingsCodeEnum>(_code: T, _value: SettingsCodeValueMap[T] | null): Promise<void> {
		return Promise.resolve();
	}

	getNotes(_day: DateTime): Promise<string> {
		return Promise.resolve("");
	}

	updateNotes(_day: DateTime, _notes: string): Promise<void> {
		return Promise.resolve();
	}

	getDoodle(_day: DateTime): Promise<string> {
		return Promise.resolve("");
	}

	updateDoodle(_day: DateTime, _doodle: string): Promise<void> {
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

	createRemember(_remember: IRemember): Promise<number | undefined> {
		return Promise.resolve(this.idCounter++);
	}

	updateRemember(_id: number, _remember: IRemember): Promise<void> {
		return Promise.resolve();
	}

	deleteRemember(_id: number): Promise<void> {
		return Promise.resolve();
	}

	getActivities(): Promise<IActivity[]> {
		return Promise.resolve([]);
	}

	createActivity(_activity: IActivity): Promise<void> {
		return Promise.resolve();
	}

	updateActivity(_id: string, _activity: IActivity): Promise<void> {
		return Promise.resolve();
	}

	deleteActivity(_id: string): Promise<void> {
		return Promise.resolve();
	}

	getSessions(_day: DateTime): Promise<ISession[]> {
		return Promise.resolve([]);
	}

	createSession(_session: ISession): Promise<number | undefined> {
		return Promise.resolve(this.idCounter++);
	}

	updateSession(_id: number, _session: ISession): Promise<void> {
		return Promise.resolve();
	}

	deleteSession(_id: number): Promise<void> {
		return Promise.resolve();
	}

	getTasks(_day: DateTime, _endDate?: DateTime): Promise<ITask[]> {
		return Promise.resolve([]);
	}

	createTask(_task: ITask): Promise<number | undefined> {
		return Promise.resolve(this.idCounter++);
	}

	updateTask(_id: number, _task: ITask): Promise<void> {
		return Promise.resolve();
	}

	deleteTask(_id: number): Promise<void> {
		return Promise.resolve();
	}

	getGoals(): Promise<IGoal[]> {
		return Promise.resolve([]);
	}

	createGoal(_monthlyGoal: IGoal): Promise<number | undefined> {
		return Promise.resolve(this.idCounter++);
	}

	updateGoal(_id: number, _monthlyGoal: IGoal): Promise<void> {
		return Promise.resolve();
	}

	deleteGoal(_id: number): Promise<void> {
		return Promise.resolve();
	}
}
