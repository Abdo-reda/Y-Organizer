<script setup lang="ts">
import FunctionCard from "@/components/common/FunctionCard.vue";
import { Button } from "@/components/ui/button";
import { ITask } from "@/core/interfaces/entities/ITask";
import { useCurrentTime } from "@/store/useCurrentTime";
import useDaySessions from "@/store/useDaySessions";
import useSettings from "@/store/useSettings";
import { CheckCheckIcon, CheckIcon, ListCheckIcon, NotepadTextIcon, PlusIcon, ZapIcon } from "lucide-vue-next";
import { computed } from "vue";

const { currentTime} = useCurrentTime();
const { currentSession } = useDaySessions();
const { settings } = useSettings();

//TODO: enhancements
// <!-- TODO: fix notes section, remove the bg-gray-50 from icon, and add an absolute hidden element and get the height from that element... -->

//TODO: CURRENT SESSION CARD
//- underneath them is the active task
//- underneath it is 3 slots for tasks, each task can be cleared, deleted, edited, and marked as done and marked as active
//- shortcuts?
//- clear
//- delete
//- edit
//- create
//- mark as done
//- mark as active

// currentSession.value?.endTime.diffNow('minutes', { conversionAccuracy: 'casual' }).minutes ?? 0)

const remainingTime = computed(() => currentSession.value ? Math.ceil(currentSession.value.endTime.diff(currentTime.value, 'minutes', { conversionAccuracy: 'casual' }).minutes) : 0)

const currentTask: ITask | null = {
    activity: "activity",
    description: "description",
    title: "title",
};
</script>

<template>
    <FunctionCard title="Now" :highlight="!!currentSession">
        <template #default>
            <div class="h-full flex flex-col items-center">
                <!-- HEADER INFO -->
                <div class="flex flex-col gap-0.5 items-center">
                    <p class="text-3xl font-extrabold capitalize text-primary">
                        {{ currentSession ? currentSession.activity : "FREE SLOT" }}
                    </p>
                    <p class="text-base text-center text-primary/75 font-semibold capitalize">
                        {{ currentSession ? currentSession.title : 'No Active Session' }}
                    </p>
                    <div v-if="currentSession" class="text-xs text-center text-gray-500">
                        <span> {{ currentSession.startTime.toFormat(settings.DATE_FORMAT) }} - {{
                            currentSession.endTime.toFormat(settings.DATE_FORMAT) }} </span>
                        <span v-if="remainingTime" class="text-xs"> •  <span v-if="remainingTime > 60"> {{ Math.floor(remainingTime / 60) }}h </span>
                            {{ remainingTime % 60 }}m
                            remaining</span>
                    </div>
                </div>
                <div class="border-t border-primary/25 m-2 w-4/5"></div>
                <!-- BODY -->
                <div class="flex-1 flex justify-between gap-4 p-2 overflow-hidden">

                    <!-- TASKS -->
                    <div>
                        <div v-auto-animate class="m-2 w-full">
                            <div v-if="currentTask" class="flex items-center justify-between gap-4">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <div class="relative mt-1">
                                            <ZapIcon class="fill-primary stroke-transparent size-3">
                                            </ZapIcon>
                                            <div class="absolute top-0 bg-primary/50 size-3 rounded-full animate-ping">
                                            </div>
                                        </div>
                                        <div class="font-bold text-gray-800">{{ currentTask.title }}</div>
                                    </div>
                                    <div v-if="currentTask.description" class="text-xs text-gray-600">{{
                                        currentTask.description }}</div>
                                </div>
                                <Button variant="ghost" size="icon" class="text-gray-400">
                                    <CheckIcon />
                                </Button>
                            </div>
                            <p v-else class="text-center text-gray-400">-------- No Active Task --------</p>
                        </div>
                        <!-- <div class="border-t border-gray-200 my-2"></div> -->
                        <div class="flex-1 grid grid-rows-3 gap-2">
                            <div
                                class="p-2 flex items-center min-w-0 justify-between bg-gray-50 border border-gray-200 rounded-sm">
                                <div class="flex-1 min-w-0">
                                    <div class="font-medium text-sm text-gray-800 truncate">Finish this stupid project
                                    </div>
                                    <div class="text-xs text-gray-600 mt-1 truncate">optional description of stuff and
                                        things</div>
                                </div>
                                <div class="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" class="text-gray-400 size-6">
                                        <ZapIcon class="size-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" class="text-gray-400 size-6">
                                        <CheckIcon class="size-3.5" />
                                    </Button>
                                </div>
                            </div>
                            <button
                                class="w-full p-2 border-2 border-dashed border-gray-300 rounded-sm text-gray-600 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                                <PlusIcon class="size-5" />
                                Add Task
                            </button>
                        </div>
                    </div>
                    <!-- NOTES -->
                    <div class="w-1/3 h-full flex flex-col gap-2">
                        <div
                            class="relative p-1.5 pb-0 flex flex-col gap-0.5 h-full bg-gray-50 border border-gray-400 border-dashed rounded-sm text-gray-500 text-sm">
                            <div class="flex items-center gap-1.5">
                                <NotepadTextIcon class="size-4" />
                                <p class="font-semibold">Notes</p>
                            </div>
                            <div class="flex-1">
                                <textarea v-if="currentSession" v-model="currentSession.notes" :spellcheck="false"
                                    class="w-full resize-none outline-none h-full scroll-hidden"
                                    placeholder="Session Notes..." />
                                <p v-else> - No Session - </p>
                            </div>
                            <div
                                class="absolute rounded-sm inset-0 bg-gradient-to-b from-transparent from-75% to-white/75 pointer-events-none" />
                        </div>
                        <div
                            class="relative p-1.5 h-full flex flex-col gap-0.5 border border-gray-400 border-dashed rounded-sm text-gray-500 text-sm">
                            <div class="flex items-center gap-1.5">
                                <ListCheckIcon class="size-4" />
                                <p class="font-semibold">Completed</p>
                                <span
                                    class="bg-gray-100 text-xs mx-1 flex items-center justify-center rounded-full size-5">
                                    {{ 4 }}
                                </span>
                            </div>
                            <div class="flex-1 flex flex-col gap-2 scroll-hidden">
                                <div class="flex items-center gap-2 p-1">
                                    <CheckCheckIcon class="size-3" />
                                    <span class="text-sm text-gray-500 line-through">{{ "blaaaaah" }}</span>
                                </div>
                            </div>
                            <div
                                class="absolute rounded-sm inset-0 bg-gradient-to-b from-transparent from-75% to-white/75 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </FunctionCard>
</template>
