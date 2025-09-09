<script setup lang="ts">
import FunctionCard from '../common/FunctionCard.vue';
import { DateTime } from 'luxon';

const currentMonth = DateTime.now().monthLong; 

</script>

<template>
    <FunctionCard title="Monthly Goals" :sub-title="currentMonth">
        <template #default>
            <div class="p-4 h-full rounded-lg hover:bg-accent transition-colors duration-300 cursor-text focus-within:bg-accent">
          
            </div>
        </template>
    </FunctionCard>
</template>