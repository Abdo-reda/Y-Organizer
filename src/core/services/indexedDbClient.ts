const DB_NAME = "y";
const DB_VERSION = 1;

export const IndexedDbStores = {
	days: "days",
	settings: "settings",
	activities: "activities",
	sessions: "sessions",
	goals: "goals",
	tasks: "tasks",
	remembers: "remembers",
	gratitudes: "gratitudes",
} as const;

export type IndexedDbStoreName = (typeof IndexedDbStores)[keyof typeof IndexedDbStores];

function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB"));
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;

			if (!db.objectStoreNames.contains(IndexedDbStores.days)) {
				db.createObjectStore(IndexedDbStores.days, { keyPath: "day" });
			}

			if (!db.objectStoreNames.contains(IndexedDbStores.settings)) {
				db.createObjectStore(IndexedDbStores.settings, { keyPath: "code" });
			}

			if (!db.objectStoreNames.contains(IndexedDbStores.activities)) {
				db.createObjectStore(IndexedDbStores.activities, { keyPath: "name" });
			}

			if (!db.objectStoreNames.contains(IndexedDbStores.sessions)) {
				const sessions = db.createObjectStore(IndexedDbStores.sessions, {
					keyPath: "id",
					autoIncrement: true,
				});
				sessions.createIndex("day", "day", { unique: false });
				sessions.createIndex("activity", "activity", { unique: false });
			}

			if (!db.objectStoreNames.contains(IndexedDbStores.goals)) {
				db.createObjectStore(IndexedDbStores.goals, {
					keyPath: "id",
					autoIncrement: true,
				});
			}

			if (!db.objectStoreNames.contains(IndexedDbStores.tasks)) {
				const tasks = db.createObjectStore(IndexedDbStores.tasks, {
					keyPath: "id",
					autoIncrement: true,
				});
				tasks.createIndex("completedDay", "completedDay", { unique: false });
			}

			if (!db.objectStoreNames.contains(IndexedDbStores.remembers)) {
				db.createObjectStore(IndexedDbStores.remembers, {
					keyPath: "id",
					autoIncrement: true,
				});
			}

			if (!db.objectStoreNames.contains(IndexedDbStores.gratitudes)) {
				const gratitudes = db.createObjectStore(IndexedDbStores.gratitudes, {
					keyPath: "id",
					autoIncrement: true,
				});
				gratitudes.createIndex("day", "day", { unique: false });
			}
		};
	});
}

export class IndexedDbClient {
	private db: IDBDatabase | null = null;

	async open(): Promise<IDBDatabase> {
		if (!this.db) {
			this.db = await openDatabase();
		}
		return this.db;
	}

	close(): void {
		this.db?.close();
		this.db = null;
	}

	private async withStore<T>(store: IndexedDbStoreName, mode: IDBTransactionMode, run: (objectStore: IDBObjectStore) => IDBRequest<T> | Promise<T>): Promise<T> {
		const db = await this.open();
		return new Promise((resolve, reject) => {
			const tx = db.transaction(store, mode);
			const objectStore = tx.objectStore(store);

			tx.onerror = () => reject(tx.error ?? new Error("IndexedDB transaction failed"));
			tx.onabort = () => reject(tx.error ?? new Error("IndexedDB transaction aborted"));

			try {
				const result = run(objectStore);
				if (result instanceof Promise) {
					result.then(resolve).catch(reject);
					return;
				}
				result.onsuccess = () => resolve(result.result as T);
				result.onerror = () => reject(result.error ?? new Error("IndexedDB request failed"));
			} catch (error) {
				reject(error);
			}
		});
	}

	get<T>(store: IndexedDbStoreName, key: IDBValidKey): Promise<T | undefined> {
		return this.withStore(store, "readonly", (objectStore) => objectStore.get(key));
	}

	getAll<T>(store: IndexedDbStoreName): Promise<T[]> {
		return this.withStore(store, "readonly", (objectStore) => objectStore.getAll());
	}

	getAllByIndex<T>(store: IndexedDbStoreName, indexName: string, query?: IDBValidKey | IDBKeyRange): Promise<T[]> {
		return this.withStore(store, "readonly", (objectStore) => objectStore.index(indexName).getAll(query));
	}

	put<T extends object>(store: IndexedDbStoreName, value: T): Promise<IDBValidKey> {
		return this.withStore(store, "readwrite", (objectStore) => objectStore.put(value));
	}

	add<T extends object>(store: IndexedDbStoreName, value: T): Promise<number> {
		return this.withStore(store, "readwrite", (objectStore) => objectStore.add(value)).then((id) => id as number);
	}

	delete(store: IndexedDbStoreName, key: IDBValidKey): Promise<void> {
		return this.withStore(store, "readwrite", (objectStore) => objectStore.delete(key)).then(() => undefined);
	}
}
