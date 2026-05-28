import { DateTime } from "luxon";
import { IStorageService } from "../interfaces/services/IStroageService";
import { IDay } from "../interfaces/entities/IDay";
import { LoggingService } from "./loggingService";
import { IGratitude } from "../interfaces/entities/IGratitude";
import { IRemember } from "../interfaces/entities/IRemember";
import { IActivity } from "../interfaces/entities/IActivity";
import { SettingsCodeEnum, SettingsCodeValueMap } from "../enums/settingsCodeEnum";
import { ISetting } from "../interfaces/entities/ISetting";
import { ISession } from "../interfaces/entities/ISession";
import { ITask } from "../interfaces/entities/ITask";
import { IGoal } from "../interfaces/entities/IGoal";
import { IndexedDbClient, IndexedDbStores } from "./indexedDbClient";

type SessionRecord = Omit<ISession, "startTime" | "endTime"> & {
	startTime: string;
	endTime: string;
};

type TaskRecord = Omit<ITask, "isToday"> & {
	isToday: number;
};

type ActivityRecord = Omit<IActivity, "categories"> & {
	categories: string;
};

type GratitudeRecord = Omit<IGratitude, "highlights"> & {
	highlights: string;
};

type RememberRecord = Omit<IRemember, "highlights"> & {
	highlights: string;
};

export class WebStroageService implements IStorageService {
	readonly DATABASE_NAME = "y";
	private readonly db = new IndexedDbClient();

	async init() {
		LoggingService.log("Init IndexedDB...");
		await this.initDB();
		await this.initDay(DateTime.now());
	}

	async initDB() {
		await this.db.open();
	}

	async initDay(day: DateTime) {
		const dayKey = day.toISODate()!;
		const existing = await this.db.get<IDay>(IndexedDbStores.days, dayKey);
		if (!existing) {
			await this.db.put<IDay>(IndexedDbStores.days, {
				day: dayKey,
				notes: "",
				learnings: "",
				doodle: "",
			});
		}
	}

	close() {
		this.db.close();
		return Promise.resolve();
	}

	async getSettings(): Promise<ISetting<SettingsCodeEnum>[]> {
		const settings = await this.db.getAll<ISetting<SettingsCodeEnum>>(IndexedDbStores.settings);
		this.mapSettings(settings);
		return settings;
	}

	async updateSetting<T extends SettingsCodeEnum>(code: T, value: SettingsCodeValueMap[T] | null): Promise<void> {
		const storedValue = value === null ? null : typeof value === "string" ? value : JSON.stringify(value);
		await this.db.put(IndexedDbStores.settings, { code, value: storedValue });
	}

	private async getDayField(day: DateTime, field: keyof Pick<IDay, "notes" | "learnings" | "doodle">): Promise<string> {
		const dayData = await this.db.get<IDay>(IndexedDbStores.days, day.toISODate()!);
		return dayData?.[field] ?? "";
	}

	async getNotes(day: DateTime): Promise<string> {
		return this.getDayField(day, "notes");
	}

	async getLearnings(day: DateTime): Promise<string> {
		return this.getDayField(day, "learnings");
	}

	async updateNotes(day: DateTime, notes: string) {
		await this.updateDayField(day, "notes", notes);
	}

	async updateLearnings(day: DateTime, learnings: string) {
		await this.updateDayField(day, "learnings", learnings);
	}

	async getDoodle(day: DateTime): Promise<string> {
		return this.getDayField(day, "doodle");
	}

	async updateDoodle(day: DateTime, doodle: string): Promise<void> {
		await this.updateDayField(day, "doodle", doodle);
	}

	private async updateDayField(day: DateTime, field: keyof Pick<IDay, "notes" | "learnings" | "doodle">, value: string) {
		const dayKey = day.toISODate()!;
		const existing = await this.db.get<IDay>(IndexedDbStores.days, dayKey);
		await this.db.put<IDay>(IndexedDbStores.days, {
			day: dayKey,
			notes: existing?.notes ?? "",
			learnings: existing?.learnings ?? "",
			doodle: existing?.doodle ?? "",
			[field]: value,
		});
	}

	async getGratitudes(day: DateTime): Promise<IGratitude[]> {
		const gratitudes = await this.db.getAllByIndex<GratitudeRecord>(IndexedDbStores.gratitudes, "day", day.toISODate()!);
		return this.mapGratitudes(gratitudes);
	}

