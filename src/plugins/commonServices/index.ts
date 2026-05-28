import { isTauri } from "@tauri-apps/api/core";
import { StorageServiceKey } from '@/core/constants/injectionKeys';
import { SqliteStroageService } from '@/core/services/sqliteStorageService';
import { WebStroageService } from '@/core/services/webStorageService';
import type { Plugin } from 'vue';

const storageService: Plugin = {
	async install(app) {
		const storageService = isTauri() ? new SqliteStroageService() : new WebStroageService();
		app.provide(StorageServiceKey, storageService);
		await storageService.init();
	}
};

export default storageService;
