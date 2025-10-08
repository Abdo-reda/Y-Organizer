import { useEventListener } from "@vueuse/core";
import { type MaybeRefOrGetter, ref, toValue } from "vue";

export function useMouseScroll(targetEl: MaybeRefOrGetter<HTMLElement | null | undefined>) {
	const isDragging = ref(false);
	const startY = ref(0);
	const scrollTop = ref(0);

	useEventListener(targetEl, "mousedown", startDrag);

	useEventListener(targetEl, "mousemove", onDragging);

	useEventListener(targetEl, "mouseleave", endDrag);

	useEventListener(targetEl, "mouseup", endDrag);

	function startDrag(event: MouseEvent) {
		isDragging.value = true;
		startY.value = event.pageY;
        const targetElValue = toValue(targetEl)
		scrollTop.value = targetElValue?.scrollTop ?? 0;
		event.preventDefault();
	}

	function onDragging(event: MouseEvent) {
        const targetElValue = toValue(targetEl)
		if (!isDragging.value || !targetElValue) return;

		const curY = event.pageY;
		const walk = (curY - startY.value) * 2;
		targetElValue.scrollTop = scrollTop.value - walk;
	}

	function endDrag() {
         isDragging.value = false
    }
}
