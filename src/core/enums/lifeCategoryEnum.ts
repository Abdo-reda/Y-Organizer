import { BabyIcon, DumbbellIcon, EarthIcon, GoalIcon, HeartIcon, HouseHeartIcon, LeafIcon, MessagesSquareIcon, PizzaIcon, SproutIcon } from "lucide-vue-next";
import { type FunctionalComponent } from "vue";
import { AMBER, EMERALD, GREEN, LIME, PINK, RED, SKY, STONE, VIOLET, YELLOW } from "../constants/activityColors";

export enum LifeCategoryEnum {
	FAMILY = "Family",
	PARTNERSHIP = "Partnership",
	PARENTING = "Parenting",
	CAREER = "Career",
	FITNESS = "Fitness",
	PERSONAL_GROWTH = "Personal Growth",
	RECREATION = "Recreation",
	SPIRITUALITY = "Spirituality",
	SOCIAL = "Social",
	COMMUNITY = "Community",
}

//TODO: maybe later add icons for each category & color
export const LifeCategoryIconMapper: Record<LifeCategoryEnum, FunctionalComponent> = {
	[LifeCategoryEnum.FAMILY]: HouseHeartIcon,
	[LifeCategoryEnum.PARTNERSHIP]: HeartIcon,
	[LifeCategoryEnum.PARENTING]: BabyIcon,
	[LifeCategoryEnum.CAREER]: GoalIcon,
	[LifeCategoryEnum.PERSONAL_GROWTH]: SproutIcon,
	[LifeCategoryEnum.RECREATION]: PizzaIcon,
	[LifeCategoryEnum.SPIRITUALITY]: LeafIcon,
	[LifeCategoryEnum.SOCIAL]: MessagesSquareIcon,
	[LifeCategoryEnum.COMMUNITY]: EarthIcon,
	[LifeCategoryEnum.FITNESS]: DumbbellIcon,
};

export const LifeCategoryColorMapper: Record<LifeCategoryEnum, string> = {
    [LifeCategoryEnum.FAMILY]: AMBER,
    [LifeCategoryEnum.PARTNERSHIP]: RED,
    [LifeCategoryEnum.PARENTING]: YELLOW,
    [LifeCategoryEnum.CAREER]: STONE,
    [LifeCategoryEnum.PERSONAL_GROWTH]: LIME,
    [LifeCategoryEnum.RECREATION]: SKY,
    [LifeCategoryEnum.SPIRITUALITY]: EMERALD,
    [LifeCategoryEnum.SOCIAL]: VIOLET,
    [LifeCategoryEnum.COMMUNITY]: GREEN,
    [LifeCategoryEnum.FITNESS]: PINK, 
};
