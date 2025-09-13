<script setup lang="ts">
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateTime } from "luxon";
import { useCurrentTime } from "@/composables/useCurrentTime";

//TODO:
//- handle the emit of changing the date... and updating date... either emits or modals ... need to be consistent

interface ITodayHeaderProps {
  dayDate: DateTime;
}
const props: ITodayHeaderProps = {
    dayDate: DateTime.now(),
} 

const relativeDate = props.dayDate.toRelativeCalendar();
const isoDate = props.dayDate.toISODate();
const dateDayName = props.dayDate.weekdayLong;
const currentTime = useCurrentTime();
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
              class="text-xs font-medium text-gray-400 hover:text-primary transition-colors absolute left-full mx-2 whitespace-nowrap"
            >
              <span class="text-lg font-semibold"> {{ dateDayName }} </span> <span> {{ isoDate }} </span>
            </button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0 m-2">
            <Calendar initial-focus />
          </PopoverContent>
        </Popover>
      </div>
    </div>
    <div class="flex justify-end items-center px-4">
      <div class="text-xl font-bold text-gray-400 hover:text-primary transition-colors">
        {{ currentTime }}
      </div>
    </div>
  </header>
</template>
