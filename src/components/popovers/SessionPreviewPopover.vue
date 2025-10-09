<script setup lang="ts">
import { ISession } from '@/core/interfaces/entities/ISession';
import { computed } from 'vue';
import useActivity from '@/store/useActivity';
import { PopoverContent } from '../ui/popover';
import { GoalIcon, NotepadTextIcon } from 'lucide-vue-next';

const { activities } = useActivity();
const props = defineProps<{ session: ISession }>();
const sessionActivity = computed(() => activities.find(a => a.name === props.session.activity));

</script>

<template>
    <PopoverContent side="right" align="start" :style="{'--color-hover': sessionActivity?.color}" class="p-0">
        <div class="flex flex-col gap-3 bg-hover/5 p-4">
            <div class="flex items-center justify-center gap-2">
                <span class="text-base font-semibold text-hover"> {{ session.activity }} </span>
            </div>

            <div class="flex items-start gap-2">
                <GoalIcon class="size-4 text-foreground/75 m-0.5" />
                <p class="flex-1 text-base leading-tight"> {{ session.title }} </p>
            </div>

            <div class="flex items-start gap-2">
                <NotepadTextIcon class="size-4 text-muted-foreground m-0.5" />
                <p  class="flex-1 text-sm text-muted-foreground">
                    <span v-if="session.notes"> {{ session.notes }} </span> 
                    <span v-else class="italic"> no notes... </span> 
                </p>
            </div>

            <!-- <div v-if="hasTasks" class="flex flex-col gap-2 pt-2 border-t">
                <h4 class="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Tasks
                </h4>
                <ul class="flex flex-col gap-1.5">
                    <li v-for="task in session.tasks" :key="task.id" class="flex items-start gap-2 text-sm">
                        Check icon for completed tasks
                        <span class="mt-0.5 flex-shrink-0 rounded-sm flex items-center justify-center"
                            :class="task.completed ? 'text-green-600' : 'text-muted-foreground/30'">
                            <CheckIcon :size="16" :stroke-width="task.completed ? 2.5 : 2" />
                        </span>

                        Task name with strikethrough if completed
                        <span :class="task.completed ? 'line-through text-muted-foreground' : ''" class="leading-tight">
                            {{ task.name }}
                        </span>
                    </li>
                </ul>
            </div> -->
        </div>
    </PopoverContent>
</template>
