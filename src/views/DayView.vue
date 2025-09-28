<script setup lang="ts">
import DayGridCardLayout from '@/components/core/layout/DayGridCardLayout.vue';
import DayHeader from '@/components/core/layout/DayHeader.vue';

</script>

<template>
    <div class="h-full flex flex-col overflow-hidden">
        <DayHeader  /> 
        <main class="flex-1 px-2 pb-2">
            <Suspense>
                <DayGridCardLayout />
            </Suspense>
        </main>
    </div>
</template>