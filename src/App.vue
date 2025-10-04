<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useCurrentTime } from './store/useCurrentTime';
import useDaySessions from './store/useDaySessions';
import useActivity from './store/useActivity';

const { init, clean } = useCurrentTime();
const { activities } = useActivity();
const { currentSession } = useDaySessions();

const currentActivity = computed(() => activities.find((a) => a.name === currentSession?.value?.activity));

const dynamicStyles = computed(() => ({
    '--primary': currentActivity.value?.color || 'oklch(0.205 0 0)', 
}));

onMounted(() => {
    init();
});

onUnmounted(() => {
    clean();
});
</script>

<template>
    <RouterView v-slot="{ Component, route }" :style="dynamicStyles">
        <!-- <Transition name="fade" mode="out-in"> -->
            <component id="view-container" :key="route.name" class="flex-1 max-h-full overflow-hidden gradient-background" :is="Component" />
        <!-- </Transition> -->
    </RouterView>
</template>
