export enum TaskStatusEnum {
    PENDING = "Pending",
    ACTIVE = "Active",
    COMPLETED = "Completed",
}

export const TaskStatusOrder: Record<TaskStatusEnum, number> = {
    [TaskStatusEnum.ACTIVE]: 1,
    [TaskStatusEnum.PENDING]: 1,
    [TaskStatusEnum.COMPLETED]: 2,
}