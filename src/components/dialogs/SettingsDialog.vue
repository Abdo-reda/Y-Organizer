<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SettingsIcon, PaletteIcon, DatabaseIcon, DownloadIcon, UploadIcon, RefreshCwIcon } from "lucide-vue-next";
import { ref } from "vue";
import { Input } from "../ui/input";
import SettingSection from "../common/SettingSection.vue";
import useSettings from "@/store/useSettings";
import useUpdater from "@/composables/useUpdater";
import { SettingsCodeEnum } from "@/core/enums/settingsCodeEnum";
import useTauri from "@/composables/useTauri";

const settingCatogories = [
	{ id: "general", label: "General", icon: SettingsIcon },
	{ id: "appearance", label: "Appearance", icon: PaletteIcon },
	{ id: "data", label: "Data & Backup", icon: DatabaseIcon },
	// { id: 'notifications', label: 'Notifications', icon: BellIcon },
];

const { exportDatabase, importDatabase } = useTauri();
const { settings, updateSetting } = useSettings();
const { resetUpdaterState, checkLatest, downloadAndInstall, checkingUpdates, checkedWithUpdates, newVersion, updaterProgress } = useUpdater();
const activeCategory = ref("general");

function saveSettings(code: SettingsCodeEnum) {
	updateSetting(code, settings[code]);
}

// TODO: sonnets!
function handleExportData() {
	exportDatabase();
}

function handleImportData() {
	importDatabase();
}

function checkForUpdates() {
	checkLatest();
}

function download() {
	downloadAndInstall();
}
</script>

