import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { TauriCommandsDataMap, TauriCommmandsEnum } from "@/core/enums/tauriCommandsEnum";
import { invoke, isTauri } from "@tauri-apps/api/core";
import { save, open } from "@tauri-apps/plugin-dialog";
import { inject } from "vue";

export default function useTauri() {
    const storageService = inject(StorageServiceKey)!;

	async function invokeCommand<T extends TauriCommmandsEnum>(command: T, data: TauriCommandsDataMap[T]) {
		if (!isTauri()) return;
		await invoke(command, data);
	}

	async function exportDatabase() {
		if (!isTauri()) return;
		const defaultPath = "y-backup.db";
		const savePath = await save({
			defaultPath: defaultPath,
			filters: [
				{
					name: "SQLite Database",
					extensions: ["db", "sqlite", "sqlite3"],
				},
			],
		});

        await storageService.close();
		if (savePath) await invokeCommand(TauriCommmandsEnum.EXPORT_DATABASE, { targetPath: savePath });
        await storageService.init();
	}

	async function importDatabase() {
		if (!isTauri()) return;

		const selectedPath = await open({
			multiple: false,
			filters: [
				{
					name: "SQLite Database",
					extensions: ["db", "sqlite", "sqlite3"],
				},
			],
		});

        await storageService.close();
		if (selectedPath) await invokeCommand(TauriCommmandsEnum.IMPORT_DATABASE, { sourcePath: selectedPath });
        window.location.reload();
	}

	return {
		invokeCommand,
		exportDatabase,
        importDatabase,
	};
}
