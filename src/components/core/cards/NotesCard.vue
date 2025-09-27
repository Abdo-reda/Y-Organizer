<script setup lang="ts">
import FunctionCard from "@/components/common/FunctionCard.vue";
import useDayNotes from "@/store/useDayNotes";

const { notes, updateNotes } = useDayNotes();

//TODO:
//- should we support markdown? rich text?
//https://github.com/nhn/tui.editor
//- make a contenteditable div in this case... and add smooth caret animation...
//- fix the colors? text color primary? bg primary? so on ..
//- actions
//- copy action?
//- clear action
//- make writing text smooth like how it is on vercel editor, the cursor moves smoothly and the text slides in smoothly to some extent and doesn't just jump around.
//- maybe add a gradient on teh bottom, so that the text starts fading towards the end...
//- it would be cool if we can add animation when you over scroll like on mobile phones.

//----> I want things to feel fun and smooth and clean to use... little haptic and small feedbacks and animations.


function handleSaveNotes() {
	updateNotes(notes.value);
}
</script>

<template>
	<FunctionCard title="Notes">
		<template #default>
			<div class="p-4 h-full rounded-lg hover:bg-gray-100/75 transition-colors duration-300 cursor-text focus-within:bg-gray-100/75">
				<textarea
					:spellcheck="false"
					@focusout="handleSaveNotes"
					v-model="notes"
					placeholder="Click here to add your thoughts, reflections, notes for today..."
					class="w-full h-full resize-none border-none outline-none [&::placeholder]:select-none text-gray-700 placeholder-gray-400 bg-transparent scroll-hidden"
				></textarea>
			</div>
		</template>
	</FunctionCard>
</template>
