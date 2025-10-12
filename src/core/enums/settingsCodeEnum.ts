import { ICardStructure } from "../interfaces/entities/ICardStructure";
import { TAppTheme } from "../types/TAppTheme";

export enum SettingsCodeEnum {
    USER_NAME = 'USER_NAME',
    DAY_LAYOUT = 'DAY_LAYOUT',
    DATE_FORMAT = 'DATE_FORMAT',
    THEME = 'THEME',
    FONT_SIZE = 'FONT_SIZE'
}

export type SettingsCodeValueMap = {
	[SettingsCodeEnum.USER_NAME]: string;
	[SettingsCodeEnum.DAY_LAYOUT]: ICardStructure[];
	[SettingsCodeEnum.DATE_FORMAT]: "HH:mm" | "hh:mm";
	[SettingsCodeEnum.THEME]: TAppTheme;
	[SettingsCodeEnum.FONT_SIZE]: 'small' | 'medium' | 'large';
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

export function getFontSize(size: 'small' | 'medium' | 'large'): number {
    switch (size) {
        case 'small':
            return 70;  
        case 'medium':
            return 80;
        case 'large':
            return 100;
    }
}