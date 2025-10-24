import Database from "@tauri-apps/plugin-sql";
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

export class SqliteStroageService implements IStorageService {
	readonly DATABASE_NAME = "y.db";
	database!: Database;

	async init() {
		LoggingService.log("Init sqlite database...");
		await this.initDB();
		await this.initDay(DateTime.now());
	}

	async initDB() {
		this.database = await Database.load(`sqlite:${this.DATABASE_NAME}`);
		await this.database.execute("PRAGMA foreign_keys = ON;"); //TODO: will I really need this?
	}

	async initDay(day: DateTime) {
		await this.database.execute("INSERT OR IGNORE INTO days (day, notes) VALUES ($1, '');", [day.toISODate()]);
	}

    async close() {
        await this.database.close();
    }

	async getSettings(): Promise<ISetting<SettingsCodeEnum>[]> {
		const settings = await this.database.select<ISetting<SettingsCodeEnum>[]>("SELECT * FROM settings;");
		this.mapSettings(settings);
		return settings;
	}

	async updateSetting<T extends SettingsCodeEnum>(code: T, value: SettingsCodeValueMap[T] | null): Promise<void> {
		await this.database.execute("INSERT INTO settings (code, value) VALUES ($1, $2) ON CONFLICT(code) DO UPDATE SET value = excluded.value;", [code, value]);
	}

	async getNotes(day: DateTime): Promise<string> {
		const dayData = await this.database.select<IDay[]>("SELECT notes FROM days WHERE day = $1;", [day.toISODate()]);
		return dayData.length > 0 ? dayData[0].notes : "";
	}

	async getLearnings(day: DateTime): Promise<string> {
		const dayData = await this.database.select<IDay[]>("SELECT learnings FROM days WHERE day = $1;", [day.toISODate()]);
		return dayData.length > 0 ? dayData[0].learnings : "";
	}

	async updateNotes(day: DateTime, notes: string) {
		await this.database.execute("UPDATE days SET notes = $1 WHERE day = $2;", [notes, day.toISODate()]);
	}

	async updateLearnings(day: DateTime, learnings: string) {
		await this.database.execute("UPDATE days SET learnings = $1 WHERE day = $2;", [learnings, day.toISODate()]);
	}

	async getDoodle(day: DateTime): Promise<string> {
		const dayData = await this.database.select<IDay[]>("SELECT doodle FROM days WHERE day = $1;", [day.toISODate()]);
		return dayData.length > 0 ? dayData[0].doodle : "";
	}

	async updateDoodle(day: DateTime, doodle: string): Promise<void> {
		await this.database.execute("UPDATE days SET doodle = $1 WHERE day = $2;", [doodle, day.toISODate()]);
	}

	async getGratitudes(day: DateTime): Promise<IGratitude[]> {
		const gratitudes = await this.database.select<IGratitude[]>("SELECT * FROM gratitudes WHERE day = $1;", [day.toISODate()]);
        this.mapGratitudes(gratitudes);
        return gratitudes;
	}

	async createGratitude(gratitude: IGratitude) {
		const result = await this.database.execute("INSERT into gratitudes (title, category, highlights, day) VALUES ($1, $2, $3, $4);", [
			gratitude.title,
			gratitude.category,
			gratitude.highlights,
			gratitude.day,
		]);
        return result.lastInsertId;
	}

	async updateGratitude(id: number, gratitude: IGratitude) {
		await this.database.execute("UPDATE gratitudes SET title = $1, category = $2, highlights = $3, day = $4 WHERE id = $5;", [
			gratitude.title,
			gratitude.category,
			gratitude.highlights,
            gratitude.day,
			id,
		]);
	}

	async deleteGratitude(id: number) {
		await this.database.execute("DELETE FROM gratitudes WHERE id = $1;", [id]);
	}

	async getRemembers(): Promise<IRemember[]> {
		const remembers = await this.database.select<IRemember[]>("SELECT * FROM remembers;");
		this.mapRemembers(remembers);
		return remembers;
	}

