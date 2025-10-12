import { LifeCategoryEnum } from "@/core/enums/lifeCategoryEnum";
import { type DateTime } from "luxon";

export interface IGratitude {
    id?: number;
    title: string;
    highlights: number[];
    category: LifeCategoryEnum | null;
    day: string;
}

export function getDefaultGratitude(day: DateTime<true>): IGratitude {
    return {
        title: '',
        highlights: [],
        category: null,
        day: day.toISODate(),
    }
}

export function cloneGratitude(gratitude: IGratitude): IGratitude {
    return {
        ...gratitude,
        highlights: [...gratitude.highlights]
    };
}