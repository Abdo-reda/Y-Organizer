<script setup lang="ts">
import { ref } from 'vue';
import FunctionCard from '../common/FunctionCard.vue';

//TODO:
    //- should we support markdown? rich text?
    //- fix the colors? text color primary? bg primary? so on ..
    //- actions
        //- copy action?
        //- clear action
    //- hide scrollbar? //- should there be buttons to scroll up and down instead?
    //- make writing text smooth like how it is on vercel editor, the cursor moves smoothly and the text slides in smoothly to some extent and doesn't just jump around.
    //- maybe add a gradient on teh bottom, so that the text starts fading towards the end...
    //- it would be cool if we can add animation when you over scroll like on mobile phones.
 
//----> I want things to feel fun and smooth and clean to use... little haptic and small feedbacks and animations.

const notes = ref('');

//
//https://www.npmjs.com/package/marked
//https://miaolz123.github.io/vue-markdown/
//https://markdown-it.github.io/

function saveNote() {
    console.log('--- save note');
}

</script>

<template>
    <FunctionCard title="Notes">
        <template #default>
            <div class="p-4 h-full rounded-lg hover:bg-accent transition-colors duration-300 cursor-text focus-within:bg-accent">
                <textarea @focusout="saveNote" ref="notesTextarea" v-model="notes"
                    placeholder="Click here to add your thoughts, reflections, notes for today..."
                    class="w-full h-full resize-none border-none outline-none text-gray-700 placeholder-gray-400 bg-transparent scroll-hidden"></textarea>
            </div>
        </template>
    </FunctionCard>
</template>