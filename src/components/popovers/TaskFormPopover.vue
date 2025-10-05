<script setup lang="ts">
// import { computed } from 'vue';
import { reactiveComputed } from '@vueuse/core';
// import useActivity from '@/store/useActivity';
import { Button } from '../ui/button';
import { PenIcon } from 'lucide-vue-next';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { PopoverContent } from '../ui/popover';
// import { ActivityStatusEnum } from '@/core/enums/activityStatusEnum';
import { ITask } from '@/core/interfaces/entities/ITask';

// const { activities } = useActivity();
// const activeActivities = computed(() => activities.filter((a) => a.status === ActivityStatusEnum.ACTIVE));

const props = defineProps<{ existingTask: ITask }>();
const emits = defineEmits<{
    create: [task: ITask];
    update: [id: number, task: ITask];
}>();


const taskForm = reactiveComputed<ITask>(() => ({ ...props.existingTask }));

// const selectedActivity = computed({
//     get: () => activities.find(a => a.name === taskForm.activity),
//     set: (activity) => {
//         if (activity) taskForm.activity = activity?.name;
//     }
// });

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
    <PopoverContent side="right" align="start">
        <form id="task-form" name="task-form" @submit.prevent="handleSubmit">
            <div class="flex flex-col gap-2">
                <Input v-model="taskForm.title" type="text" placeholder="Task Title" />

                <Textarea id="description" v-model="taskForm.description" placeholder="Task Description..."
                    class="resize-none" />

                <Button type="submit" variant="outline" form="task-form">
                    <PenIcon /> {{ props.existingTask.id ? "Update" : "Create" }}
                </Button>
            </div>
        </form>
    </PopoverContent>
</template>
