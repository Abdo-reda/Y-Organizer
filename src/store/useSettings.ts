import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, reactive, ref } from "vue";
import { LoggingService } from "@/core/services/loggingService";
import { SettingsCodeEnum, SettingsCodeValueMap } from "@/core/enums/settingsCodeEnum";
import { type ISetting } from "@/core/interfaces/entities/ISetting";
import { DEFAULT_SETTINGS } from "@/core/constants/defaultSettings";
import { TAppSettings } from "@/core/types/TAppSettings";
import { useStorage } from "@vueuse/core";

const appView = useStorage<'welcome'|'week'|'day'>('app-view', 'welcome', sessionStorage) 
const isGridLocked = ref(true);
const settings = reactive<TAppSettings>(DEFAULT_SETTINGS);
const settingsLoading = ref(false);

export default function useSettings() {
	const storageService = inject(StorageServiceKey)!;

	async function fetchSettings() {
        settingsLoading.value = true;
		LoggingService.log("fetching settings...");
        mapToAppSettings(await storageService.getSettings());
        settingsLoading.value = false;
	}

	async function updateSetting<T extends SettingsCodeEnum>(code: T, value: SettingsCodeValueMap[T]) {
		LoggingService.log("updating settings...", code, value);
		await storageService.updateSetting(code, value);
		setSetting({code, value});
	}

	return {
		settings,
        settingsLoading,
		isGridLocked,
        appView,
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
