import { TaskStatusEnum } from "@/core/enums/taskStatusEnum";
import { ISession } from "./ISession";

export interface ITask {
    id?: number,
    title: string;
    description: string;
    activity: string;
    session: number|null;
    isToday: boolean;
    completedDay: string;
    status: TaskStatusEnum;
    // monthlyGoal?
    // monthlyScore?
    //dueDate //null or date... if match today, then its due today.. if null, then later
    //deadline? null or date
    //priority? 0-3?
}

export function getDefaultSessionTask(session?: ISession, status: TaskStatusEnum = TaskStatusEnum.PENDING): ITask {
    return {
        title: '',
        description: '',
        activity: session?.activity ?? '',
        session: session?.id ?? null,
        isToday: true,
        completedDay: '',
        status: status,
    }
}