import { STONE } from "@/core/constants/activityColors";
import { ActivityStatusEnum } from "@/core/enums/activityStatusEnum";
import { LifeCategoryEnum } from "@/core/enums/lifeCategoryEnum";

export interface IActivity {
	name: string;
	description: string;
	categories: LifeCategoryEnum[];
	color: string;
	status: ActivityStatusEnum;
}

export function generateDefaultActivity(): Readonly<IActivity> {
	return { name: "", description: "", color: STONE, categories: [], status: ActivityStatusEnum.ACTIVE };
}

export function cloneActivity(activity: IActivity): IActivity {
    return {
        ...activity,
        categories: [...activity.categories]
    };
}
