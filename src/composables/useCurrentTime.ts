import { ref, onMounted, onUnmounted, computed } from "vue";
import { DateTime } from "luxon";

export function useCurrentTime() {
	const currentTime = ref(DateTime.now());
	const formattedTime = computed(() => currentTime.value.toFormat("hh:mm"));
	const dayPercentage = computed(() => (currentTime.value.hour + currentTime.value.minute / 60) / 24);
	let intervalId: number | undefined;

	onMounted(() => {
		const updateTime = () => {
			currentTime.value = DateTime.now();
		};

		const now = DateTime.now();
		const msUntilNextMinute = 60000 - (now.second * 1000 + now.millisecond);

		setTimeout(() => {
			updateTime();
			intervalId = setInterval(updateTime, 60000);
		}, msUntilNextMinute);
	});

	onUnmounted(() => {
		clearInterval(intervalId);
	});

	return {
		currentTime,
		formattedTime,
        dayPercentage
	};
}