	async createGratitude(gratitude: IGratitude) {
		const id = await this.db.add(IndexedDbStores.gratitudes, {
			title: gratitude.title,
			category: gratitude.category,
			highlights: JSON.stringify(gratitude.highlights),
			day: gratitude.day,
		});
		return id;
	}

	async updateGratitude(id: number, gratitude: IGratitude) {
		await this.db.put(IndexedDbStores.gratitudes, {
			id,
			title: gratitude.title,
			category: gratitude.category,
			highlights: JSON.stringify(gratitude.highlights),
			day: gratitude.day,
		});
	}

	async deleteGratitude(id: number) {
		await this.db.delete(IndexedDbStores.gratitudes, id);
	}

	async getRemembers(): Promise<IRemember[]> {
		const remembers = await this.db.getAll<RememberRecord>(IndexedDbStores.remembers);
		return this.mapRemembers(remembers);
	}

	async createRemember(remember: IRemember): Promise<number | undefined> {
		return this.db.add(IndexedDbStores.remembers, {
			title: remember.title,
			highlights: JSON.stringify(remember.highlights),
		});
	}

	async updateRemember(id: number, remember: IRemember): Promise<void> {
		await this.db.put(IndexedDbStores.remembers, {
			id,
			title: remember.title,
			highlights: JSON.stringify(remember.highlights),
		});
	}

	async deleteRemember(id: number): Promise<void> {
		await this.db.delete(IndexedDbStores.remembers, id);
	}

	async getActivities(): Promise<IActivity[]> {
		const activities = await this.db.getAll<ActivityRecord>(IndexedDbStores.activities);
		return this.mapActivities(activities);
	}

	async createActivity(activity: IActivity): Promise<void> {
		await this.db.put(IndexedDbStores.activities, {
			name: activity.name,
			description: activity.description,
			categories: JSON.stringify(activity.categories),
			color: activity.color,
			status: activity.status,
		});
	}

	async updateActivity(id: string, activity: IActivity): Promise<void> {
		if (id !== activity.name) {
			await this.db.delete(IndexedDbStores.activities, id);
		}
		await this.db.put(IndexedDbStores.activities, {
			name: activity.name,
			description: activity.description,
			categories: JSON.stringify(activity.categories),
			color: activity.color,
			status: activity.status,
		});
	}

	async deleteActivity(id: string): Promise<void> {
		await this.db.delete(IndexedDbStores.activities, id);
	}

	async getSessions(day: DateTime): Promise<ISession[]> {
		const sessions = await this.db.getAllByIndex<SessionRecord>(IndexedDbStores.sessions, "day", day.toISODate()!);
		return this.mapSessions(sessions);
	}

	async createSession(session: ISession): Promise<number | undefined> {
		return this.db.add(IndexedDbStores.sessions, this.toSessionRecord(session));
	}

	async updateSession(id: number, session: ISession): Promise<void> {
		await this.db.put(IndexedDbStores.sessions, {
			id,
			...this.toSessionRecord(session),
		});
	}

	async deleteSession(id: number): Promise<void> {
		await this.db.delete(IndexedDbStores.sessions, id);
	}

	async getTasks(day: DateTime, endDate?: DateTime): Promise<ITask[]> {
		let tasks: TaskRecord[];
		if (endDate) {
			tasks = await this.db.getAllByIndex<TaskRecord>(
				IndexedDbStores.tasks,
				"completedDay",
				IDBKeyRange.bound(day.toISODate()!, endDate.toISODate()!),
			);
		} else {
			const dayIso = day.toISODate()!;
			const [byDay, allTasks] = await Promise.all([
				this.db.getAllByIndex<TaskRecord>(IndexedDbStores.tasks, "completedDay", dayIso),
				this.db.getAll<TaskRecord>(IndexedDbStores.tasks),
			]);
			const openTasks = allTasks.filter((task) => task.completedDay === "");
			const seen = new Set<number>();
			tasks = [];
			for (const task of [...byDay, ...openTasks]) {
				if (task.id !== undefined && seen.has(task.id)) continue;
				if (task.id !== undefined) seen.add(task.id);
				tasks.push(task);
			}
		}
		return this.mapTasks(tasks);
	}

	async createTask(task: ITask): Promise<number | undefined> {
		return this.db.add(IndexedDbStores.tasks, this.toTaskRecord(task));
	}

	async updateTask(id: number, task: ITask): Promise<void> {
		await this.db.put(IndexedDbStores.tasks, {
			id,
			...this.toTaskRecord(task),
		});
	}

	async deleteTask(id: number): Promise<void> {
		await this.db.delete(IndexedDbStores.tasks, id);
	}

