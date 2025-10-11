import { ICardStructure } from "../interfaces/entities/ICardStructure";
import { TAppTheme } from "../types/TAppTheme";

export enum SettingsCodeEnum {
    USER_NAME = 'USER_NAME',
    DAY_LAYOUT = 'DAY_LAYOUT',
    DATE_FORMAT = 'DATE_FORMAT',
    THEME = 'THEME',
}

export type SettingsCodeValueMap = {
	[SettingsCodeEnum.USER_NAME]: string;
	[SettingsCodeEnum.DAY_LAYOUT]: ICardStructure[];
	[SettingsCodeEnum.DATE_FORMAT]: "HH:mm" | "hh:mm";
	[SettingsCodeEnum.THEME]: TAppTheme;
};

export function getNextTheme(theme: TAppTheme): TAppTheme {
    switch (theme) {
        case 'light':
            return 'dark';  
        case 'dark':
            return 'ambient';
        case 'ambient':
            return 'light';
    }
}