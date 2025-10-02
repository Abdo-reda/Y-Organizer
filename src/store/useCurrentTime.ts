import { ref, computed } from "vue";
import { DateTime } from "luxon";
import useSettings from "./useSettings";

const currentTime = ref(DateTime.now());
const dayPercentage = computed(() => (currentTime.value.hour + currentTime.value.minute / 60) / 24);

export function useCurrentTime() {
    let intervalId: number | undefined;
    const { settings } = useSettings();
    const formattedTime = computed(() => currentTime.value.toFormat(settings.DATE_FORMAT));

    function init() {
		const updateTime = () => {
			currentTime.value = DateTime.now();
		};

		const now = DateTime.now();
		const msUntilNextMinute = 60000 - (now.second * 1000 + now.millisecond);

		setTimeout(() => {
			updateTime();
			intervalId = setInterval(updateTime, 60000);
		}, msUntilNextMinute);
    }

    function clean() {
        clearInterval(intervalId);
    }

	return {
		currentTime,
		formattedTime,
        dayPercentage,
        init,
        clean
	};
}
