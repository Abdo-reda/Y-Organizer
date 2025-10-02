import { SettingsCodeEnum, type SettingsCodeValueMap } from "../enums/settingsCodeEnum";

export type TAppSettings = {
    [K in SettingsCodeEnum]: SettingsCodeValueMap[K];
};