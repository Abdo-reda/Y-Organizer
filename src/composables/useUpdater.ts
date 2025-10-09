import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { ref } from "vue";
import { LoggingService } from "@/core/services/loggingService";

export default function useUpdater() {

	// TODO: sonnets & toasts

	let currentUpdate: Update | null;
	const progress = ref(0);

	async function checkLatest(): Promise<boolean> {
        progress.value = 0;
		currentUpdate = await check();
		return !!currentUpdate;
	}

	function downloadAndInstall() {
		if (!currentUpdate) return;
		let downloadedBytes = 0;
		let totalBytes = 0;
		// alternatively we could also call update.download() and update.install() separately
		currentUpdate.downloadAndInstall((event) => {
			switch (event.event) {
				case "Started":
					totalBytes = event.data.contentLength ?? 1;
					LoggingService.log(`started downloading ${event.data.contentLength} bytes`);
					break;
				case "Progress":
					downloadedBytes += event.data.chunkLength;
                    progress.value = downloadedBytes / totalBytes;
					LoggingService.log(`downloaded ${downloadedBytes} from ${totalBytes}`);
					break;
				case "Finished":
					LoggingService.log("download finished");
					break;
			}
		});
	}

	function relaunchApp() {
        relaunch();
    }

	return {
		checkLatest,
		downloadAndInstall,
		relaunchApp,
	};
}
