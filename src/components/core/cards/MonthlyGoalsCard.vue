<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import GoalDialog from '@/components/dialogs/GoalDialog.vue';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { GoalStatusEnum } from '@/core/enums/goalStatusEnum';
import { IGoal } from '@/core/interfaces/entities/IGoal';
import useActivity from '@/store/useActivity';
import useDayState from '@/store/useDayState';
import useMonthlyGoals from '@/store/useMonthlyGoals';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { CheckCheckIcon, PlusIcon } from 'lucide-vue-next';
import { computed, ref } from 'vue';

//------ TODO:? all goals? completed goals, this month only? max 3 goals? where do we show all fo this? think about the design what about progress?
// const goalsContainer = useTemplateRef('all-goals-container');
// const goalsContainerEl = computed(() => goalsContainer.value?.$el)
const { selectedDay } = useDayState();
const { activities } = useActivity();
const { monthlyGoals, createGoal, updateGoal, deleteGoal } = useMonthlyGoals();
const activeGoals = computed(() => monthlyGoals.filter(g => g.status === GoalStatusEnum.ACTIVE));
const inactiveGoals = computed(() => monthlyGoals.filter(g => g.status !== GoalStatusEnum.ACTIVE).sort((a,b) => a.status.localeCompare(b.status)));
const currentMonth = computed(() => selectedDay.value.monthLong);

const goalEditDialogOpen = ref(false);
const editGoal = ref<IGoal | null>(null);

function handleGoalPrimary(event: MouseEvent, goal: IGoal) {
    if (event.button === 0 && event.ctrlKey) {
        openEditDialog(goal);
    } else if (event.button === 0 && event.altKey) {
        goal.status = goal.status === GoalStatusEnum.COMPLETED ? GoalStatusEnum.ACTIVE : GoalStatusEnum.COMPLETED;
        updateGoal(goal.id, goal);
    }
}

function handleGoalSecondary(event: MouseEvent, goal: IGoal) {
    if (event.altKey) {
        deleteGoal(goal.id);
    } else {
        goal.status = goal.status === GoalStatusEnum.DISABLED ? GoalStatusEnum.ACTIVE : GoalStatusEnum.DISABLED;
        updateGoal(goal.id, goal);
    }
}

function handleCreate(goal: IGoal) {
    createGoal(goal);
    closeEditDialog();
}

function handleUpdate(id: number, goal: IGoal) {
    updateGoal(id, goal);
    closeEditDialog();
}

function openEditDialog(goal: IGoal | null = null) {
    editGoal.value = goal;
    goalEditDialogOpen.value = true;
}

function closeEditDialog() {
    editGoal.value = null;
    goalEditDialogOpen.value = false;
}

</script>

<template>
    <FunctionCard title="Monthly Goals" :sub-title="currentMonth">
        <template #default>
            <Dialog v-model:open="goalEditDialogOpen">
                <GoalDialog :existing-goal="editGoal" @create="handleCreate" @update="handleUpdate" />
            </Dialog>
            <Carousel>
                <CarouselContent @contextmenu.prevent>
                    <CarouselItem>
                        <TransitionGroup name="auto" tag="ul" class="h-full select-none relative">
                            <li v-for="goal in activeGoals" :key="goal.id" @click="handleGoalPrimary($event, goal)"
                                @contextmenu="handleGoalSecondary($event, goal)"
                                class="flex items-center gap-4 p-3 hover:bg-hover/8 rounded-md transition-colors relative"
                                :style="{
                                    '--color-hover': activities.find(a => a.name === goal.activity)?.color
                                }">

                                <div class="size-8 rounded-full bg-gradient-to-br from-hover/50 to-hover" />

                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-semibold text-gray-900 truncate">{{ goal.title }}</p>
                                    <p class="text-xs text-gray-600 truncate">{{ goal.description }}</p>
                                </div>
                            </li>
                        </TransitionGroup>
                    </CarouselItem>
                    <CarouselItem>
                        <TransitionGroup name="auto" tag="ul" class="h-full select-none relative">
                            <li v-for="goal in inactiveGoals" :key="goal.id" @click="handleGoalPrimary($event, goal)"
                                @contextmenu="handleGoalSecondary($event, goal)"
                                class="flex items-center gap-4 p-3 hover:bg-hover/8 rounded-md transition-colors relative"
                                :class="{
                                    'saturate-50 opacity-60': goal.status === GoalStatusEnum.DISABLED,
                                }" :style="{
                                    '--color-hover': activities.find(a => a.name === goal.activity)?.color
                                }">

                                <div class="size-8 rounded-full bg-gradient-to-br from-hover/50 to-hover flex items-center justify-center">
                                    <CheckCheckIcon v-if="goal.status === GoalStatusEnum.COMPLETED" class="text-white size-5" />
                                </div>

                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-semibold text-gray-900 truncate" :class="{
                                        'line-through': goal.status === GoalStatusEnum.COMPLETED
                                    }">{{ goal.title }}</p>
                                    <p class="text-xs text-gray-600 truncate" :class="{
                                        'line-through': goal.status === GoalStatusEnum.COMPLETED
                                    }">{{ goal.description }}</p>
                                </div>
                            </li>
                        </TransitionGroup>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </template>
        <template #header-right-actions>
            <div class="flex justify-end gap-1">
                <Button @click="openEditDialog()" variant="ghost" size="icon">
                    <PlusIcon />
                </Button>
            </div>
        </template>
    </FunctionCard>
</template>