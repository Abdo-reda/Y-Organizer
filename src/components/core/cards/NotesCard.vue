<script setup lang="ts">
import FunctionCard from "@/components/common/FunctionCard.vue";
import useDayNotes from "@/store/useDayNotes";
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extensions'
import { onBeforeMount } from "vue";
import { NotebookTabsIcon } from "lucide-vue-next";

const { notes, onNotesFetched, updateNotes } = useDayNotes();
//TODO: Fix placeholder

//TODO:
//- fix the colors? text color primary? bg primary? so on ..
//- actions
//- copy action?
//- clear action
//- make writing text smooth like how it is on vercel editor, the cursor moves smoothly and the text slides in smoothly to some extent and doesn't just jump around.
//- maybe add a gradient on teh bottom, so that the text starts fading towards the end...
//- it would be cool if we can add animation when you over scroll like on mobile phones.

//----> I want things to feel fun and smooth and clean to use... little haptic and small feedbacks and animations.

const editor = useEditor({
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: "Click here to add your thoughts, reflections, notes for today...",
        }), 
    ],
    editorProps: {
        attributes: {
            class: "w-full h-full border-none outline-none text-gray-700 bg-transparent overflow-auto scroll-hidden focus:outline-none prose prose-sm prose-li:[&>p]:m-0",
            // [&::placeholder]:select-none placeholder-gray-400
        },
    },
    content: notes.value,
    onUpdate: ({ editor }) => notes.value = editor.getHTML(),
    onBlur: () => handleSaveNotes(),
});

function handleSaveNotes() {
    updateNotes(notes.value);
}

onNotesFetched(() => {
    if (editor.value) editor.value.commands.setContent(notes.value);
});

onBeforeMount(() => {
    editor.value?.destroy();
});
</script>

<template>
    <FunctionCard title="Notes">
        <template #card-icon> 
            <NotebookTabsIcon />
        </template>
        <template #default>
            <div
                class="p-4 h-full rounded-lg hover:bg-primary/8 transition-colors duration-300 cursor-text focus-within:bg-primary/8">
                <EditorContent autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                    :editor="editor" class="w-full h-full" />
            </div>
        </template>
    </FunctionCard>
</template>

<style lang="css">
.is-editor-empty:first-child::before {
    color: var(--color-gray-400);
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
}
</style>