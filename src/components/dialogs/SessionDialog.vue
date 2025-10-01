<script setup lang="ts">
import { ISession } from '@/core/interfaces/entities/ISession';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { computed } from 'vue';
import { reactiveComputed } from '@vueuse/core';
import { DateTime } from 'luxon';
import { SessionStatusEnum } from '@/core/enums/sessionStatusEnum';
import useActivity from '@/store/useActivity';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { PenIcon } from 'lucide-vue-next';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const { activities } = useActivity();

const props = defineProps<{ existingSession: ISession | null }>();
const emits = defineEmits<{
    create: [session: ISession];
    update: [id: number, session: ISession];
}>();

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

const sessionForm = reactiveComputed<ISession>(() =>
    props.existingSession ? { ...props.existingSession } : generateDefaultSession()
);

const selectedActivity = computed({
    get: () => activities.find(a => a.name === sessionForm.activity),
    set: (activity) => {
        if (activity) sessionForm.activity = activity?.name;
    }
});

function handleSubmit() {
    const updatedSession = { ...sessionForm };
    if (props.existingSession?.id) {
        emits("update", props.existingSession.id, updatedSession);
    } else {
        emits("create", updatedSession);
    }
    Object.assign(sessionForm, generateDefaultSession());
}

</script>

<template>
    <DialogContent>
        <DialogHeader>
            <div class="flex justify-between">
                <DialogTitle>
                    Session
                </DialogTitle>
                <div class="flex items-center gap-0.5">
                    <!-- <Input id="start-time" type="time" required /> -->
                    -
                    <!-- <Input id="end-time" type="time" required /> -->
                </div>
            </div>
            <DialogDescription class="hidden"> Create or edit a session. </DialogDescription>
        </DialogHeader>
        <form id="session-form" name="session-form" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-3">
                <!-- Session Title -->
                <div class="flex flex-col gap-1.5">
                    <Label>Title</Label>
                    <Input v-model="sessionForm.title" type="text" placeholder="Enter session title..." />
                </div>

                <!-- Activity Selection -->
                <div class="flex flex-col gap-1.5">
                    <Label>Activity</Label>
                    <Select v-model="selectedActivity">
                        <SelectTrigger class="w-full">
                            <SelectValue placeholder="Select a activity">
                                <span class="rounded-full size-3" :style="{backgroundColor: selectedActivity?.color}"> </span>
                                 {{ selectedActivity?.name }}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem v-for="activity in activities" :value="activity"
                                    class="focus:bg-hover/10" :style="{ '--color-hover': activity.color }">
                                    <span class="rounded-full size-3" :style="{ backgroundColor: activity.color }">
                                    </span> {{ activity.name }}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Notes -->
                <div class="flex flex-col gap-1.5">
                    <Label>Notes</Label>
                    <Textarea id="description" v-model="sessionForm.notes" placeholder="Add any notes about this session..."  class="resize-none" />
                </div>
            </div>
        </form>
        <DialogFooter>
            <Button type="submit" variant="outline" form="session-form">
                <PenIcon /> {{ props.existingSession ? "Update" : "Create" }}
            </Button>
        </DialogFooter>
    </DialogContent>
</template>