	async createRemember(remember: IRemember): Promise<number | undefined> {
		const result = await this.database.execute("INSERT INTO remembers (title, highlights) VALUES ($1, $2);", [remember.title, remember.highlights]);
		return result.lastInsertId;
	}

	async updateRemember(id: number, remember: IRemember): Promise<void> {
		await this.database.execute("UPDATE remembers SET title = $1, highlights = $2 WHERE id = $3;", [remember.title, remember.highlights, id]);
	}

	async deleteRemember(id: number): Promise<void> {
		await this.database.execute("DELETE FROM remembers WHERE id = $1;", [id]);
	}

	async getActivities(): Promise<IActivity[]> {
		const activities = await this.database.select<IActivity[]>("SELECT * FROM activities;");
		this.mapActivities(activities);
		return activities;
	}

	async createActivity(activity: IActivity): Promise<void> {
		await this.database.execute("INSERT INTO activities (name, description, categories, color, status) VALUES ($1, $2, $3, $4, $5);", [
			activity.name,
			activity.description,
			activity.categories,
			activity.color,
			activity.status,
		]);
	}

	async updateActivity(id: string, activity: IActivity): Promise<void> {
		await this.database.execute("UPDATE activities SET name = $1, description = $2, categories = $3, color = $4, status = $5 WHERE name = $6;", [
			activity.name,
			activity.description,
			activity.categories,
			activity.color,
			activity.status,
			id,
		]);
	}

	async deleteActivity(id: string): Promise<void> {
		await this.database.execute("DELETE FROM activities WHERE name = $1;", [id]);
	}

	async getSessions(day: DateTime): Promise<ISession[]> {
		const sessions = await this.database.select<ISession[]>("SELECT * FROM sessions WHERE day = $1;", [day.toISODate()]);
		this.mapSessions(sessions);
		return sessions;
	}

	async createSession(session: ISession): Promise<number | undefined> {
		const result = await this.database.execute("INSERT INTO sessions (title, notes, activity, day, startTime, endTime, status) VALUES ($1, $2, $3, $4, $5, $6, $7);", [
			session.title,
			session.notes,
			session.activity,
			session.day,
			session.startTime.toISOTime({ includeOffset: false, precision: "minute" }),
			session.endTime.toISOTime({ includeOffset: false, precision: "minute" }),
			session.status,
		]);
		return result.lastInsertId;
	}

	async updateSession(id: number, session: ISession): Promise<void> {
		await this.database.execute("UPDATE sessions SET title = $1, notes = $2, activity = $3, day = $4, startTime = $5, endTime = $6, status = $7 WHERE id = $8;", [
			session.title,
			session.notes,
			session.activity,
			session.day,
			session.startTime.toISOTime({ includeOffset: false, precision: "minute" }),
			session.endTime.toISOTime({ includeOffset: false, precision: "minute" }),
			session.status,
			id,
		]);
	}

	async deleteSession(id: number): Promise<void> {
		await this.database.execute("DELETE FROM sessions WHERE id = $1;", [id]);
	}

	async getTasks(day: DateTime, endDate?: DateTime): Promise<ITask[]> {
        let tasks = [];
        if (endDate) {
            tasks = await this.database.select<ITask[]>("SELECT * FROM tasks WHERE completedDay BETWEEN $1 AND $2;", [day.toISODate(), endDate.toISODate()]);
        } else {
            tasks = await this.database.select<ITask[]>("SELECT * FROM tasks WHERE completedDay = $1 OR completedDay = '';", [day.toISODate()]);
        }
        this.mapTasks(tasks);
        return tasks;
	}

	async createTask(task: ITask): Promise<number | undefined> {
		const result = await this.database.execute("INSERT INTO tasks (title, description, activity, session, isToday, completedDay, status, goal, points) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);", [
			task.title,
			task.description,
			task.activity,
			task.session,
			task.isToday ? 1 : 0,
			task.completedDay,
			task.status,
            task.goal,
            task.points,
		]);
		return result.lastInsertId;
	}

