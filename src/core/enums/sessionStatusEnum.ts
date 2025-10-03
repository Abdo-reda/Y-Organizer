export enum SessionStatusEnum {
    PENDING = "Pending",
    COMPLETED = "Completed",
    SUCCESS = "Success",
    SKIPPED = "Skipped",
}

export function getNextStatus(status: SessionStatusEnum) {
    switch (status) {
        case SessionStatusEnum.PENDING:
            return SessionStatusEnum.COMPLETED;
        case SessionStatusEnum.COMPLETED:
            return SessionStatusEnum.SUCCESS;  
        case SessionStatusEnum.SUCCESS:
            return SessionStatusEnum.SKIPPED;
        case SessionStatusEnum.SKIPPED:
            return SessionStatusEnum.PENDING;
    }
}