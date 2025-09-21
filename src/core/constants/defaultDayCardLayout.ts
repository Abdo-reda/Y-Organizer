import { ICardStructure } from "../interfaces/entities/ICardStructure";
import NotesCard from "@/components/core/cards/NotesCard.vue";
import NowCard from "@/components/core/cards/NowCard.vue";
import DoodleCard from "@/components/core/cards/DoodleCard.vue";
import FocusCard from "@/components/core/cards/FocusCard.vue";
import GratitudeCard from "@/components/core/cards/GratitudeCard.vue";
import HabitCard from "@/components/core/cards/HabitCard.vue";
import ScheduleCard from "@/components/core/cards/ScheduleCard.vue";

export const DEFAULT_DAY_CARD_LAYOUT: ICardStructure[] = [
	{
		component: NowCard,
		height: 6,
		width: 4,
		col: 1,
		row: 1,
	},
	{
		component: NotesCard,
		height: 6,
		width: 3,
		col: 1,
		row: 1,
	},
	{
		component: DoodleCard,
		height: 6,
		width: 3,
		col: 1,
		row: 1,
	},
	{
		component: ScheduleCard,
		height: 12,
		width: 2,
		col: 1,
		row: 1,
	},
	// {
	// 	component: HabitCard,
	// 	height: 4,
	// 	width: 2,
	// 	col: 1,
	// 	row: 1,
	// },
	// {
	// 	component: GratitudeCard,
	// 	height: 6,
	// 	width: 4,
	// 	col: 1,
	// 	row: 1,
	// },
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
