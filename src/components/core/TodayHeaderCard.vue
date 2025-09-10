<script setup lang="ts">
import { DateTime } from 'luxon';

interface ITodayHeaderProps {
    date: DateTime;
}
const props = defineProps<ITodayHeaderProps>()

const relativeDate = props.date.toRelativeCalendar();
const isoDate = props.date.toISODate();
const dateDay = props.date.weekdayLong;
const currentTime = DateTime.now().toFormat('hh:mm'); //TODO: make it dynamic... and a ref or something...

</script>

<template>
    <header class="p-2 mx-2 grid grid-cols-3 select-none">
        <div class="flex items-center">
            <div class="px-2">
                <p class="text-3xl font-extrabold"> Y </p>
            </div>
        </div>
        <div class="flex flex-1 items-center justify-center">
            <div class="flex items-end relative">
                <h1 class="text-5xl font-bold text-blue-600 capitalize">{{ relativeDate }}</h1>
                <button
                    class="text-xs font-medium text-gray-400 hover:text-blue-600 transition-colors absolute left-full mx-2 w-full">
                    <span class="text-lg font-semibold"> {{ dateDay }} </span> {{ isoDate }}
                </button>
            </div>

        </div>
        <div class="flex justify-end items-center">
            <div class="text-2xl font-bold text-gray-400">
                {{ currentTime }}
            </div>
        </div>
    </header>
</template>