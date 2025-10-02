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
    highlight?: boolean;
}

defineProps<IFunctionCardProps>();

</script>

<template>
    <Card class="gap-0 !overflow-hidden py-4" :class="{
        'shadow-primary/75': highlight
    }">
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
        <CardContent class="flex-1 px-4 pt-2 overflow-hidden">
            <slot />
        </CardContent>
    </Card>
</template>