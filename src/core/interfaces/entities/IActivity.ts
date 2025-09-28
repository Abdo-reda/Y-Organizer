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

export function DEFAULT_ACTIVITY(): Readonly<IActivity> {
	return { name: "", description: "", color: SKY, categories: [], status: ActivityStatusEnum.ACTIVE };
}
