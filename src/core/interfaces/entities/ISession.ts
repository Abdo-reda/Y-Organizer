import { IActivity } from "./IActivity";

export interface ISession {
    title: string;
    notes: string;
    activity: IActivity;
    startTime: string;
    endTime: string;
    // tasks?
    // succeeded?
}