import { useEventListener } from "@vueuse/core";
import { ref, ShallowRef } from "vue";

export function useMouseScroll(targetEl: Readonly<ShallowRef<HTMLElement | null>>) {
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
		scrollTop.value = targetEl.value?.scrollTop ?? 0;
		event.preventDefault();
	}

	function onDragging(event: MouseEvent) {
		if (!isDragging.value || !targetEl.value) return;

		const curY = event.pageY;
		const walk = (curY - startY.value) * 2;
		targetEl.value.scrollTop = scrollTop.value - walk;
	}

	function endDrag() {
         isDragging.value = false
    }
}
