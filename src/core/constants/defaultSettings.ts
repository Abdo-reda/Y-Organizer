import { SettingsCodeEnum } from "../enums/settingsCodeEnum";
import { type TAppSettings } from "../types/TAppSettings";
import { DEFAULT_DAY_CARD_LAYOUT } from "./defaultDayCardLayout";

export const DEFAULT_SETTINGS: TAppSettings = {
	[SettingsCodeEnum.USER_NAME]: "",
	[SettingsCodeEnum.DAY_LAYOUT]: DEFAULT_DAY_CARD_LAYOUT,
	[SettingsCodeEnum.DATE_FORMAT]: "hh:mm",
	[SettingsCodeEnum.THEME]: "ambient",
}
