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
        <CardHeader class="grid grid-cols-3 gap-4 px-4">
            <div>
                <slot name="header-left-actions" />
            </div>
            <div class="text-center">
                <CardTitle class="text-2xl font-bold">{{ title }}</CardTitle>
                <CardDescription>{{ subTitle }}</CardDescription>
            </div>
            <div>
                <slot name="header-right-actions" />
            </div>
        </CardHeader>
        <CardContent class="h-full px-4">
            <slot />
        </CardContent>
    </Card>
</template>