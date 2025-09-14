<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import { CheckIcon } from 'lucide-vue-next';
import { useCountdown } from '@vueuse/core'
import { computed, reactive, ref, useTemplateRef } from 'vue'
import { PomodoroModeEnum } from '@/core/enums/pomodorModeEnum';
import { Duration } from 'luxon';
import { useMouseShortcuts } from '@/composables/useMouseShortcuts';

interface IFocusCardProps {
    focusTime: number;
    restTime: number;
    completed: number;
}

defineProps<IFocusCardProps>();

const timer = useTemplateRef<HTMLElement>('timer');

useMouseShortcuts(timer, {
    onPrimaryClick: () => toggleTimer(),
    onSecondaryClick: () => resetTimer(),
    onMiddleMouseClick: () => nextTimer(),
})

const cardInfo: IFocusCardProps = reactive({
    focusTime: 25,
    restTime: 5,
    completed: 4,
});

const currentMode = ref(PomodoroModeEnum.FOCUS);
const countdown = computed(() => (currentMode.value === PomodoroModeEnum.FOCUS ? cardInfo.focusTime : cardInfo.restTime) * 60);
const { remaining, resume, pause, isActive, stop } = useCountdown(countdown, {
    onComplete: () => nextTimer(true)
});
const formattedRemaining = computed(() => Duration.fromMillis(remaining.value * 1000).toFormat('m:ss'));

const radius = 40; //viewbox is 100, so diameter is 100, so radius is 50...
const circumference = 2 * Math.PI * radius;
const offset = (75 / 100) * circumference - circumference;

function toggleTimer() {
    if (isActive.value) pauseTimer()
    else resumeTimer();
}

function pauseTimer() {
    pause();
}

function resumeTimer() {
    resume();
}

function resetTimer() {
    currentMode.value === PomodoroModeEnum.FOCUS ? cardInfo.focusTime : cardInfo.restTime;
    stop();
}

function nextTimer(success: boolean = false) {
    currentMode.value = currentMode.value === PomodoroModeEnum.FOCUS ? PomodoroModeEnum.REST : PomodoroModeEnum.FOCUS;
    if (success) cardInfo.completed += 1;
    resetTimer();
}

const isClicking = ref(false);

</script>

<template>
    <FunctionCard title="Focus">
        <template #header-left-actions>
            <div class="absolute flex flex-wrap">
                <CheckIcon v-for="i in cardInfo.completed" :key="i" class="size-3 text-gray-500" />
            </div>
        </template>
        <template #default>
            <div class="flex justify-center items-center h-full relative p-6">
                <div ref="timer" @mousedown="isClicking = true" @mouseup="isClicking = false" @mouseleave="isClicking = false"
                    class="aspect-square w-full rounded-full hover:cursor-pointer transition-all bg-gradient-to-br from-primary to-gray-400 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-101"
                    :class="{
                        '!scale-98': isClicking,
                    }">
                    <p class="text-4xl select-none text-white font-semibold"> {{ formattedRemaining }}
                    </p>
                </div>
            </div>
            <!-- <svg class="aspect-square w-full transform -rotate-90 origin-center absolute" viewBox="0 0 100 100">
                    <defs>
                        <linearGradient id="ringGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" :style="{ stopColor: 'var(--color-gray-400)', stopOpacity: 1 }" />
                            <stop offset="100%" :style="{ stopColor: 'var(--primary)', stopOpacity: 1 }" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" :r="radius" fill="none" stroke="url(#ringGradient)" stroke-linecap="round"
                        stroke-width="8px" class="transition-all duration-300"
                        :style="{ strokeDasharray: circumference, strokeDashoffset: offset }" />
                </svg> -->
            <!-- <div @click="toggleTimer" @click.ctrl="showEditTimer = true" @click.alt="completePomodoro"
                    @contextmenu.prevent="resetTimer" class="relative w-32 h-32 cursor-pointer">
                   
                    Progress Cricle
                    <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="3" />
                        <path v-if="isTimerActive || isBreakActive"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none" :stroke="isBreakActive ? 'url(#breakGradient)' : 'url(#pomodoroGradient)'"
                            stroke-width="3"
                            :stroke-dasharray="`${(timeRemaining / (currentTimerDuration * 60)) * 100}, 100`"
                            stroke-linecap="round" />
                    </svg>

                    Timer display
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="text-center">
                            <span class="text-2xl font-bold text-gray-700">
                                {{ formatTime(timeRemaining) }}
                            </span>
                            <div v-if="isBreakActive" class="text-xs text-gray-500 mt-1">Break</div>
                        </div>
                    </div>

                    SVG gradient definitions
                    <svg width="0" height="0">
                        <defs>
                            <linearGradient id="pomodoroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                            </linearGradient>
                            <linearGradient id="breakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div> -->
        </template>
    </FunctionCard>
</template>