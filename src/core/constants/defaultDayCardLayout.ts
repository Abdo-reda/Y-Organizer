import { ICardStructure } from "../interfaces/entities/ICardStructure";
import { DayCardEnum } from "../enums/dayCardEnum";

export const DEFAULT_DAY_CARD_LAYOUT: ICardStructure[] = [
	{
        id: DayCardEnum.NOW_CARD, h: 6, w: 4, x: 0, y: 0,
	},
    {
        id: DayCardEnum.DOODLE_CARD, h: 6, w: 4, x: 0, y: 6,
    },
	{
        id: DayCardEnum.NOTES_CARD, h: 4, w: 3, x: 4, y: 0,
	},
	{
        id: DayCardEnum.MONTHLY_CARD, h: 4, w: 3, x: 7, y: 0,
	},
	{
        id: DayCardEnum.GRATITUDE_CARD, h: 4, w: 3, x: 4, y: 4,
	},
    {
        id: DayCardEnum.TASKS_CARD, h: 8, w: 3, x: 7, y: 4,
	},
    {
        id: DayCardEnum.ACTIVITY_CARD, h: 4, w: 3, x: 4, y: 8, 
    },
	{
        id: DayCardEnum.SCHEDULE_CARD, h: 12, w: 2, x: 10, y: 0,
	},
];
