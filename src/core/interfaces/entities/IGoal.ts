import { GoalStatusEnum } from "@/core/enums/goalStatusEnum";

export interface IGoal {
    id?: number;
    title: string;
    description: string;
    activity: string;
    points: number;
    totalPoints: number;
    completedDay: string;
    status: GoalStatusEnum;
}

export function getDefaultGoal(): IGoal {
    return {
        title: '',
        description: '',
        activity: '',
        points: 0,
        totalPoints: 100,
        completedDay: '',
        status: GoalStatusEnum.ACTIVE,
    }
}