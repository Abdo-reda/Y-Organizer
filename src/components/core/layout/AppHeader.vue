<script setup lang="ts">
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateTime } from "luxon";
import { useCurrentTime } from "@/store/useCurrentTime";
import { computed, ref } from "vue";
import { CalendarDate, parseDate } from "@internationalized/date";
import useDayState from "@/store/useDayState";
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, LaptopIcon, LockIcon, MoonIcon, SunIcon, SunMoonIcon, UnlockIcon, XIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { getCurrentWindow } from '@tauri-apps/api/window';
import { isTauri } from "@tauri-apps/api/core";
import { Dialog } from "@/components/ui/dialog";
import AboutDialog from "@/components/dialogs/AboutDialog.vue";
import useSettings from "@/store/useSettings";
import { getNextTheme, SettingsCodeEnum } from "@/core/enums/settingsCodeEnum";

//TODO: ENHANCEMENT: animation when chaning the day and the popover keeps moving when you change hte day, either animate it, or make the anchor static and doesnt change, or redesign this part.. figure something out.
//TODO: add a left and right arrow to go to next and previous day, should only appear when I hover over the header text "TODAY sunday 2010-10-29"


const { appView, isGridLocked, settings, updateSetting } = useSettings();
const { selectedDay } = useDayState();
const openAbout = ref(false);
const relativeDate = computed(() => selectedDay.value.toRelativeCalendar());
const isoDate = computed(() => selectedDay.value.toISODate());
const dateDayName = computed(() => selectedDay.value.weekdayLong);
const { formattedTime } = useCurrentTime();

const calendarDate = computed<CalendarDate>({
    get: () => parseDate(isoDate.value),
    set: (value: CalendarDate) => {
        const parsedDate = DateTime.fromISO(value.toString());
        if (parsedDate.isValid) selectedDay.value = parsedDate;
    }
})

const appWindow = isTauri() ? getCurrentWindow() : undefined;

function switchTheme() {
    updateSetting(SettingsCodeEnum.THEME, getNextTheme(settings.THEME));
}

function switchView() {
    appView.value = appView.value === 'day' ? 'week' : 'day'
}

function toggleFormat() {
    updateSetting(SettingsCodeEnum.DATE_FORMAT, settings.DATE_FORMAT === 'HH:mm' ? 'hh:mm' : 'HH:mm')
}

function handleClose() {
    appWindow?.close();
}

function setToday() {
    selectedDay.value = DateTime.now();
}

function prevDate() {
    selectedDay.value = selectedDay.value.minus({ day: appView.value === 'day' ? 1 : 7 })
}

function nextDate() {
    selectedDay.value = selectedDay.value.plus({ day: appView.value === 'day' ? 1 : 7 })
}

</script>

<template>
    <header class="px-2 py-1 grid grid-cols-3 select-none draggable app-drag">
        <div class="flex items-center px-2">
            <div @click="openAbout = true" class="p-4 relative flex items-center justify-center group">
                <img class="absolute brightness-85 opacity-20 group-hover:opacity-60 duration-500 transition-opacity"
                    src="@/assets/images/sphere.png" />
                <p
                    class="text-2xl font-extrabold text-primary/75 transition-colors duration-500 group-hover:text-primary z-10">
                    Y</p>
            </div>
            <Dialog v-model:open="openAbout">
                <AboutDialog />
            </Dialog>
        </div>
        <div class="flex flex-1 items-center justify-center gap-2">
            <div class="flex items-end relative">
                <div class="flex items-center gap-0 hover:gap-2 transition-all group">
                    <Button @click="prevDate" variant="ghost"
                        class="hover:bg-transparent dark:hover:bg-transparent app-no-drag !p-0 w-2 opacity-0 group-hover:opacity-100">
                        <ChevronLeftIcon />
                    </Button>
                    <h1 @click="setToday" class="text-4xl font-bold text-primary capitalize transition-colors">
                        {{ appView === 'day' ? relativeDate : `Week ${selectedDay.weekNumber}` }}
                    </h1>
                    <Button @click="nextDate" variant="ghost"
                        class="hover:bg-transparent dark:hover:bg-transparent app-no-drag !p-0 w-2 opacity-0 group-hover:opacity-100">
                        <ChevronRightIcon />
                    </Button>
                </div>
                <Popover>
                    <PopoverTrigger as-child>
                        <button
                            class="text-xs app-no-drag font-medium text-muted-foreground/85 hover:text-primary transition-colors absolute left-full mx-2 whitespace-nowrap">
                            <span class="text-lg font-semibold"> {{ dateDayName }} </span> <span> {{ isoDate }} </span>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0 m-2">
                        <Calendar v-model="calendarDate" weekday-format="short" initial-focus />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
        <div class="flex justify-end items-center px-2 gap-6">
            <div class="flex items-center">
                <Button @click="switchView" variant="ghost" size="icon"
                    class="text-muted-foreground/85 app-no-drag hover:bg-transparent">
                    <CalendarDaysIcon />
                </Button>
                <!-- TODO: remove this and put it in settings. -->
                <Button @click="switchTheme" variant="ghost" size="icon"
                    class="text-muted-foreground/85 app-no-drag hover:bg-transparent">
                    <SunIcon v-if="settings.THEME === 'light'" />
                    <MoonIcon v-else-if="settings.THEME === 'dark'" />
                    <LaptopIcon v-else-if="settings.THEME === 'auto'" />
                    <SunMoonIcon v-else />
                </Button>
                <Button @click="isGridLocked = !isGridLocked" variant="ghost" size="icon"
                    class="text-muted-foreground/85 app-no-drag hover:bg-transparent">
                    <LockIcon class="size-3.5" v-if="isGridLocked" />
                    <UnlockIcon class="size-3.5" v-else />
                </Button>
            </div>
            <div class="border-r border-muted-foreground/85 h-1/3" />
            <div class="flex hover:gap-2 gap-0 transition-all group items-center">
                <div @click="toggleFormat" class="text-xl font-bold text-muted-foreground/85 hover:text-primary transition-colors">
                    {{ formattedTime }}
                </div>
                <Button v-if="isTauri()" @click="handleClose" variant="ghost" size="icon"
                    class="text-transparent app-no-drag size-6 hover:bg-transparent group-hover:text-muted-foreground/85">
                    <XIcon class="size-3" />
                </Button>
            </div>
        </div>
    </header>
</template>