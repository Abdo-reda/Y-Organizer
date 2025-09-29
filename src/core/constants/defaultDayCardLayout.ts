import { ICardStructure } from "../interfaces/entities/ICardStructure";
// import FocusCard from "@/components/core/cards/FocusCard.vue";
// import GratitudeCard from "@/components/core/cards/GratitudeCard.vue";
// import HabitCard from "@/components/core/cards/HabitCard.vue";
import { DayCardEnum } from "../enums/dayCardEnum";
// import TestCard from "@/components/core/cards/TestCard.vue";

export const DEFAULT_DAY_CARD_LAYOUT: ICardStructure[] = [
	{
        id: DayCardEnum.NOW_CARD,
		h: 6,
		w: 4,
		x: 0,
		y: 0,
	},
	{
        id: DayCardEnum.NOTES_CARD,
		h: 6,
		w: 3,
		x: 4,
		y: 0,
	},
	{
        id: DayCardEnum.ACTIVITY_CARD,
		h: 6,
		w: 3,
		x: 7,
		y: 0,
	},
	{
        id: DayCardEnum.DOODLE_CARD,
		h: 6,
		w: 4,
		x: 0,
		y: 6,
	},
	{
        id: DayCardEnum.REMEMBER_CARD,
		h: 6,
		w: 3,
		x: 4,
		y: 6,
	},
	// {
	// 	id: DayCardEnum.HABIT_CARD,
	// 	h: 4,
	// 	w: 2,
	// 	x: 7,
	// 	y: 6,
	// },
	// {
	// 	component: GratitudeCard,
	// 	height: 6,
	// 	width: 3,
	// 	col: 1,
	// 	row: 1,
	// },
	{
        id: DayCardEnum.SCHEDULE_CARD,
		h: 12,
		w: 2,
		x: 10,
		y: 0,
	},
	// {
	// 	component: FocusCard,
	// 	height: 6,
	// 	width: 2,
	// 	col: 1,
	// 	row: 1,
	// },
	// {
	// 	component: MonthlyCard,
	// 	height: 4,
	// 	width: 4,
	// 	col: 1,
	// 	row: 5,
	// },
	// {
	// 	component: NotesCard,
	// 	height: 4,
	// 	width: 4,
	// 	col: 1,
	// 	row: 1,
	// },
	// {
	// 	component: GratitudeCard,
	// 	height: 4,
	// 	width: 3,
	// 	col: 1,
	// 	row: 9,
	// },
	// {
	// 	component: RememberCard,
	// 	height: 4,
	// 	width: 4,
	// 	col: 7,
	// 	row: 9,
	// },
];
