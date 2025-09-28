import { type DayCardEnum } from "@/core/enums/dayCardEnum";

export interface ICardStructure {
    id: DayCardEnum;
	w: number;
	h: number;
	y: number;
	x: number;
}