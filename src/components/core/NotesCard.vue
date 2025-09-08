<script setup lang="ts">
import { ref } from 'vue';
import InfoCard from '../common/InfoCard.vue';

//TODO:
    //- should we support markdown? rich text?
    //- fix the colors? text color primary? bg primary? so on ..
    //- actions
        //- copy action?

const notes = ref('');

//
//https://www.npmjs.com/package/marked
//https://miaolz123.github.io/vue-markdown/
//https://markdown-it.github.io/

</script>

<template>
    <InfoCard title="Notes">
        <template #default>
            <div class="p-4 h-full rounded-lg hover:bg-accent transition-colors duration-300 cursor-text focus-within:bg-accent">
                <textarea ref="notesTextarea" v-model="notes"
                    placeholder="Click here to add your thoughts, reflections, notes for today..."
                    class="w-full h-full resize-none border-none outline-none text-gray-700 placeholder-gray-400 bg-transparent"></textarea>
            </div>
        </template>
    </InfoCard>
</template>