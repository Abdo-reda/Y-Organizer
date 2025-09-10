import NotesCard from "@/components/core/cards/NotesCard.vue";
import { ICardStructure } from "../interfaces/entities/ICardStructure";
import MonthlyCard from "@/components/core/cards/MonthlyCard.vue";

export const DEFAULT_CARD_LAYOUT: ICardStructure[] = [
	{
		component: NotesCard,
		height: 6,
		width: 4,
		col: 1,
		row: 1
	},
	{
		component: MonthlyCard,
		height: 6,
		width: 4,
		col: 1,
		row: 5
	},
] 