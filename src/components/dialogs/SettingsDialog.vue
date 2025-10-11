<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
// import { Separator } from "@/components/ui/separator";
import { 
    SettingsIcon, 
    PaletteIcon, 
    DatabaseIcon, 
    BellIcon, 
    DownloadIcon,
    UploadIcon,
    RefreshCwIcon
} from "lucide-vue-next";
import { ref } from "vue";

type SettingsCategory = 'general' | 'appearance' | 'data' | 'notifications';

const activeCategory = ref<SettingsCategory>('general');

// Settings state
const settings = ref({
    theme: 'system',
    language: 'en',
    firstDayOfWeek: 'monday',
    defaultView: 'week',
    timeFormat: '24h',
    showAccessibilityButtons: true,
    defaultFontSize: 'medium',
    notificationsEnabled: true,
    autoSave: true,
    backupInterval: 'daily',
});

const categories = [
    { id: 'general' as const, label: 'General', icon: SettingsIcon },
    { id: 'appearance' as const, label: 'Appearance', icon: PaletteIcon },
    { id: 'data' as const, label: 'Data & Backup', icon: DatabaseIcon },
    { id: 'notifications' as const, label: 'Notifications', icon: BellIcon },
];

function handleExportData() {
    console.log('[v0] Exporting data...');
    // Export logic here
}

function handleImportData() {
    console.log('[v0] Importing data...');
    // Import logic here
}

function checkForUpdates() {
    console.log('[v0] Checking for updates...');
    // Update check logic here
}
</script>

<template>
    <DialogContent class="max-w-4xl max-h-[85vh] p-0 gap-0">
        <DialogHeader class="px-6 pt-6 pb-4">
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Manage your application preferences and settings</DialogDescription>
        </DialogHeader>

        <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar -->
            <div class="w-48 border-r bg-muted/30 p-3 space-y-1">
                <button
                    v-for="category in categories"
                    :key="category.id"
                    @click="activeCategory = category.id"
                    :class="[
                        'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                        activeCategory === category.id
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    ]"
                >
                    <component :is="category.icon" class="size-4" />
                    {{ category.label }}
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6">
                <!-- General Settings -->
                <div v-if="activeCategory === 'general'" class="space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-4">General Settings</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label>Theme</Label>
                                    <p class="text-sm text-muted-foreground">Choose your interface theme</p>
                                </div>
                                <Select v-model="settings.theme">
                                    <SelectTrigger class="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <!--  <Separator /> -->

                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label>Language</Label>
                                    <p class="text-sm text-muted-foreground">Select your preferred language</p>
                                </div>
                                <Select v-model="settings.language">
                                    <SelectTrigger class="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="es">Spanish</SelectItem>
                                            <SelectItem value="fr">French</SelectItem>
                                            <SelectItem value="de">German</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <!-- <Separator /> -->

                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label>First Day of Week</Label>
                                    <p class="text-sm text-muted-foreground">Choose the first day of your week</p>
                                </div>
                                <Select v-model="settings.firstDayOfWeek">
                                    <SelectTrigger class="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="sunday">Sunday</SelectItem>
                                            <SelectItem value="monday">Monday</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <!-- <Separator /> -->

                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label>Default View</Label>
                                    <p class="text-sm text-muted-foreground">Choose your default calendar view</p>
                                </div>
                                <Select v-model="settings.defaultView">
                                    <SelectTrigger class="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="day">Day</SelectItem>
                                            <SelectItem value="week">Week</SelectItem>
                                            <SelectItem value="month">Month</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Appearance Settings -->
                <div v-if="activeCategory === 'appearance'" class="space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Appearance Settings</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label>Time Format</Label>
                                    <p class="text-sm text-muted-foreground">Choose 12-hour or 24-hour format</p>
                                </div>
                                <Select v-model="settings.timeFormat">
                                    <SelectTrigger class="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="12h">12-hour</SelectItem>
                                            <SelectItem value="24h">24-hour</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <!-- <Separator /> -->

                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label>Default Font Size</Label>
                                    <p class="text-sm text-muted-foreground">Adjust the base font size</p>
                                </div>
                                <Select v-model="settings.defaultFontSize">
                                    <SelectTrigger class="w-32">
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

                            <!-- <Separator /> -->

                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label for="accessibility">Show Accessibility Buttons</Label>
                                    <p class="text-sm text-muted-foreground">Display additional accessibility controls</p>
                                </div>
                                <Switch 
                                    id="accessibility"
                                    v-model="settings.showAccessibilityButtons" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Data & Backup Settings -->
                <div v-if="activeCategory === 'data'" class="space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Data & Backup</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label for="autosave">Auto Save</Label>
                                    <p class="text-sm text-muted-foreground">Automatically save changes</p>
                                </div>
                                <Switch 
                                    id="autosave"
                                    v-model="settings.autoSave" 
                                />
                            </div>

                            <!-- <Separator /> -->

                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label>Backup Interval</Label>
                                    <p class="text-sm text-muted-foreground">How often to backup your data</p>
                                </div>
                                <Select v-model="settings.backupInterval">
                                    <SelectTrigger class="w-32">
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
                            </div>

                            <!-- <Separator /> -->

                            <div class="space-y-3">
                                <div>
                                    <Label>Import & Export</Label>
                                    <p class="text-sm text-muted-foreground">Manage your data</p>
                                </div>
                                <div class="flex gap-2">
                                    <Button variant="outline" size="sm" @click="handleExportData">
                                        <DownloadIcon class="size-4" />
                                        Export Data
                                    </Button>
                                    <Button variant="outline" size="sm" @click="handleImportData">
                                        <UploadIcon class="size-4" />
                                        Import Data
                                    </Button>
                                </div>
                            </div>

                            <!-- <Separator /> -->

                            <div class="space-y-3">
                                <div>
                                    <Label>Updates</Label>
                                    <p class="text-sm text-muted-foreground">Check for application updates</p>
                                </div>
                                <Button variant="outline" size="sm" @click="checkForUpdates">
                                    <RefreshCwIcon class="size-4" />
                                    Check for Updates
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Notifications Settings -->
                <div v-if="activeCategory === 'notifications'" class="space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-4">Notifications</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div class="space-y-0.5">
                                    <Label for="notifications">Enable Notifications</Label>
                                    <p class="text-sm text-muted-foreground">Receive notifications for important events</p>
                                </div>
                                <Switch 
                                    id="notifications"
                                    v-model="settings.notificationsEnabled" 
                                />
                            </div>

                            <!-- <Separator /> -->

                            <div class="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                                More notification settings coming soon...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DialogContent>
</template>
