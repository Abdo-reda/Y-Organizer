<script setup lang="ts">
import { ISession } from "@/core/interfaces/entities/ISession";
import { computed } from "vue";
import useActivity from "@/store/useActivity";
import { PopoverContent } from "../ui/popover";
import { CheckCheckIcon, GoalIcon, NotepadTextIcon } from "lucide-vue-next";
import { TaskStatusEnum } from "@/core/enums/taskStatusEnum";
import { ITask } from "@/core/interfaces/entities/ITask";

const { activities } = useActivity();
const props = defineProps<{ session: ISession, tasks: ITask[] }>();
const sessionActivity = computed(() => activities.find((a) => a.name === props.session.activity));
const completedTasks = computed(() => props.tasks.filter((t) => t.status === TaskStatusEnum.COMPLETED && t.session === props.session.id));
</script>

<template>
	<PopoverContent side="right" align="start" :style="{ '--color-hover': sessionActivity?.color }" class="p-0">
		<div class="flex flex-col gap-3 bg-hover/5 p-4">
			<div class="flex items-center justify-center gap-2">
				<span class="text-base font-semibold text-hover"> {{ session.activity }} </span>
			</div>

			<div class="flex items-start gap-2">
				<GoalIcon class="size-4 text-muted-foreground m-0.5" />
				<p class="flex-1 text-base leading-tight">{{ session.title }}</p>
			</div>

			<div class="flex items-start gap-2">
				<NotepadTextIcon class="size-4 text-muted-foreground m-0.5" />
				<p class="flex-1 text-sm text-muted-foreground">
					<span v-if="session.notes"> {{ session.notes }} </span>
					<span v-else class="italic"> no notes... </span>
				</p>
			</div>

			<div v-if="completedTasks.length" class="flex flex-col gap-2 pt-2 border-t">
				<ul class="flex flex-col gap-1.5">
					<li v-for="task in completedTasks" :key="task.id" class="flex items-start gap-2 text-sm">
						<span class="mt-0.5 flex-shrink-0 rounded-sm flex items-center justify-center text-hover">
							<CheckCheckIcon class="size-3" />
						</span>

						<span class="leading-tight line-through text-muted-foreground text-xs">
							{{ task.title }}
						</span>
					</li>
				</ul>
			</div>
		</div>
	</PopoverContent>
</template>
