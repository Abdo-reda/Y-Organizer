
const carouselSetup = ref(false);
const carouselSettled = ref(false);


const sessionsTaskData = computed(() => {
    const sessionId = currentSession.value?.id;

    if (!sessionId) {
        return {
            activeAndPending: [],
            completed: [],
        };
    }

    const completed = [];
    let pending = [];
    let active = null;

    for (const task of tasks) {
        if (task.session !== sessionId) continue;

        if (task.status === TaskStatusEnum.ACTIVE) active = task;
        else if (task.status === TaskStatusEnum.PENDING && pending.length < 2) pending.push(task);
        else completed.push(task);
    }

    return {
        completed,
        activeAndPending: [active,]
    };
});

function setCarouselApi(api: CarouselApi) {
    console.log("--- hmm")
    if (!api || carouselSetup.value) return;
    carouselSetup.value = true;
    api.on("settle", () => {
        console.log("--- settle")
    })
    api.on("select", () => {
        console.log("--- select")
    })
}
    <div v-else
                            @click="dialogOpen = true"
                            class="p-2 m-2 border-2 border-dashed border-gray-300 rounded-sm text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm duration-300 select-none">
                            <PlusIcon class="size-4" />
                            <p> Create Activity </p>
                        </div>

// const activitiesContainer = useTemplateRef('activities-container');
// useMouseScroll(activitiesContainer);

                      <!-- <div ref="activities-container" class="flex flex-col h-full gap-2 p-2 scroll-drag"  v-auto-animate>
                            <div v-for="activity in sortedActivites" :key="activity.name" @pointerdown="handleActivity($event, activity)"
                                class="flex items-center justify-between p-1 px-2 group rounded-md hover:bg-gray-50 hover:ring-1 ring-hover duration-300 transition-all group"
                                :class="{ 'opacity-60 ': activity.status === ActivityStatusEnum.DISABLED }"
                                :style="{ '--color-hover': activity.color }">
                                <div class="flex items-center gap-3 min-w-0 flex-1">
                                    <div :style="{ color: activity.color }">
                                        <CircleIcon v-if="activity.status === ActivityStatusEnum.ACTIVE" class="size-4"
                                            stroke-width="0" :fill="activity.color" />
                                        <CheckCheckIcon v-else-if="activity.status === ActivityStatusEnum.COMPLETED"
                                            class="size-4" />
                                        <ArchiveIcon v-else class="size-4" />
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <p class="font-medium text-gray-900 truncate w-fit" :class="{
                                            'line-through': activity.status === ActivityStatusEnum.COMPLETED,
                                        }">{{ activity.name }}
                                        </p>
                                        <p class="text-sm text-gray-500 truncate">{{ activity.description }}</p>
                                    </div>
                                </div>
                                <div class="flex gap-1">
                                    <component v-for="category in activity.categories"
                                        :is="LifeCategoryIconMapper[category]" class="size-3.5 text-hover" />
                                </div>
                            </div>
                        </div> -->