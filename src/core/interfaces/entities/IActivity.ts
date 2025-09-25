import { ActivityStatusEnum } from "@/core/enums/activityStatusEnum";
import { LifeCategoryEnum } from "@/core/enums/lifeCategoryEnum";

export interface IActivity {
    name: string;
    description: string;
    categories: LifeCategoryEnum[];
    color: string;
    status: ActivityStatusEnum;
}