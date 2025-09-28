import ActivityCard from "@/components/core/cards/ActivityCard.vue";
import DoodleCard from "@/components/core/cards/DoodleCard.vue";
import HabitCard from "@/components/core/cards/HabitCard.vue";
import NotesCard from "@/components/core/cards/NotesCard.vue";
import NowCard from "@/components/core/cards/NowCard.vue";
import RememberCard from "@/components/core/cards/RememberCard.vue";
import ScheduleCard from "@/components/core/cards/ScheduleCard.vue";
import TestCard from "@/components/core/cards/TestCard.vue";
import { type Component } from "vue";

export enum DayCardEnum {
    NOW_CARD = 'now-card',
    NOTES_CARD = 'notes-card',
    ACTIVITY_CARD = 'activity-card',
    DOODLE_CARD = 'doodle-card',
    REMEMBER_CARD = 'remember-card',
    SCHEDULE_CARD = 'schedule-card',
    HABIT_CARD = 'habit-card',
    // GRATITUDE_CARD = 'gratitude-card',
    TEST_CARD = 'test-card',
}

export const DayCardComponentMapper: Record<DayCardEnum, Component> = {
    [DayCardEnum.NOW_CARD]: NowCard,
    [DayCardEnum.NOTES_CARD]: NotesCard,
    [DayCardEnum.ACTIVITY_CARD]: ActivityCard,
    [DayCardEnum.DOODLE_CARD]: DoodleCard,
    [DayCardEnum.REMEMBER_CARD]: RememberCard,
    [DayCardEnum.SCHEDULE_CARD]: ScheduleCard,
    [DayCardEnum.HABIT_CARD]: HabitCard,
    // [DayCardEnum.GRATITUDE_CARD]: () => import('@/components/core/cards/GratitudeCard.vue'),
    [DayCardEnum.TEST_CARD]: TestCard,
};