	async updateTask(id: number, task: ITask): Promise<void> {
		await this.database.execute("UPDATE tasks SET title = $1, description = $2, activity = $3, session = $4, isToday = $5, completedDay = $6, status = $7, goal = $8, points = $9 WHERE id = $10;", [
			task.title,
			task.description,
			task.activity,
			task.session,
			task.isToday ? 1 : 0,
			task.completedDay,
			task.status,
            task.goal,
            task.points,
			id,
		]);
	}

	async deleteTask(id: number): Promise<void> {
		await this.database.execute("DELETE FROM tasks WHERE id = $1;", [id]);
	}

    getGoals(): Promise<IGoal[]> {
		return this.database.select<IGoal[]>("SELECT * FROM goals;");
	}

	async createGoal(goal: IGoal): Promise<number | undefined> {
		const result = await this.database.execute("INSERT INTO goals (title, description, activity, points, totalPoints, completedDay, status) VALUES ($1, $2, $3, $4, $5, $6, $7);", [
			goal.title,
			goal.description,
			goal.activity,
			goal.points,
			goal.totalPoints,
			goal.completedDay,
            goal.status,
		]);
		return result.lastInsertId;
	}

	async updateGoal(id: number, goal: IGoal): Promise<void> {
		await this.database.execute("UPDATE goals SET title = $1, description = $2, activity = $3, points = $4, totalPoints = $5, completedDay = $6, status = $7 WHERE id = $8;", [
			goal.title,
			goal.description,
			goal.activity,
			goal.points,
			goal.totalPoints,
			goal.completedDay,
            goal.status,
			id,
		]);
	}

	async deleteGoal(id: number): Promise<void> {
        await this.database.execute("DELETE FROM goals WHERE id = $1;", [id]);
	}

    private mapTasks(tasks: ITask[]) {
		tasks.forEach((task) => {
			if (typeof task.isToday === "number") {
				try {
					task.isToday = !!task.isToday;
				} catch (e) {
					LoggingService.log("Failed to parse task isToday", e);
				}
			}
		});
	}

	private mapSessions(sesions: ISession[]) {
		sesions.forEach((session) => {
			if (typeof session.startTime === "string") {
				try {
					session.startTime = DateTime.fromISO(`${session.day}T${session.startTime}`);
				} catch (e) {
					LoggingService.log("Failed to parse session startTime", e);
				}
			}
			if (typeof session.endTime === "string") {
				try {
					session.endTime = DateTime.fromISO(`${session.day}T${session.endTime}`);
					if (session.endTime.hour === 0) session.endTime = session.endTime.plus({ day: 1 });
				} catch (e) {
					LoggingService.log("Failed to parse session endTime", e);
				}
			}
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

	private mapActivities(activities: IActivity[]) {
		activities.forEach((activity) => {
			if (typeof activity.categories === "string") {
				try {
					activity.categories = JSON.parse(activity.categories);
				} catch (e) {
					LoggingService.log("Failed to parse activity categories", e);
					activity.categories = [];
				}
			}
		});
	}

	private mapGratitudes(gratitudes: IGratitude[]) {
		gratitudes.forEach((gratitude) => {
			if (typeof gratitude.highlights === "string") {
				try {
					gratitude.highlights = JSON.parse(gratitude.highlights);
				} catch (e) {
					LoggingService.log("Failed to parse gratitude highlights", e);
					gratitude.highlights = [];
				}
			}
		});
	}

	private mapRemembers(remembers: IRemember[]) {
		remembers.forEach((remember) => {
			if (typeof remember.highlights === "string") {
				try {
					remember.highlights = JSON.parse(remember.highlights);
				} catch (e) {
					LoggingService.log("Failed to parse remember highlights", e);
					remember.highlights = [];
				}
			}
		});
	}
}
