import { SettingsCodeEnum, SettingsCodeValueMap } from "../enums/settingsCodeEnum";
import { DEFAULT_DAY_CARD_LAYOUT } from "./defaultDayCardLayout";

type DefaultSettingsType<T extends SettingsCodeEnum> = {
	[key in T]: SettingsCodeValueMap[T];
};

export const DEFAULT_SETTINGS: DefaultSettingsType<SettingsCodeEnum> = {
	[SettingsCodeEnum.DAY_LAYOUT]: DEFAULT_DAY_CARD_LAYOUT
}