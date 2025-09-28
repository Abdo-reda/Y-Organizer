import { StorageServiceKey } from "@/core/constants/injectionKeys";
import { inject } from "vue";
import { LoggingService } from "@/core/services/loggingService";
import { SettingsCodeEnum, SettingsCodeValueMap } from "@/core/enums/settingsCodeEnum";
import { DEFAULT_DAY_CARD_LAYOUT } from "@/core/constants/defaultDayCardLayout";
import { ICardStructure } from "@/core/interfaces/entities/ICardStructure";

export default function useSettings() {
    const storageService = inject(StorageServiceKey)!;

    //TODO: handle fetching of settings better, I guess fetch all of them?

    function fetchSettings(code: SettingsCodeEnum) {
        LoggingService.log("fetching settings...", code);
        return storageService.getSetting(code);
    }

    async function fetchCardLayout(): Promise<ICardStructure[]> {
        return (await fetchSettings(SettingsCodeEnum.DAY_LAYOUT)) ?? DEFAULT_DAY_CARD_LAYOUT;
    }

    function updateSetting<T extends SettingsCodeEnum>(code: T, value: SettingsCodeValueMap[T]|null) {
        LoggingService.log("updating settings...", code, value);
        storageService.updateSetting(code, value);
    }

    return {
        fetchCardLayout,
        updateSetting
    };
}
