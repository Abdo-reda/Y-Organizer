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
        <CardHeader class="grid grid-cols-5 gap-4 px-4 items-center">
            <div class="col-span-1">
                <slot name="header-left-actions" />
            </div>
            <div class="text-center col-span-3">
                <CardTitle class="text-xl font-bold">{{ title }}</CardTitle>
                <CardDescription>{{ subTitle }}</CardDescription>
            </div>
            <div class="col-span-1">
                <slot name="header-right-actions" />
            </div>
        </CardHeader>
        <CardContent class="h-full px-4">
            <slot />
        </CardContent>
    </Card>
</template>