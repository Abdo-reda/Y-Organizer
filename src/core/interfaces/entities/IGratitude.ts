import { LifeCategoryEnum } from "@/core/enums/lifeCategoryEnum";

export interface IGratitude {
    id?: number;
    title: string;
    description: string;
    highlights: number[];
    category: LifeCategoryEnum;
    day: string;
}