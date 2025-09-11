<script setup lang="ts">
import FunctionCard from '@/components/common/FunctionCard.vue';

interface IFocusCardProps {
    // session:
}

defineProps<IFocusCardProps>();

</script>

<template>
    <FunctionCard title="Focus">
        <template #default>
            <p> </p>
        </template>
    </FunctionCard>
</template>