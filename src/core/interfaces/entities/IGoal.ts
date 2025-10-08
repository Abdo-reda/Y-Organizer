import { GoalStatusEnum } from "@/core/enums/goalStatusEnum";
import { DateTime } from "luxon";

export interface IGoal {
    id?: number;
    title: string;
    description: string;
    activity: string;
    points: number;
    totalPoints: number;
    month: string;
    status: GoalStatusEnum;
}

export function getDefaultGoal(): IGoal {
    return {
        title: '',
        description: '',
        activity: '',
        points: 0,
        totalPoints: 100,
        month: DateTime.now().toISODate({precision: 'month'}),
        status: GoalStatusEnum.ACTIVE,
    }
}