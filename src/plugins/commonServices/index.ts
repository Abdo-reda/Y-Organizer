import { isTauri } from "@tauri-apps/api/core";
import { StorageServiceKey } from '@/core/constants/injectionKeys';
import { NullStroageService } from '@/core/services/nullStorageService';
import { SqliteStroageService } from '@/core/services/sqliteStorageService';
import type { Plugin } from 'vue';

const storageService: Plugin = {
	async install(app) {
		const storageService = (isTauri()) ? new SqliteStroageService() : new NullStroageService();
		app.provide(StorageServiceKey, storageService);
		await storageService.init();
	}
};

export default storageService;
