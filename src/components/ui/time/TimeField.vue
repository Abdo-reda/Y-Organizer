<script setup lang="ts">
import { TimeFieldInput, TimeFieldRoot } from "reka-ui"

</script>

<template>
    <TimeFieldRoot v-slot="{ segments }"
        class="flex w-full min-w-0 rounded-md border bg-transparent px-2 py-0.5 text-base shadow-xs transition-[color,box-shadow] outline-none dark:bg-input/30 border-input focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[1px]">
        <template v-for="item in segments" :key="item.part">
            <TimeFieldInput v-if="item.part === 'literal'" :part="item.part">
                {{ item.value }}
            </TimeFieldInput>
            <TimeFieldInput v-else :part="item.part"
                class="rounded p-0.5 focus:outline-none text-sm">
                {{ item.value }}
            </TimeFieldInput>
        </template>
    </TimeFieldRoot>
</template>
