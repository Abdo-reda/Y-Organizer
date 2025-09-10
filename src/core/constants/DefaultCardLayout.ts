import NotesCard from "@/components/core/cards/NotesCard.vue";
import { ICardStructure } from "../interfaces/entities/ICardStructure";
import MonthlyCard from "@/components/core/cards/MonthlyCard.vue";
import GratitudeCard from "@/components/core/cards/GratitudeCard.vue";
import RememberCard from "@/components/core/cards/RememberCard.vue";

export const DEFAULT_CARD_LAYOUT: ICardStructure[] = [
  {
    component: NotesCard,
    height: 6,
    width: 4,
    col: 1,
    row: 1,
  },
  {
    component: MonthlyCard,
    height: 6,
    width: 4,
    col: 1,
    row: 5,
  },
  {
    component: RememberCard,
    height: 6,
    width: 4,
    col: 7,
    row: 9,
  },
  {
    component: GratitudeCard,
    height: 6,
    width: 4,
    col: 1,
    row: 9,
  },
];
