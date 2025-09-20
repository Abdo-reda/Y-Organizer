import Database from "@tauri-apps/plugin-sql";
import { DateTime } from "luxon";
import { IStorageService } from "../interfaces/services/stroageServiceInterface";
import { IDay } from "../interfaces/entities/IDay";
import { LoggingService } from "./loggingService";
import { IGratitude } from "../interfaces/entities/IGratitude";

export class SqliteStroageService implements IStorageService {
	readonly DATABASE_NAME = "y.db";
	database!: Database;

	async init() {
		LoggingService.log("SqliteStroageService", "Init sqlite database...");
		await this.initDB();
		await this.initDay(DateTime.now());
	}

	async initDB() {
		this.database = await Database.load(`sqlite:${this.DATABASE_NAME}`);
	}

	async initDay(day: DateTime) {
		this.database.execute("INSERT OR IGNORE INTO days (day, notes) VALUES ($1, '');", [day.toISODate()]);
	}

	async getNotes(day: DateTime): Promise<string> {
		const dayData = await this.database.select<IDay[]>("SELECT notes FROM days WHERE day = $1;", [day.toISODate()]);
		return dayData.length > 0 ? dayData[0].notes : "";
	}

	async updateNotes(day: DateTime, notes: string) {
		await this.database.execute("UPDATE days SET notes = $1 WHERE day = $2", [notes, day.toISODate()]);
	}

	async getGratitudes(day: DateTime): Promise<IGratitude[]> {
		const gratitudes = await this.database.select<IGratitude[]>("SELECT * FROM gratitudes WHERE day = $1;", [day.toISODate()]);
		this.mapGratitudes(gratitudes);
		return gratitudes;
	}

	private mapGratitudes(gratitudes: IGratitude[]) {
		gratitudes.forEach((gratitude) => {
			if (typeof gratitude.highlights === "string") {
				try {
					gratitude.highlights = JSON.parse(gratitude.highlights);
				} catch (e) {
					LoggingService.log("SqliteStroageService", "Failed to parse highlights", e);
					gratitude.highlights = [];
				}
			}
		});
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
}
