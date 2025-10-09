<script setup lang="ts">
import { ISession } from '@/core/interfaces/entities/ISession';
import { computed } from 'vue';
import { reactiveComputed } from '@vueuse/core';
import useActivity from '@/store/useActivity';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { PenIcon } from 'lucide-vue-next';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { PopoverContent } from '../ui/popover';
import { ActivityStatusEnum } from '@/core/enums/activityStatusEnum';


const props = defineProps<{ existingSession: ISession }>();
const emits = defineEmits<{
    create: [session: ISession];
    update: [id: number, session: ISession];
}>();

const sessionForm = reactiveComputed<ISession>(() => ({ ...props.existingSession }));
const { activities } = useActivity();
const activeActivities = computed(() => activities.filter((a) => a.status === ActivityStatusEnum.ACTIVE));
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
}

</script>

<template>
    <PopoverContent side="right" align="start">
        <form id="session-form" name="session-form" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-2">
                <!-- Activity Selection -->
                <Select v-model="selectedActivity">
                    <SelectTrigger class="w-full">
                        <SelectValue>
                            <p class="flex gap-2 items-center" v-if="selectedActivity">
                                <span class="rounded-full block size-3"
                                    :style="{ backgroundColor: selectedActivity.color }">
                                </span>
                                {{ selectedActivity.name }}
                            </p>
                            <p v-else>
                                Select Activity...
                            </p>
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem v-for="activity in activeActivities" :value="activity" class="focus:bg-hover/10"
                                :style="{ '--color-hover': activity.color }">
                                <span class="rounded-full size-3" :style="{ backgroundColor: activity.color }">
                                </span> {{ activity.name }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Input v-model="sessionForm.title" type="text" placeholder="Session Goal" />

                <Textarea id="description" v-model="sessionForm.notes" placeholder="Session Notes..." class="resize-none" />

                <Button :class="{ 'text-background/85 hover:text-background': selectedActivity }" type="submit" variant="outline"
                    form="session-form" :style="{ backgroundColor: selectedActivity?.color }">
                    <PenIcon /> {{ props.existingSession.id ? "Update" : "Create" }}
                </Button>
            </div>
        </form>
    </PopoverContent>
</template>
