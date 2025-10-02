import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, reactive, ref } from "vue";
import { LoggingService } from "@/core/services/loggingService";
import { SettingsCodeEnum, SettingsCodeValueMap } from "@/core/enums/settingsCodeEnum";
import { type ISetting } from "@/core/interfaces/entities/ISetting";
import { DEFAULT_SETTINGS } from "@/core/constants/defaultSettings";
import { TAppSettings } from "@/core/types/TAppSettings";

const isGridLocked = ref(true);
const settings = reactive<TAppSettings>(DEFAULT_SETTINGS);

export default function useSettings() {
	const storageService = inject(StorageServiceKey)!;

	async function fetchSettings() {
		LoggingService.log("fetching settings...");
		mapToAppSettings(await storageService.getSettings());
	}

	function updateSetting<T extends SettingsCodeEnum>(code: T, value: SettingsCodeValueMap[T] | null) {
		LoggingService.log("updating settings...", code, value);
		storageService.updateSetting(code, value);
	}

	return {
		settings,
		isGridLocked,
		fetchSettings,
		updateSetting,
	};
}

function mapToAppSettings(existingSettings: ISetting<SettingsCodeEnum>[]) {
	existingSettings.forEach((s) => setSetting(s));
}

function setSetting<T extends SettingsCodeEnum>(s: ISetting<T>): void {
	if (s.value) settings[s.code] = s.value;
}
