import { SessionStatusEnum } from "@/core/enums/sessionStatusEnum";
import { type DateTime } from "luxon";

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
