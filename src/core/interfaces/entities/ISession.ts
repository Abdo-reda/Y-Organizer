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

export function generateDefaultSession(day: DateTime<true>, hour: number): ISession {
    const startTime = day.set({hour: hour, minute: 0});
    const endTime = startTime.plus({ hour: 1 });

    return {
        title: "",
        notes: "",
        activity: "",
        day: day.toISODate(),
        status: SessionStatusEnum.PENDING,
        startTime: startTime,
        endTime: endTime,
    };
}
