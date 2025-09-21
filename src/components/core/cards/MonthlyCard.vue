<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';
import useDayState from '@/store/useDayState';
import { computed } from 'vue';

const { selectedDay } = useDayState();
const currentMonth = computed(() => selectedDay.value.monthLong);

</script>

<template>
    <FunctionCard title="Monthly Goals" :sub-title="currentMonth">
        <template #default>
            <div class="p-4 h-full rounded-lg hover:bg-accent transition-colors duration-300 cursor-text focus-within:bg-accent">
          
            </div>
        </template>
    </FunctionCard>
</template>