import { useEventListener } from "@vueuse/core";
import { ShallowRef } from "vue";

type TShortcutCallbacks = {
	onDoubleClick?: (e: MouseEvent) => void;
	onCtrlClick?: (e: MouseEvent) => void;
	onAltClick?: (e: MouseEvent) => void;
	onPrimaryClick?: (e: MouseEvent) => void;
	onSecondaryClick?: (e: MouseEvent) => void;
	onMiddleMouseClick?: (e: MouseEvent) => void;
};

export function useMouseShortcuts(targetEl: Readonly<ShallowRef<HTMLElement | null>>, callbacks: TShortcutCallbacks) {
	if (callbacks.onDoubleClick) {
		useEventListener(targetEl, "dblclick", (event) => {
			callbacks.onDoubleClick?.(event);
		});
	}

	useEventListener(targetEl, "contextmenu", (event) => {
		event.preventDefault();
	});

	useEventListener(targetEl, "mousedown", (event) => {
		if (event.button === 2) {
			event.preventDefault();
		}

		if (event.ctrlKey) {
			callbacks.onCtrlClick?.(event);
		} else if (event.altKey) {
			callbacks.onAltClick?.(event);
		} else {
			switch (event.button) {
				case 0:
					callbacks.onPrimaryClick?.(event);
					break;
				case 1:
					callbacks.onMiddleMouseClick?.(event);
					break;
				case 2:
					callbacks.onSecondaryClick?.(event);
					break;
			}
		}
	});
}
