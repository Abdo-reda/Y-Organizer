<script setup lang="ts">
import { reactiveComputed } from "@vueuse/core";
import { Button } from "../ui/button";
import { ListTodoIcon, PenIcon } from "lucide-vue-next";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ITask } from "@/core/interfaces/entities/ITask";
import { TaskStatusEnum } from "@/core/enums/taskStatusEnum";

const props = defineProps<{ existingTask: ITask; suggestedTasks: ITask[] }>();
const emits = defineEmits<{
	create: [task: ITask];
	update: [id: number, task: ITask];
}>();

const taskForm = reactiveComputed<ITask>(() => ({ ...props.existingTask }));

function setSuggestedTask(task: ITask) {
	if (!task.id) return;
	emits("update", task.id, {
		...task,
		session: taskForm.session,
        status: TaskStatusEnum.PENDING,
	});
}

function handleSubmit() {
	const updatedTask = { ...taskForm };
	if (props.existingTask?.id) {
		emits("update", props.existingTask.id, updatedTask);
	} else {
		emits("create", updatedTask);
	}
}
</script>

<template>
	<div class="flex gap-3">
		<form id="task-form" name="task-form" @submit.prevent="handleSubmit" class="flex-1">
			<div class="flex flex-col gap-2">
				<Input v-model="taskForm.title" type="text" placeholder="Task Title" />

				<Textarea id="description" v-model="taskForm.description" placeholder="Task Description..." class="resize-none" />

				<Button type="submit" variant="outline" form="task-form"> <PenIcon /> {{ props.existingTask.id ? "Update" : "Create" }} </Button>
			</div>
		</form>
		<template v-if="suggestedTasks.length">
			<div class="border-l border-muted" />
			<div class="flex-1 flex flex-col gap-2 overflow-hidden select-none p-0.5">
				<div
					v-for="task in suggestedTasks"
					:key="task.id"
					@click="setSuggestedTask(task)"
					class="relative p-2 flex items-center min-w-0 justify-between ring ring-muted rounded-md transition-shadow gap-2 hover:ring-primary/75"
				>
					<div class="flex-1 flex gap-1 items-center min-w-0">
						<div>
							<ListTodoIcon class="size-3.5" />
						</div>
						<p class="font-medium text-xs text-foreground/75 truncate">{{ task.title }}</p>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>
