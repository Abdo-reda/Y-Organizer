import ActivityCard from "@/components/core/cards/ActivityCard.vue";
import DoodleCard from "@/components/core/cards/DoodleCard.vue";
import HabitCard from "@/components/core/cards/HabitCard.vue";
import NotesCard from "@/components/core/cards/NotesCard.vue";
import NowCard from "@/components/core/cards/NowCard.vue";
import RememberCard from "@/components/core/cards/RememberCard.vue";
import ScheduleCard from "@/components/core/cards/ScheduleCard.vue";
import TestCard from "@/components/core/cards/TestCard.vue";
import { type Component } from "vue";
import { DayCardEnum } from "../enums/dayCardEnum";

export const DayCardComponentMapper: Record<DayCardEnum, Component> = {
    [DayCardEnum.NOW_CARD]: NowCard,
    [DayCardEnum.NOTES_CARD]: NotesCard,
    [DayCardEnum.ACTIVITY_CARD]: ActivityCard,
    [DayCardEnum.DOODLE_CARD]: DoodleCard,
    [DayCardEnum.REMEMBER_CARD]: RememberCard,
    [DayCardEnum.SCHEDULE_CARD]: ScheduleCard,
    [DayCardEnum.HABIT_CARD]: HabitCard,
    // [DayCardEnum.GRATITUDE_CARD]: () => ,
    [DayCardEnum.TEST_CARD]: TestCard,
};