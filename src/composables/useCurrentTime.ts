import { ref, onMounted, onUnmounted } from "vue";
import { DateTime } from "luxon";

export function useCurrentTime() {
  const currentTime = ref(DateTime.now().toFormat("hh:mm"));
  let intervalId: number | undefined;

  onMounted(() => {
    const updateTime = () => {
      currentTime.value = DateTime.now().toFormat("hh:mm");
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

  return currentTime;
}
