import { type TaskStatusEnum } from "@/core/enums/taskStatusEnum";

export interface ITask {
    title: string;
    description: string;
    activity: string;
    session: number|null;
    isToday: boolean;
    completedDay: string;
    status: TaskStatusEnum;
    //dueDate //null or date... if match today, then its due today.. if null, then later
    //deadline? null or date
    //priority? 0-3?
}