<template>
	<DialogContent class="gap-0 p-0" @open-auto-focus.prevent="resetUpdaterState()">
		<DialogHeader class="p-4 border-b">
			<DialogTitle>Settings</DialogTitle>
			<DialogDescription>Manage your application preferences and settings</DialogDescription>
		</DialogHeader>

		<div class="flex flex-1 overflow-hidden min-w-0">
			<!-- Sidebar -->
			<div class="border-r bg-muted/30 p-2 flex flex-col gap-1 rounded-tr-lg">
				<button
					v-for="category in settingCatogories"
					:key="category.id"
					@click="activeCategory = category.id"
					class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors"
					:class="{
						'bg-background text-foreground shadow-sm': activeCategory === category.id,
						'text-muted-foreground hover:text-foreground hover:bg-background/50': activeCategory !== category.id,
					}"
				>
					<component :is="category.icon" class="size-4" />
					{{ category.label }}
				</button>
			</div>
			<!-- Content -->
			<div class="flex-1 flex flex-col px-6 py-4 h-96">
				<div class="flex-1">
					<SettingSection v-if="activeCategory === 'general'" title="General Settings">
						<div class="flex items-start gap-4 justify-between">
							<div class="flex-2">
								<Label for="user_name">User Name</Label>
								<p class="my-0.5 text-xs text-muted-foreground/75">Welcome page user name</p>
							</div>
							<Input name="user_name" v-model="settings.USER_NAME" class="flex-1" @update:model-value="saveSettings(SettingsCodeEnum.USER_NAME)" />
						</div>
						<div class="flex items-start gap-4 justify-between">
							<div class="flex-2">
								<Label>Updates</Label>
								<p class="my-0.5 text-xs text-muted-foreground/75">Check for updates</p>
							</div>
							<Button class="flex-1" variant="outline" size="sm" @click="checkForUpdates">
								<RefreshCwIcon class="size-4" :class="{ 'animate-spin': checkingUpdates }" />
								<p>Check</p>
							</Button>
						</div>
                        <TransitionGroup name="auto" tag="ul" class="relative">
							<li v-if="checkedWithUpdates !== null" class="border bg-muted flex flex-col gap-2 p-4 w-full rounded-md" key="update">
								<template v-if="checkedWithUpdates">
									<p class="text-sm">
										New Update Available <span class="font-semibold"> v{{ newVersion }} </span>
									</p>
									<Button class="flex-1 p-1" variant="outline" size="sm" @click="download">
										<DownloadIcon class="size-4" :class="{ 'animate-spin': checkingUpdates }" />
										<p>Download & Install</p>
									</Button>
								</template>
								<template v-else>
									<p class="text-sm">
										No new updates found... <br />
										App is in <span class="font-semibold"> latest </span> version.
									</p>
								</template>
                                <li v-if="updaterProgress" key="progress">
                                    <div class="h-2 overflow-hidden rounded-full bg-muted my-1">
                                        <div class="h-full rounded-full bg-foreground" :style="{ width: `${Math.round(updaterProgress* 100)}%` }"></div>
                                    </div>
                                </li>
							</li>
                        </TransitionGroup>
					</SettingSection>

					<SettingSection v-else-if="activeCategory === 'appearance'" title="Appearance Settings">
						<div class="flex items-start gap-4 justify-between">
							<div class="flex-2">
								<Label>Theme</Label>
								<p class="my-0.5 text-xs text-muted-foreground/75">Application default theme</p>
							</div>
							<Select v-model="settings.THEME" @update:model-value="saveSettings(SettingsCodeEnum.THEME)">
								<SelectTrigger class="flex-1">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="light">Light</SelectItem>
										<SelectItem value="dark">Dark</SelectItem>
										<SelectItem value="ambient">Ambient</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div class="flex items-start gap-4 justify-between">
							<div class="flex-2">
								<Label>Default Font Size</Label>
								<p class="my-0.5 text-xs text-muted-foreground/75">Base font size</p>
							</div>
							<Select v-model="settings.FONT_SIZE" @update:model-value="saveSettings(SettingsCodeEnum.FONT_SIZE)">
								<SelectTrigger class="flex-1">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="small">Small</SelectItem>
										<SelectItem value="medium">Medium</SelectItem>
										<SelectItem value="large">Large</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div class="flex items-start gap-4 justify-between">
							<div class="flex-2">
								<Label>Time Format</Label>
								<p class="my-0.5 text-xs text-muted-foreground/75">12-hour or 24-hour format</p>
							</div>
							<Select v-model="settings.DATE_FORMAT" @update:model-value="saveSettings(SettingsCodeEnum.DATE_FORMAT)">
								<SelectTrigger class="flex-1">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="hh:mm">12-hour</SelectItem>
										<SelectItem value="HH:mm">24-hour</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<!-- <div class="flex items-center gap-4 justify-between">
                            <div class="flex-2">
                                <Label for="accessibility">Minimal Design</Label>
                                <p class="my-0.5 text-xs text-muted-foreground/75">Hides additional accessibility controls</p>
                            </div>
                            <Switch id="accessibility" />
                        </div> -->
					</SettingSection>

					<SettingSection v-else-if="activeCategory === 'data'" title="Data & Backup">
						<!-- <div class="flex items-center gap-4 justify-between">
                            <div class="flex-2">
                                <Label for="accessibility">Auto Save</Label>
                                <p class="my-0.5 text-xs text-muted-foreground/75">Automatically save changes</p>
                            </div>
                            <Switch id="autosave" v-model="settings.autoSave" />
                        </div> -->
						<!-- <div class="flex items-start gap-4 justify-between">
                            <div class="flex-2">
                                <Label>Backup Interval</Label>
                                <p class="my-0.5 text-xs text-muted-foreground/75">How often to backup your data</p>
                            </div>
                            <Select v-model="settings.backupInterval">
                                <SelectTrigger class="flex-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="hourly">Hourly</SelectItem>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="never">Never</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div> -->

						<div class="flex items-start gap-4 justify-between">
							<div class="flex-2">
								<Label>Import</Label>
								<p class="my-0.5 text-xs text-muted-foreground/75">Overwrite existing data</p>
							</div>
							<Button class="flex-1" variant="outline" size="sm" @click="handleImportData">
								<DownloadIcon class="size-4" />
								<p>Import Data</p>
							</Button>
						</div>
						<div class="flex items-start gap-4 justify-between">
							<div class="flex-2">
								<Label>Export</Label>
								<p class="my-0.5 text-xs text-muted-foreground/75">Export your data</p>
							</div>
							<Button class="flex-1" variant="outline" size="sm" @click="handleExportData">
								<UploadIcon class="size-4" />
								<p>Export Data</p>
							</Button>
						</div>
					</SettingSection>
				</div>
			</div>
		</div>
	</DialogContent>
</template>
