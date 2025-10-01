<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import SessionPopover from '@/components/popovers/SessionsPopover.vue';
import { Popover, PopoverAnchor } from '@/components/ui/popover';
import { generateDefaultSession, ISession } from '@/core/interfaces/entities/ISession';
import useActivity from '@/store/useActivity';
import { useCurrentTime } from '@/store/useCurrentTime';
import useDaySessions from '@/store/useDaySessions';
import useDayState from '@/store/useDayState';
import { useResizeObserver } from '@vueuse/core'
import { GridStack, type GridStackNode } from "gridstack";
import { PlusIcon, StepForwardIcon } from 'lucide-vue-next';
import { DateTime } from 'luxon';
import { type ReferenceElement } from 'reka-ui';
import { onMounted, ref, shallowRef, useTemplateRef, watch } from "vue";

const gridContainer = useTemplateRef('schedule-container')
const { dayPercentage } = useCurrentTime();
const { selectedDay } = useDayState();
const { sessions, fetchSessions, createSession, updateSession } = useDaySessions();
const { activities } = useActivity();
const sessionPopoverOpen = ref(false);
const editSession = ref<ISession>(generateDefaultSession(0));
const sessionPopoverAnchor = shallowRef<ReferenceElement | undefined>();


let gridStack: GridStack | undefined;

watch(selectedDay, async (day) => {
    await fetchSessions(day);
    sessions.forEach((s) => gridStack?.makeWidget(`${s.id}`)) 
}, { immediate: true });

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
    gridStack.on('change', handleGridChange);
}

function openSessionPopover(event: PointerEvent, i: number) {
    editSession.value = generateDefaultSession(i);
    sessionPopoverAnchor.value = event.currentTarget as ReferenceElement;
    sessionPopoverOpen.value = true;
}

async function handleSessionCreate(session: ISession) {
    const createdId = await createSession(session);
    editSession.value = generateDefaultSession(0);
    sessionPopoverOpen.value = false;
    console.log("-- creating stuff", createdId, gridStack)
    if (createdId) gridStack?.makeWidget(`${createdId}`)
    //   nextTick(()=>{
    //           grid.makeWidget(node.id);
    //           updateInfo();
    //         });
    //TODO: toast?
}

function handleSessionUpdate(id: number, session: ISession) {
    updateSession(id, session);
    editSession.value = generateDefaultSession(0);
    sessionPopoverOpen.value = false;
}

function handleGridChange(_event: Event, nodes: GridStackNode[]) {
    console.log("-- handle change")
    nodes.forEach(async (node) => {
        var session = sessions.find(s => s.id == node.id);
        if (!session?.id) return;
        const startTime = DateTime.fromISO(session.day).set({ hour: node.y });
        session.startTime = startTime;
        session.endTime = startTime.plus({ hour: node.h });
        await updateSession(session.id, session);
    });
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
                <SessionPopover :existing-session="editSession" @create="handleSessionCreate"
                    @update="handleSessionUpdate" />
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
                        <div v-for="i in 24" :key="i" @click="openSessionPopover($event, i - 1)" class="flex-1 group">
                            <div
                                class="rounded-sm bg-gray-50 p-1 border border-gray-300 border-dashed h-full flex items-center justify-center group-hover:border-gray-500 transition-colors group-hover:transition-none">
                                <PlusIcon
                                    class="size-3 text-gray-300 group-hover:text-gray-500 transition-colors group-hover:transition-none" />
                            </div>
                        </div>
                    </div>
                    <template v-for="session in sessions" :key="session.id">
                        <div class="grid-stack-item"  :gs-x="0" :gs-y="session.startTime.hour" :gs-h="session.endTime.hour - session.startTime.hour"
                             :gs-id="session.id" :id="`${session.id}`">
                            <!-- session.startTime.hour -->
                            <div class="rounded-sm flex-1 grid-stack-item-content !overflow-hidden"
                                :style="{ backgroundColor: activities.find(a => a.name === session.activity)?.color ?? 'var(--primary)', }">
                                <!-- <div class="flex"> -->
                                <p class="capitalize font-extrabold text-xl px-1 opacity-50"> {{ session.activity }} </p>
                                <!-- </div> -->
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </FunctionCard>
</template>
