import { ref, computed } from "vue";
import { DateTime } from "luxon";

const currentTime = ref(DateTime.now());
const formattedTime = computed(() => currentTime.value.toFormat("hh:mm"));
const dayPercentage = computed(() => (currentTime.value.hour + currentTime.value.minute / 60) / 24);

export function useCurrentTime() {
	let intervalId: number | undefined;

    const temp = DateTime.now().plus({day: 2, hour: 2, minutes: 4});

    // const blah = temp.toISOTime({includeOffset: false, precision: 'minute'});
    // const after = DateTime.fromISO("19:14");
    // console.log("---- temp", blah , after.toISOTime(), temp.)

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
