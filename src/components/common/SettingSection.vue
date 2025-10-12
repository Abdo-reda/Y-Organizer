<script setup lang="ts">

interface ISettingSectionProps {
    title: string;
}

defineProps<ISettingSectionProps>();

</script>

<template>
	<div class="flex flex-col gap-4">
		<h3 class="text-base font-semibold">{{ title }}</h3>
		<div class="flex flex-col gap-4">
            <slot />
		</div>
	</div>
</template>
