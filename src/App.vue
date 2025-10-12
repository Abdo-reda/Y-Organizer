<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch, watchEffect } from 'vue';
import { useCurrentTime } from './store/useCurrentTime';
import useDaySessions from './store/useDaySessions';
import useActivity from './store/useActivity';
import useSettings from './store/useSettings';
import { useColorMode } from '@vueuse/core';
import AppView from './views/AppView.vue';
import { getFontSize } from './core/enums/settingsCodeEnum';

const theme = useColorMode({
    disableTransition: true
});
const { init, clean, currentTime } = useCurrentTime();
const { settings } = useSettings();
const { activities } = useActivity();
const { currentSession } = useDaySessions();

const currentActivity = computed(() => activities.find((a) => a.name === currentSession?.value?.activity));

const dynamicStyles = computed(() => ({
    '--primary': currentActivity.value?.color || '', 
}));

watch(() => settings.FONT_SIZE, (newSize) => {
  const htmlElement = document.documentElement;
  htmlElement.style.setProperty('--app-font-size', `${getFontSize(newSize)}%`); 
}, { immediate: true });

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
    <Suspense>
        <AppView :style="dynamicStyles" id="view-container" class="flex-1 max-h-full overflow-hidden gradient-background" />
    </Suspense>
</template>
