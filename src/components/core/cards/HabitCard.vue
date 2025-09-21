<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import useDayState from '@/store/useDayState';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { computed } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-vue-next';
import { IHabit } from '@/core/interfaces/entities/IHabit';

const { selectedDay } = useDayState();
const currentMonth = computed(() => selectedDay.value.monthLong);

//TODO: look into
//- 12/31 days 
//- progress bar?
//- all view and gradients of bg.
//- and make the card work...

const habits: IHabit[] = [
    { title: 'Habit 1' },
    { title: 'Habit 2' },
    { title: 'Habit 3' }
]

</script>

<template>
    <FunctionCard title="Habits" :sub-title="currentMonth">
        <template #default>
            <div class="flex flex-col items-center gap-2 h-full">
                <Carousel class="select-none w-1/2">
                    <CarouselContent>
                        <CarouselItem v-for="habit in habits" :key="habit.title">
                            <p class="font-semibold text-lg text-center"> {{ habit.title }} </p>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious variant="ghost" class="size-6 text-gray-400 disabled:opacity-0 left-0 -translate-x-full">
                        <ChevronLeftIcon />
                    </CarouselPrevious>
                    <CarouselNext variant="ghost" class="size-6 text-gray-400 disabled:opacity-0 right-0 translate-x-full">
                        <ChevronRightIcon />
                    </CarouselNext>
                </Carousel>
                <!-- TODO: fix this shit in firefox -->
                <div class="flex-1">
                    <div class="grid grid-cols-7 auto-rows-fr gap-2 h-full">
                        <div v-for="i in 30" class="rounded-xs aspect-square bg-gray-200 hover:transition-none transition-colors hover:bg-amber-400">
                        </div>
                    </div> 
                </div>
                <!-- <div v-for="i in 2" class="rounded-xs border-2 border-dashed border-gray-200 aspect-square" /> -->
            </div>
        </template>
    </FunctionCard>
</template>