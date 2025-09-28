<script setup lang="ts">
// TODO: fix transitoin between routes... remove routes?
</script>

<template>
    <RouterView v-slot="{ Component, route }">
        <!-- <Transition name="fade" mode="out-in"> -->
        <component :key="route.name" class="flex-1 max-h-full overflow-hidden" :is="Component" />
        <!-- </Transition> -->
    </RouterView>
</template>