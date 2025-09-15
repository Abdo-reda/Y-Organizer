<script setup lang="ts">
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

interface IFunctionCardProps {
    title: string;
    subTitle?: string;

}

defineProps<IFunctionCardProps>();

</script>

<template>
    <Card class="gap-0 py-4">
        <CardHeader class="flex gap-2 px-4 items-center">
            <div class="flex-1 relative">
                <slot name="header-left-actions" />
            </div>
            <div class="flex-1 text-center select-none">
                <CardTitle class="text-xl font-bold">{{ title }}</CardTitle>
                <CardDescription>{{ subTitle }}</CardDescription>
            </div>
            <div class="flex-1 relative">
                <slot name="header-right-actions" />
            </div>
        </CardHeader>
        <CardContent class="h-full px-4">
            <slot />
        </CardContent>
    </Card>
</template>