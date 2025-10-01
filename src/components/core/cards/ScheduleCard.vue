<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import SessionDialog from '@/components/dialogs/SessionDialog.vue';
import SessionPopover from '@/components/popovers/sessionPopover.vue';
import { Dialog } from '@/components/ui/dialog';
import { Popover, PopoverAnchor, PopoverTrigger } from '@/components/ui/popover';
import PopoverContent from '@/components/ui/popover/PopoverContent.vue';
import { SessionStatusEnum } from '@/core/enums/sessionStatusEnum';
import { ISession } from '@/core/interfaces/entities/ISession';
import useActivity from '@/store/useActivity';
import { useCurrentTime } from '@/store/useCurrentTime';
import useDaySessions from '@/store/useDaySessions';
import useDayState from '@/store/useDayState';
import { reactiveComputed, useResizeObserver } from '@vueuse/core'
import { GridStack } from "gridstack";
import { PlusIcon, StepForwardIcon } from 'lucide-vue-next';
import { DateTime } from 'luxon';
import { type ReferenceElement } from 'reka-ui';
import { computed, onMounted, ref, shallowRef, useTemplateRef, watch } from "vue";

const gridContainer = useTemplateRef('schedule-container')
const { dayPercentage } = useCurrentTime();
const { selectedDay } = useDayState();
const { sessions, fetchSessions, createSession, updateSession } = useDaySessions();
const { activities } = useActivity();
const sessionPopoverOpen = ref(false);
const editSession = ref<ISession | null>(null);
const sessionPopoverAnchor = shallowRef<ReferenceElement | undefined>();

let gridStack: GridStack | undefined;

watch(selectedDay, (day) => fetchSessions(day), { immediate: true });

function initGrid() {
    if (!gridContainer.value) return;
    gridStack = GridStack.init({
        alwaysShowResizeHandle: false,
        float: true,
        margin: "0.1rem",
        column: 1,
        row: 24,
        cellHeight: 0,
    }, gridContainer.value);
    gridStack.enable();
}

function generateDefaultSession(): ISession {
    const startTime = DateTime.now();
    const endTime = startTime.plus({ hour: 1 });

    return {
        title: "",
        notes: "",
        activity: "",
        day: startTime.toISO(),
        status: SessionStatusEnum.PENDING,
        startTime,
        endTime,
    };
}

function addSession(event: PointerEvent, i: number) {
    sessionPopoverAnchor.value = event.currentTarget as ReferenceElement;
    sessionPopoverOpen.value = true;
}

function handleCreate(session: ISession) {
    createSession(session);
    editSession.value = null;
    sessionPopoverOpen.value = false;
    //TODO: toast?
}

function handleUpdate(id: number, session: ISession) {
    updateSession(id, session);
    editSession.value = null;
    sessionPopoverOpen.value = false;
}

useResizeObserver(gridContainer, (entries) => {
    const entry = entries[0];
    const { height } = entry.contentRect;
    gridStack?.cellHeight(height / 24);
});

onMounted(() => {
    initGrid();
});
</script>

<template>
    <FunctionCard title="Schedule">
        <template #default>
            <Popover v-model:open="sessionPopoverOpen">
                <PopoverAnchor :reference="sessionPopoverAnchor"> </PopoverAnchor>
                <SessionPopover :existing-session="editSession" @create="handleCreate" @update="handleUpdate" />
            </Popover>
            <div class="flex h-full select-none">
                <div class="h-full flex flex-col">
                    <template v-for="i in 24" :key="i">
                        <div class="flex-1 relative flex flex-col items-center justify-between">
                            <p class="text-xs text-gray-500 font-semibold -translate-y-1/2"> {{ (i - 1) }}:00 </p>
                            <p v-if="i == 24"
                                class="text-xs text-gray-500 font-semibold absolute bottom-0 translate-y-1/2"> {{ i
                                }}:00
                            </p>
                        </div>
                    </template>
                </div>
                <div ref="schedule-container" class="!h-full grid-stack flex-1 relative mx-0.5">
                    <div class="absolute size-full z-10 pointer-events-none p-0.5">
                        <div class="w-full bg-primary/5 rounded-t-sm" :style="{ height: `${dayPercentage * 100}%` }" />
                        <div class="w-full border-primary/20 border-t-2" />
                    </div>
                    <StepForwardIcon
                        class="absolute stroke-transparent fill-primary/35 -translate-y-1/2 -translate-x-full size-3"
                        :style="{ top: `${dayPercentage * 100}%` }" />
                    <div class="absolute h-full w-full flex flex-col p-0.5 gap-1.5">
                        <div v-for="i in 24" :key="i" @click="addSession($event, i)" class="flex-1 group">
                            <div
                                class="rounded-sm bg-gray-50 p-1 border border-gray-300 border-dashed h-full flex items-center justify-center group-hover:border-gray-500 transition-colors group-hover:transition-none">
                                <PlusIcon
                                    class="size-3 text-gray-300 group-hover:text-gray-500 transition-colors group-hover:transition-none" />
                            </div>
                        </div>
                    </div>
                    <template v-for="session in sessions" :key="session.id">
                        <div class="grid-stack-item" :gs-h="1">
                            <div class="rounded-sm flex-1 grid-stack-item-content"
                                :style="{ backgroundColor: activities.find(a => a.name === session.activity)?.color ?? 'var(--primary)', }">
                                <div class="flex">
                                    <p class="capitalize font-semibold"> {{ session.activity }} </p>
                                    <!-- title of session -->
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </FunctionCard>
</template>
