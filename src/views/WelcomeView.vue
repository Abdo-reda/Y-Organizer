<script setup lang="ts">
import { SettingsCodeEnum } from '@/core/enums/settingsCodeEnum';
import useSettings from '@/store/useSettings';
import { rand, useIntervalFn } from '@vueuse/core';
import { ChevronDownIcon } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';


useIntervalFn(() => {
  placeholder.value = placeholderNames[rand(0, placeholderNames.length - 1)]
}, 1500)

const {appView, settings, updateSetting} = useSettings();
const placeholderNames = ['Nayera', 'Rana', 'Nour', 'Malek', 'Maya', 'Julia', 'Sherif', 'Amr', 'Ismeal', 'Nancy', 'Amira', 'Ayoub', 'Gomaa', 'Sayco', 'Mai', 'Mostafa', 'Hend', 'Sameh', 'Yehia', 'Momdouh', 'Kiro', 'Jana', 'Obu', 'Rawan', 'Marina', 'Abanoub', 'Hamza']
const placeholder = ref(placeholderNames[0])
const showLogo = ref(false);
const name = ref('');

function showDayView() {
    if (name.value) updateSetting(SettingsCodeEnum.USER_NAME, name.value)
    showLogo.value = false;
    appView.value = 'day';
}

onMounted(() => showLogo.value = true)

</script>

<template>
	<div class="h-full flex flex-col p-2">
        <div class="app-drag p-8" />
		<div class="flex-1 flex flex-col gap-8 items-center justify-center w-full select-none" v-auto-animate>
			<div v-if="showLogo" class="relative  brightness-85 rounded-full aspect-square p-8 flex items-center justify-center">
				<img class="absolute opacity-30" src="@/assets/images/sphere.png" />
				<span class="text-8xl font-bold">Y</span>
			</div>
            <div v-if="showLogo" class="flex gap-3 items-center">
                <p class="text-5xl font-semibold pl-12"> Hi,  </p> 
                <form @submit.prevent="showDayView" v-if="!settings.USER_NAME">
                    <input 
                        v-model="name"
                        :placeholder="placeholder"
                        class="focus-within:outline-none placeholder:text-muted-foreground/25 text-5xl transition-[width]" 
                        name="name"
                        type="text"
                        autocomplete="off"
                        autocorrect="off"
                        autofocus 
                        :style="{ width: `${Math.max(5, Math.min(24, name.length || placeholder.length+1))}ch` }" 
                    />
                </form>
                <p class="text-5xl pr-12" v-else> {{ settings.USER_NAME }}! </p>
            </div>
            <button @click="showDayView" :autofocus="!!settings.USER_NAME" class="w-1/4 flex items-center justify-center p-4 group focus-within:outline-none">
                <ChevronDownIcon class="size-8 text-muted-foreground/75 group-hover:text-foreground transition-colors group-focus:text-foreground animate-bounce" />
            </button>
		</div>
	</div>
</template>
