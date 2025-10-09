     <div class="flex flex-col gap-1.5">
                    <Label> Tasks </Label>
                    <div class="flex flex-col gap-3" v-auto-animate>
                        <div v-for="(task, index) in goalTasks" :key="index"
                            class="rounded-md bg-gray-50 border border-gray-200 p-2 flex flex-col gap-1">
                            <div class="flex gap-2">
                                <Input v-model="task.title" type="text" class="bg-white" placeholder="Task Title" />
                                <Button @click="goalTasks.splice(index, 1)" type="button" variant="ghost" size="icon"
                                    class="text-destructive/75 hover:text-destructive">
                                    <TrashIcon />
                                </Button>
                            </div>

                            <Textarea id="description" v-model="task.description" placeholder="Task Description..."
                                class="resize-none bg-white" />
                        </div>
                        <button type="button" @click="addTask"
                            class="w-full h-full border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 text-xs p-2">
                            <PlusIcon class="size-3" /> Add Task
                        </button>
                    </div>
                </div>