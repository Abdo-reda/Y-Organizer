<script setup lang="ts">
import FunctionCard from "@/components/common/FunctionCard.vue";
import { Button } from "@/components/ui/button";
import useDaySessions from "@/store/useDaySessions";
import useDayState from "@/store/useDayState";
import useSettings from "@/store/useSettings";
import { FocusIcon, PictureInPictureIcon } from "lucide-vue-next";
import { DateTime } from "luxon";
import { computed } from "vue";
import NowCardView from "./subcards/NowCardView.vue";
import SummaryCardView from "./subcards/SummaryCardView.vue";
import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

const { appView } = useSettings();
const { selectedDay } = useDayState();
const { currentSession } = useDaySessions();

const isToday = computed(() => selectedDay.value.hasSame(DateTime.now(), "day"));
const appWindow = isTauri() ? getCurrentWindow() : undefined;

function togglePopup() {
	if (!appWindow) return;

	const webview = new WebviewWindow("now-popup", {
		url: "/now-popup", 
		title: "Y-Organizer Popup",
		width: 400,
		height: 300,
		alwaysOnTop: true,
		decorations: false,
		transparent: true,
	});

	// Helpful for debugging why it "didn't work"
	webview.once("tauri://error", (e) => {
		console.error("Window failed to open:", e);
	});
	// const allWindows = await getAllWebviewWindows();
	// const existingWindow = allWindows.find(w => w.label === label);
	// console.log("--- i am here?");
	// const webview = new Webview(appWindow, "theUniqueLabel", {
	// 	url: "path/to/page.html",
	// 	x: 0,
	// 	y: 0,
	// 	width: 800,
	// 	height: 600,
	// });

	// // const webview = new Webview(appWindow, "theUniqueLabel", {
	// // 	url: "https://github.com/tauri-apps/tauri",

	// // 	// create a webview with specific logical position and size
	// // 	x: 0,
	// // 	y: 0,
	// // 	width: 800,
	// // 	height: 600,
	// // });

	// webview.once("tauri://created", function () {
	// 	// webview successfully created
	// });
	// webview.once("tauri://error", function (e) {
	// 	// an error happened creating the webview
	// 	console.log('-- error?', e)
	// });
}
</script>

<template>
	<FunctionCard :title="isToday ? 'Now' : 'Summary'" :highlight="!!currentSession">
		<template #header-right-actions>
			<div v-if="isToday" class="flex justify-end gap-1">
				<Button @click="togglePopup" variant="ghost" size="icon">
					<PictureInPictureIcon />
				</Button>
				<Button @click="appView = 'now'" variant="ghost" size="icon">
					<FocusIcon />
				</Button>
			</div>
		</template>
		<template #default>
			<div class="h-full" v-auto-animate>
				<template v-if="isToday">
					<NowCardView />
				</template>
				<template v-else>
					<SummaryCardView />
				</template>
			</div>
		</template>
	</FunctionCard>
</template>
