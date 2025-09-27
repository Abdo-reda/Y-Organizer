<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import ActivityDialog from '@/components/dialogs/ActivityDialog.vue';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import useActivity from '@/store/useActivity';
import { PlusIcon } from 'lucide-vue-next';

const { activities, createActivity, updateActivity } = useActivity();

</script>

<template>
    <FunctionCard title="Activities">
        <template #default>
            <div class="flex h-full select-none">
                <div class="h-full relative flex items-center justify-center flex-1">
                    <svg viewBox="0 0 100 100" class="w-full h-full">
                        <circle cx="50" cy="50" r="45" fill="none" class="stroke-gray-300" stroke-width="4" />

                        <!-- <circle v-for="(activity, index) in activitiesWithData" :key="activity.id" cx="100" cy="100"
                            r="80" fill="none" :stroke="activity.color" stroke-width="12"
                            :stroke-dasharray="`${activity.circumference} ${totalCircumference}`"
                            :stroke-dashoffset="activity.offset"
                            class="transition-all duration-500 hover:stroke-width-16 cursor-pointer"
                            @click="openEditModal(activity)" /> -->
                    </svg>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="text-center">
                            <div class="text-2xl font-bold">{{ 0 }}h</div>
                            <div class="text-sm text-gray-500">Total</div>
                        </div>
                    </div>
                </div>
                <div v-if="activities.length" class="h-full flex flex-col gap-1 my-4 mx-2 max-w-1/2">
                    <div v-for="activity in activities" :key="activity.name"
                        class="flex items-center justify-between rounded-lg hover:bg-hover transition-colors"
                        :style="{ '--color-hover': activity.color }">
                        <div class="flex items-center space-x-3">
                            <div class="size-3 rounded-full" :style="{ backgroundColor: activity.color }"></div>
                            <div>
                                <div class="font-medium text-gray-900">{{ activity.name }}</div>
                                <div class="text-sm text-gray-500">{{ activity.description }}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="font-semibold text-gray-900">{{ '2' }}h</div>
                            <div class="text-sm text-gray-500">{{ '2' }}%</div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #header-right-actions>
            <div class="flex justify-end gap-1">
                <Dialog>
                    <DialogTrigger>
                        <Button variant="ghost" size="icon">
                            <PlusIcon />
                        </Button>
                    </DialogTrigger>
                    <ActivityDialog :existing-activity="null" @create="createActivity" @update="updateActivity" />
                </Dialog>
            </div>
        </template>
    </FunctionCard>
</template>