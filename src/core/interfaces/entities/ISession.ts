import { SessionStatusEnum } from "@/core/enums/sessionStatusEnum";
import { DateTime } from "luxon";

export interface ISession {
    id?: number;
    title: string;
    notes: string;
    activity: string;
    day: string;
    startTime: DateTime;
    endTime: DateTime;
    status: SessionStatusEnum;
}

export function generateDefaultSession(hour: number): ISession {
    const startTime = DateTime.now().set({hour: hour, minute: 0});
    const endTime = startTime.plus({ hour: 1 });

    return {
        title: "",
        notes: "",
        activity: "",
        day: startTime.toISODate(),
        status: SessionStatusEnum.PENDING,
        startTime: startTime,
        endTime: endTime,
    };
}