	getGoals(): Promise<IGoal[]> {
		return this.db.getAll<IGoal>(IndexedDbStores.goals);
	}

	async createGoal(goal: IGoal): Promise<number | undefined> {
		return this.db.add(IndexedDbStores.goals, {
			title: goal.title,
			description: goal.description,
			activity: goal.activity,
			points: goal.points,
			totalPoints: goal.totalPoints,
			completedDay: goal.completedDay,
			status: goal.status,
		});
	}

	async updateGoal(id: number, goal: IGoal): Promise<void> {
		await this.db.put(IndexedDbStores.goals, {
			id,
			title: goal.title,
			description: goal.description,
			activity: goal.activity,
			points: goal.points,
			totalPoints: goal.totalPoints,
			completedDay: goal.completedDay,
			status: goal.status,
		});
	}

	async deleteGoal(id: number): Promise<void> {
		await this.db.delete(IndexedDbStores.goals, id);
	}

	private toSessionRecord(session: ISession): Omit<SessionRecord, "id"> {
		return {
			title: session.title,
			notes: session.notes,
			activity: session.activity,
			day: session.day,
			startTime: session.startTime.toISOTime({ includeOffset: false, precision: "minute" }) ?? "",
			endTime: session.endTime.toISOTime({ includeOffset: false, precision: "minute" }) ?? "",
			status: session.status,
		};
	}

	private toTaskRecord(task: ITask): Omit<TaskRecord, "id"> {
		return {
			title: task.title,
			description: task.description,
			activity: task.activity,
			session: task.session,
			isToday: task.isToday ? 1 : 0,
			completedDay: task.completedDay,
			status: task.status,
			goal: task.goal,
			points: task.points,
		};
	}

	private mapTasks(tasks: TaskRecord[]): ITask[] {
		return tasks.map((task) => {
			const mapped: ITask = { ...task, isToday: !!task.isToday };
			return mapped;
		});
	}

	private mapSessions(sessions: SessionRecord[]): ISession[] {
		return sessions.map((session) => {
			const mapped = { ...session } as unknown as ISession;
			if (typeof session.startTime === "string") {
				try {
					mapped.startTime = DateTime.fromISO(`${session.day}T${session.startTime}`);
				} catch (e) {
					LoggingService.log("Failed to parse session startTime", e);
				}
			}
			if (typeof session.endTime === "string") {
				try {
					mapped.endTime = DateTime.fromISO(`${session.day}T${session.endTime}`);
					if (mapped.endTime.hour === 0) mapped.endTime = mapped.endTime.plus({ day: 1 });
				} catch (e) {
					LoggingService.log("Failed to parse session endTime", e);
				}
			}
			return mapped;
		});
	}

	private mapSettings(settings: ISetting<SettingsCodeEnum>[]) {
		settings.forEach((setting) => {
			if (setting.code === SettingsCodeEnum.DAY_LAYOUT) {
				if (typeof setting.value === "string") {
					try {
						setting.value = JSON.parse(setting.value);
					} catch (e) {
						LoggingService.log("Failed to parse setting value", e);
					}
				}
			}
		});
	}

	private mapActivities(activities: ActivityRecord[]): IActivity[] {
		return activities.map((activity) => {
			const mapped: IActivity = { ...activity, categories: [] };
			if (typeof activity.categories === "string") {
				try {
					mapped.categories = JSON.parse(activity.categories);
				} catch (e) {
					LoggingService.log("Failed to parse activity categories", e);
					mapped.categories = [];
				}
			}
			return mapped;
		});
	}

	private mapGratitudes(gratitudes: GratitudeRecord[]): IGratitude[] {
		return gratitudes.map((gratitude) => {
			const mapped: IGratitude = { ...gratitude, highlights: [] };
			if (typeof gratitude.highlights === "string") {
				try {
					mapped.highlights = JSON.parse(gratitude.highlights);
				} catch (e) {
					LoggingService.log("Failed to parse gratitude highlights", e);
					mapped.highlights = [];
				}
			}
			return mapped;
		});
	}

	private mapRemembers(remembers: RememberRecord[]): IRemember[] {
		return remembers.map((remember) => {
			const mapped: IRemember = { ...remember, highlights: [] };
			if (typeof remember.highlights === "string") {
				try {
					mapped.highlights = JSON.parse(remember.highlights);
				} catch (e) {
					LoggingService.log("Failed to parse remember highlights", e);
					mapped.highlights = [];
				}
			}
			return mapped;
		});
	}
}
