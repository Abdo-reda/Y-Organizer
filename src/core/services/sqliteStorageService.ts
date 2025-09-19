import Database from "@tauri-apps/plugin-sql";
import { DateTime } from "luxon";
import { IStorageService } from "../interfaces/services/stroageServiceInterface";
import { IDay } from "../interfaces/entities/IDay";

export class SqliteStroageService implements IStorageService {
	readonly DATABASE_NAME = "y.db";
	database!: Database;

	async init() {
		console.log("---- init sqlite database");
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
		return dayData.length > 0 ? dayData[0].notes : '';
	}

	async updateNotes(day: DateTime, notes: string) {
		await this.database.execute("UPDATE days SET notes = $1 WHERE day = $2", [notes, day.toISODate()]);
	}

	async addTask() {
		await this.database.execute("INSERT INTO ...");
		// const result = await db.execute("INSERT into todos (id, title, status) VALUES ($1, $2, $3)", [
		// 	todos.id,
		// 	todos.title,
		// 	todos.status,
		// ]);

		// const result = await db.execute(
		// "UPDATE todos SET title = $1, status = $2 WHERE id = $3",
		// [todos.title, todos.status, todos.id],
		// );
	}
}
