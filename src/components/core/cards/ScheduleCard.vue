<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import SessionFormPopover from '@/components/popovers/SessionFormPopover.vue';
import SessionPreviewPopover from '@/components/popovers/SessionPreviewPopover.vue';
import { Popover, PopoverAnchor } from '@/components/ui/popover';
import { LifeCategoryIconMapper } from '@/core/enums/lifeCategoryEnum';
import { getNextStatus } from '@/core/enums/sessionStatusEnum';
import { generateDefaultSession, ISession } from '@/core/interfaces/entities/ISession';
import useActivity from '@/store/useActivity';
import { useCurrentTime } from '@/store/useCurrentTime';
import useDaySessions from '@/store/useDaySessions';
import useDayState from '@/store/useDayState';
import useSettings from '@/store/useSettings';
import { useResizeObserver } from '@vueuse/core'
import { GridStack, type GridStackNode } from "gridstack";
import { PlusIcon, StepForwardIcon } from 'lucide-vue-next';
import { DateTime } from 'luxon';
import { type ReferenceElement } from 'reka-ui';
import { onMounted, ref, shallowRef, useTemplateRef, watch } from "vue";

const gridContainer = useTemplateRef('schedule-container')
const { dayPercentage } = useCurrentTime();
const { selectedDay } = useDayState();
const { settings } = useSettings();
const { sessions, onRemoveSession, fetchSessions, createSession, updateSession, deleteSession } = useDaySessions();
const { activities } = useActivity();
const editSessionPopoverOpen = ref(false);
const previewSessionPopoverOpen = ref(false);
const editSession = ref<ISession>(generateDefaultSession(selectedDay.value, 0));
const sessionPopoverAnchor = shallowRef<ReferenceElement | undefined>();

let gridStack: GridStack | undefined;

//TODO: I don't like this being here, could add onFetchCallback but will also need loading.
watch(selectedDay, async (day) => {
    await fetchSessions(day);
    gridStack?.removeAll(true, false);
    sessions.forEach((s) => gridStack?.makeWidget(`s${s.id}`))
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
    editSession.value = generateDefaultSession(selectedDay.value, i);
    sessionPopoverAnchor.value = event.currentTarget as ReferenceElement;
    editSessionPopoverOpen.value = true;
}

async function handleSessionCreate(session: ISession) {
    const createdId = await createSession(session);
    editSession.value = generateDefaultSession(selectedDay.value, 0);
    editSessionPopoverOpen.value = false;
    if (createdId) gridStack?.makeWidget(`s${createdId}`)
}

function handleSessionUpdate(id: number, session: ISession) {
    updateSession(id, session);
    editSession.value = generateDefaultSession(selectedDay.value, 0);
    editSessionPopoverOpen.value = false;
}

function handleSessionDelete(id: number | undefined) {
    deleteSession(id);
}

function handleGridChange(_event: Event, nodes: GridStackNode[]) {
    nodes.forEach((node) => {
        var session = sessions.find(s => `s${s.id}` == node.id);
        if (!session?.id) return;
        const startTime = DateTime.fromISO(session.day).set({ hour: node.y });
        session.startTime = startTime;
        session.endTime = startTime.plus({ hour: node.h });
        updateSession(session.id, session);
    });
}

function handleSession(event: MouseEvent, session: ISession) {
    switch (event.button) {
        case 0:
            if (event.ctrlKey) {
                sessionPopoverAnchor.value = event.currentTarget as ReferenceElement;
                editSession.value = session;
                editSessionPopoverOpen.value = true;
            } else if (event.altKey) {
                session.status = getNextStatus(session.status);
                updateSession(session.id, session);
            } else {
                sessionPopoverAnchor.value = event.currentTarget as ReferenceElement;
                editSession.value = session;
                previewSessionPopoverOpen.value = true;
            }
            break;
    }
}

onRemoveSession((id: number) => {
    gridStack?.removeWidget(`s${id}`)
})

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
            <Popover v-model:open="editSessionPopoverOpen">
                <PopoverAnchor :reference="sessionPopoverAnchor"> </PopoverAnchor>
                <SessionFormPopover :existing-session="editSession" @create="handleSessionCreate"
                    @update="handleSessionUpdate" />
            </Popover>
            <Popover v-model:open="previewSessionPopoverOpen">
                <PopoverAnchor :reference="sessionPopoverAnchor"> </PopoverAnchor>
                <SessionPreviewPopover :session="editSession" />
            </Popover>
            <div class="flex h-full select-none">
                <div class="h-full flex flex-col">
                    <template v-for="(_i, index) in 24" :key="index">
                        <div class="flex-1 relative flex flex-col items-center justify-between">
                            <p class="text-xs text-gray-500 font-semibold -translate-y-1/2">{{ settings.DATE_FORMAT ===
                                'HH:mm' ? index : (index % 12 === 0 ? 12 : index % 12) }}:00 </p>
                        </div>
                    </template>
                    <p class="text-xs text-gray-500 font-semibold absolute bottom-0 -translate-y-1/2">
                        {{ settings.DATE_FORMAT === 'HH:mm' ? 24 : 12 }}:00
                    </p>
                </div>
                <div @contextmenu.prevent ref="schedule-container" class="!h-full grid-stack flex-1 relative mx-0.5">
                    <div class="absolute size-full z-10 pointer-events-none p-0.5">
                        <div class="w-full bg-primary/10 backdrop-saturate-50 rounded-t-sm"
                            :style="{ height: `${dayPercentage * 100}%` }" />
                        <div class="w-full border-black/20 border-t-2" />
                    </div>
                    <StepForwardIcon
                        class="absolute stroke-transparent fill-primary -translate-y-1/2 -translate-x-full size-3"
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
                        <div class="grid-stack-item" :gs-x="0" :gs-y="session.startTime.hour"
                            :gs-h="session.endTime.diff(session.startTime, 'hours').hours" :gs-id="`s${session.id}`"
                            :id="`s${session.id}`"
                            :style="{ '--color-hover': activities.find(a => a.name === session.activity)?.color ?? 'var(--primary)' }">
                            <div @contextmenu="handleSessionDelete(session.id);" @click="handleSession($event, session)"
                                class="rounded-sm flex-1 grid-stack-item-content !overflow-hidden hover:ring-1 ring-gray-400 transition-shadow bg-hover">
                                <div class="flex items-start justify-between gap-1">
                                    <p class="capitalize text-black font-extrabold text-xl px-1 opacity-30"> {{
                                        session.activity }} </p>
                                    <!-- <CircleDotIcon v-if="session.status === SessionStatusEnum.PENDING" class="stroke-3 size-4 text-gray-200 m-1.5" />
                                    <CheckIcon v-else-if="session.status === SessionStatusEnum.COMPLETED" class="stroke-4 size-4 text-gray-200 m-1.5" />
                                    <CheckCheckIcon v-else-if="session.status === SessionStatusEnum.SUCCESS" class="stroke-4 size-4 text-gray-200 m-1.5" />
                                    <CircleSlashIcon v-else-if="session.status === SessionStatusEnum.SKIPPED" class="stroke-4 size-4 text-gray-200 m-1.5" /> -->
                                    <!-- ZapIcon -->

                                </div>
                                <div class="absolute opacity-15 left-0 -mx-2 flex">
                                    <component
                                        v-for="category in activities.find(a => a.name === session.activity)?.categories ?? []"
                                        :is="LifeCategoryIconMapper[category]" class="size-8 text-black" />
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </FunctionCard>
</template>
