import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject, reactive } from "vue";
import { LoggingService } from "@/core/services/loggingService";
import { SettingsCodeEnum, SettingsCodeValueMap } from "@/core/enums/settingsCodeEnum";
import { ISetting } from "@/core/interfaces/entities/ISetting";
import { DEFAULT_SETTINGS } from "@/core/constants/defaultSettings";

const settings = reactive<ISetting<SettingsCodeEnum>[]>([])

export default function useSettings() {
    const storageService = inject(StorageServiceKey)!;

    async function fetchSettings() {
        LoggingService.log("fetching settings...");
        Object.assign(settings, await storageService.getSettings());
    }

    function fetchSettingValue<T extends SettingsCodeEnum>(code: T): SettingsCodeValueMap[T] {
        return settings.find(s => s.code === code)?.value ?? DEFAULT_SETTINGS[code];
    }

    function updateSetting<T extends SettingsCodeEnum>(code: T, value: SettingsCodeValueMap[T]|null) {
        LoggingService.log("updating settings...", code, value);
        storageService.updateSetting(code, value);
    }

    return {
        settings,
        fetchSettings,
        fetchSettingValue,
        updateSetting
    };
}
