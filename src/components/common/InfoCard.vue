<script setup lang="ts">
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

interface IInfoCardProps {
    title: string;
    subTitle?: string;

}

defineProps<IInfoCardProps>();

</script>

<template>
    <Card class="gap-0">
        <CardHeader class="grid grid-cols-3 gap-4">
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
        <CardContent class="h-full">
            <slot />
        </CardContent>
    </Card>
</template>