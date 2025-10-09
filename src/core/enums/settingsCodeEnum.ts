import { ICardStructure } from "../interfaces/entities/ICardStructure";
import { TAppTheme } from "../types/TAppTheme";

export enum SettingsCodeEnum {
    DAY_LAYOUT = 'DAY_LAYOUT',
    DATE_FORMAT = 'DATE_FORMAT',
    THEME = 'THEME',
}

export type SettingsCodeValueMap = {
	[SettingsCodeEnum.DAY_LAYOUT]: ICardStructure[];
	[SettingsCodeEnum.DATE_FORMAT]: "HH:mm" | "hh:mm";
	[SettingsCodeEnum.THEME]: TAppTheme;
};


export function getNextTheme(theme: TAppTheme): TAppTheme {
    switch (theme) {
        case 'auto':
            return 'light';
        case 'light':
            return 'dark';  
        case 'dark':
            return 'ambient';
        case 'ambient':
            return 'auto';
    }
}