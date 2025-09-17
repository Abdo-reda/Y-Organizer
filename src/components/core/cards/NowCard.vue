<script setup lang="ts">
import FunctionCard from "@/components/common/FunctionCard.vue";
import { Button } from "@/components/ui/button";
import { ISession } from "@/core/interfaces/entities/ISession";
import { ITask } from "@/core/interfaces/entities/ITask";
import { CheckIcon, CircleDashedIcon, CircleDotDashedIcon, NotepadTextIcon, TriangleDashedIcon, ZapIcon } from "lucide-vue-next";
import { computed, ref, useTemplateRef } from "vue";

//TODO: CURRENT SESSION CARD
//- current activity title in bold and underneath it in gray is the start and end time of the session and how much is left from now //make it a string for now, I don't want any date calcluations.
//- underneath them is the active task
//- underneath it is 3 slots for tasks, each task can be cleared, deleted, edited, and marked as done and marked as active
//- max of 3 tasks you can add. other than the active task //maybe only three slots
//- a way to make a task active, and mark task as done
//- a way to add task.. tasks should be simple only a title //maybe a description
//- a way to clear a task (not going to work on that session)
//- tasks are automatically put on the slots but you can clear them
//- when you create a task, you write title and description or choose an existing task from today so the modal will have small cards or suggestions on the right,
//- shortcuts?
//- clear
//- delete
//- edit
//- create
//- mark as done
//- mark as active

interface INowCardProps {
  currentSession: ISession;
}

const cardData: INowCardProps = {
  currentSession: {
    title: "working on stuff related to stuff",
    activity: {
      categories: [],
      color: "#11323",
      description: "some description",
      name: "playing",
    },
    endTime: "2:00",
    notes:
      "some notes, i think  think think think think think think think think think think think think think think think think think think think think think think think think think think think think think think think think think think think think think think think think think",
    startTime: "1:00",
  },
};

const currentSession = cardData.currentSession;

const currentTask: ITask = {
  activity: "activity",
  title: "Some title",
  description: "some description blah blah blah blah blah",
};

const notesContainer = useTemplateRef("notes-container");
const isShowingMoreNotes = ref(false);

// <!-- TODO: disgusting code.. I hate it, I hate myself -->
const notesContainerStyle = computed(() => {
  const scrollHeight = notesContainer.value?.scrollHeight ?? 0;

  if (isShowingMoreNotes.value) {
    return {
      height: scrollHeight ? `${scrollHeight}px` : "100dvh",
    };
  } else {
    return {
      height: scrollHeight > 48 ? "3rem" : `${scrollHeight}px`,
    };
  }
});
</script>

<template>
  <FunctionCard title="Now">
    <!-- TODO: make the borderColor depend on activity, and make shadow color as well and transition when activity gets active -->
    <template #default>
      <div class="flex flex-col gap-0.5 items-center">
        <p class="text-3xl font-bold capitalize">{{ currentSession.activity.name }}</p>
        <p v-if="currentSession.title" class="text-base text-center text-gray-600 font-semibold capitalize">
          {{ currentSession.title }}
        </p>
        <div class="text-xs text-gray-500">
          <span> {{ currentSession.startTime }} - {{ currentSession.endTime }} </span>
          <span class="text-xs"> • 1h 23m remaining</span>
        </div>
        <div class="m-2 w-2/3">
          <div v-if="currentTask" class="flex items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2">
                <div class="relative mt-1">
                  <div class="absolute bg-primary/50 size-2.5 rounded-full animate-ping" />
                  <ZapIcon class="fill-primary size-3" />
                </div>
                <div class="font-bold text-gray-800">{{ currentTask.title }}</div>
              </div>
              <div v-if="currentTask.description" class="text-xs text-gray-600">{{ currentTask.description }}</div>
            </div>
            <Button variant="ghost" class="size-6 rounded-full text-gray-500 hover:text-primary transition-colros">
              <CheckIcon />
            </Button>
          </div>
          <div v-else class="flex items-center gap-2 justify-center">
            <div class="mt-1">
              <CircleDotDashedIcon class="text-gray-600 size-3 animate-pulse-slow" />
            </div>
            <div class="font-bold text-gray-600 animate-pulse-slow"> -------- No Active Task -------- </div>
            <div class="mt-1">
              <CircleDotDashedIcon class="text-gray-600 size-3 animate-pulse-slow" />
            </div>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-200 m-2"></div>
      <!-- <div class="flex flex-col gap-2">
                <div class="p-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <div class="font-medium text-gray-800">{{ currentTask.title }}</div>
                            <div v-if="currentTask.description" class="text-sm text-gray-600 mt-1">{{
                                currentTask.description }}</div>
                        </div>
                        <div class="flex items-center gap-2 ml-3">
                            <button
                                class="w-8 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Set as active task">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </button>
                            <button
                                class="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                title="Mark as done">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Task
                    </button>
                </div>
            </div> -->
    </template>
  </FunctionCard>
</template>
