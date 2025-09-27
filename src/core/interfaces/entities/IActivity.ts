import { SKY } from "@/core/constants/activityColors";
import { ActivityStatusEnum } from "@/core/enums/activityStatusEnum";
import { LifeCategoryEnum } from "@/core/enums/lifeCategoryEnum";

export interface IActivity {
    name: string;
    description: string;
    categories: LifeCategoryEnum[];
    color: string;
    status: ActivityStatusEnum;
}

export const DEFAULT_ACTIVITY: Readonly<IActivity> = {
    name: '',
    description: '',
    color: SKY,
    categories: [],
    status: ActivityStatusEnum.ACTIVE,
}