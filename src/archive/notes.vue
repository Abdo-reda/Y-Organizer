        <!-- <div v-if="currentSession.notes" class="w-5/6">
          <div class="p-1 bg-gray-50 border border-dashed rounded-sm relative">
            <div
              ref="notes-container"
              class="transition-all overflow-hidden text-gray-500 text-sm"
              :style="notesContainerStyle"
              :class="{
                'line-clamp-2': !isShowingMoreNotes,
              }"
            >
              <NotepadTextIcon class="size-4 text-gray-500 inline mx-0.5" />
              <p class="inline">{{ currentSession.notes }}</p>
            </div>
           div class="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-white to-transparent pointer-events-none" /> 
            <p
              v-if="(notesContainer?.scrollHeight ?? 0) > 48"
              @click="isShowingMoreNotes = !isShowingMoreNotes"
              class="text-xs text-gray-500 text-right hover:text-primary select-none transition-colors"
            >
              {{ isShowingMoreNotes ? " show less" : " show more" }}
            </p>
          </div>
        </div> -->