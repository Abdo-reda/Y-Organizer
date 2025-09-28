import { ICardStructure } from "../interfaces/entities/ICardStructure";

export enum SettingsCodeEnum {
    DAY_LAYOUT = 'DAY_LAYOUT',
}

export type SettingsCodeValueMap = {
	[SettingsCodeEnum.DAY_LAYOUT]: ICardStructure[];
};
