import Database from "@tauri-apps/plugin-sql";
import { DateTime } from "luxon";
import { IStorageService } from "../interfaces/services/stroageServiceInterface";
import { IDay } from "../interfaces/entities/IDay";
import { LoggingService } from "./loggingService";
import { IGratitude } from "../interfaces/entities/IGratitude";
import { IRemember } from "../interfaces/entities/IRemember";
import { IActivity } from "../interfaces/entities/IActivity";

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
        this.database.execute("PRAGMA foreign_keys = ON;"); //TODO: will I really need this?
	}

	async initDay(day: DateTime) {
		this.database.execute("INSERT OR IGNORE INTO days (day, notes) VALUES ($1, '');", [day.toISODate()]);
	}

	async getNotes(day: DateTime): Promise<string> {
		const dayData = await this.database.select<IDay[]>("SELECT notes FROM days WHERE day = $1;", [day.toISODate()]);
		return dayData.length > 0 ? dayData[0].notes : "";
	}

	async updateNotes(day: DateTime, notes: string) {
		await this.database.execute("UPDATE days SET notes = $1 WHERE day = $2;", [notes, day.toISODate()]);
	}

	async getGratitudes(day: DateTime): Promise<IGratitude[]> {
		const gratitudes = await this.database.select<IGratitude[]>("SELECT * FROM gratitudes WHERE day = $1;", [day.toISODate()]);
		this.mapGratitudes(gratitudes);
		return gratitudes;
	}

	async createGratitude(gratitude: IGratitude) {
		await this.database.execute("INSERT into gratitudes (title, description, category, highlights, day) VALUES ($1, $2, $3, $4, $5);", [
			gratitude.title,
			gratitude.description,
			gratitude.category,
			gratitude.highlights,
			gratitude.day,
		]);
	}

	async updateGratitude(gratitude: IGratitude) {
		await this.database.execute("UPDATE gratitudes SET title = $1, description = $2, category = $3, highlights = $4 WHERE day = $5;", [
			gratitude.title,
			gratitude.description,
			gratitude.category,
			gratitude.highlights,
			gratitude.day,
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

	async createRemember(remember: IRemember): Promise<number|undefined> {
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
        await this.database.execute("INSERT INTO activities (name, description, categories, color, status) VALUES ($1, $2, $3, $4, $5);", [activity.name, activity.description, activity.categories, activity.color, activity.status]);
    }

    async updateActivity(id: string, activity: IActivity): Promise<void> {
        await this.database.execute("UPDATE activities SET name = $1, description = $2, categories = $3, color = $4, status = $5 WHERE name = $6;", [activity.name, activity.description, activity.categories, activity.color, activity.status, id]);
    }

    async deleteActivity(id: string): Promise<void> {
        await this.database.execute("DELETE FROM activities WHERE name = $1;", [id]);
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
