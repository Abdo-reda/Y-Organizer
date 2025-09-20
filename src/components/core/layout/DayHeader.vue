<script setup lang="ts">
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateTime } from "luxon";
import { useCurrentTime } from "@/composables/useCurrentTime";
import { computed } from "vue";
import { CalendarDate, parseDate } from "@internationalized/date";
import useDayState from "@/store/useDayState";

//TODO: ENHANCEMENT: the popover keeps moving when you change hte day, either animate it, or make the anchor static and doesnt change, or redesign this part.. figure something out.

const {selectedDay} = useDayState();
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

</script>

<template>
    <header class="p-2 grid grid-cols-3 select-none">
        <div class="flex items-center px-4">
            <div class="px-2">
                <p class="text-2xl font-extrabold">Y</p>
            </div>
        </div>
        <div class="flex flex-1 items-center justify-center">
            <div class="flex items-end relative">
                <h1 class="text-4xl font-bold text-primary capitalize">{{ relativeDate }}</h1>
                <Popover>
                    <PopoverTrigger as-child>
                        <button
                            class="text-xs font-medium text-gray-400 hover:text-primary transition-colors absolute left-full mx-2 whitespace-nowrap">
                            <span class="text-lg font-semibold"> {{ dateDayName }} </span> <span> {{ isoDate }} </span>
                        </button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0 m-2">
                        <Calendar v-model="calendarDate" weekday-format="short" initial-focus />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
        <div class="flex justify-end items-center px-4">
            <div class="text-xl font-bold text-gray-400 hover:text-primary transition-colors">
                {{ formattedTime }}
            </div>
        </div>
    </header>
</template>
