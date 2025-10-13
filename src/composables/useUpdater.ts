import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { ref } from "vue";
import { LoggingService } from "@/core/services/loggingService";
import { isTauri } from "@tauri-apps/api/core";

export default function useUpdater() {

	// TODO: sonnets & toasts

	let currentUpdate: Update | null;
	const updaterProgress = ref(0);
    const checkingUpdates = ref(false);
    const checkedWithUpdates = ref<boolean|null>(null);
    const newVersion = ref();

    function resetUpdaterState() {
        updaterProgress.value = 0;
        checkingUpdates.value = false;
        checkedWithUpdates.value = null;
        newVersion.value = undefined;
    }

	async function checkLatest() {
        if (!isTauri()) return;
        resetUpdaterState();
        checkingUpdates.value = true;
		currentUpdate = await check();
        checkingUpdates.value = false;
        checkedWithUpdates.value = !!currentUpdate;
        newVersion.value = currentUpdate?.version;
        console.log("--- current update", currentUpdate)
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
                    updaterProgress.value = downloadedBytes / totalBytes;
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
        checkingUpdates,
        checkedWithUpdates,
        newVersion,
        updaterProgress,
        resetUpdaterState,
		checkLatest,
		downloadAndInstall,
		relaunchApp,
	};
}
