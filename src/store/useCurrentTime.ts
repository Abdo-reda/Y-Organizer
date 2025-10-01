import { ref, computed } from "vue";
import { DateTime } from "luxon";

const currentTime = ref(DateTime.now());
const formattedTime = computed(() => currentTime.value.toFormat("hh:mm"));
const dayPercentage = computed(() => (currentTime.value.hour + currentTime.value.minute / 60) / 24);

export function useCurrentTime() {
	let intervalId: number | undefined;

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
