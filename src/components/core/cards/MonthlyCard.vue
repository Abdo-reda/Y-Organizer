<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { IGoal } from '@/core/interfaces/entities/IGoal';
import useDayState from '@/store/useDayState';
import { PlusIcon } from 'lucide-vue-next';
import { computed, ref } from 'vue';

const { selectedDay } = useDayState();
const currentMonth = computed(() => selectedDay.value.monthLong);

const goalEditDialogOpen = ref(false);
const editGoal = ref<IGoal | null>(null);

function openEditDialog(goal: IGoal | null = null) {
    editGoal.value = goal;
    goalEditDialogOpen.value = true;
}

</script>

<template>
    <FunctionCard title="Monthly Goals" :sub-title="currentMonth">
        <template #default>
            <Dialog v-model:open="goalEditDialogOpen">
                <!-- <ActivityDialog :existing-task="editTask" @create="handleCreate" @update="handleUpdate" /> -->
            </Dialog>
            <div
                class="p-4 h-full rounded-lg hover:bg-accent transition-colors duration-300 cursor-text focus-within:bg-accent">

            </div>
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