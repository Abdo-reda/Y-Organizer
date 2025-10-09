<script setup lang="ts">
import { computed, onMounted, onUnmounted, watchEffect } from 'vue';
import { useCurrentTime } from './store/useCurrentTime';
import useDaySessions from './store/useDaySessions';
import useActivity from './store/useActivity';
import useSettings from './store/useSettings';
import { useColorMode } from '@vueuse/core';

const theme = useColorMode();
const { init, clean, currentTime } = useCurrentTime();
const { settings } = useSettings();
const { activities } = useActivity();
const { currentSession } = useDaySessions();

const currentActivity = computed(() => activities.find((a) => a.name === currentSession?.value?.activity));

const dynamicStyles = computed(() => ({
    '--primary': currentActivity.value?.color || '', 
}));

watchEffect(() => {
    const appTheme = settings.THEME;
    if (appTheme === 'ambient') currentTime.value.hour < 12 ? theme.value = 'light' : theme.value = 'dark' 
    else theme.value = appTheme;
})

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
            <Suspense>
                <component id="view-container" :key="route.name" class="flex-1 max-h-full overflow-hidden gradient-background" :is="Component" />
            </Suspense>
        <!-- </Transition> -->
    </RouterView>
</template>
