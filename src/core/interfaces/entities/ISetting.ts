import { SettingsCodeEnum, SettingsCodeValueMap } from "@/core/enums/settingsCodeEnum";

export interface ISetting<T extends SettingsCodeEnum> {
    code: T;
    value: SettingsCodeValueMap[T];
}