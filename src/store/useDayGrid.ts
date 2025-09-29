import { computed, ref } from "vue";
import { SettingsCodeEnum } from "@/core/enums/settingsCodeEnum";
import { ICardStructure } from "@/core/interfaces/entities/ICardStructure";
import useSettings from "./useSettings";

const isGridLocked = ref(true);

export default function useDayGrid() {
	const {fetchSettingValue, updateSetting} = useSettings();

	const gridLayout = computed(() => fetchSettingValue(SettingsCodeEnum.DAY_LAYOUT));

	function updateGridLayout(newLayout: ICardStructure[]) {
		updateSetting(SettingsCodeEnum.DAY_LAYOUT, newLayout);
	}

	return {
		gridLayout,
		isGridLocked,
		updateGridLayout
	};
}
