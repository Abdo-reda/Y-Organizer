export interface ISession {
    id?: number;
    title: string;
    notes: string;
    activity: string;
    day: string;
    startTime: string;
    endTime: string;
    // status: string;
}

export const DEFAULT_SESSION: ISession = {
    title: "No Active Session",
    notes: "",
    activity: "FREE",
    day: "",
    startTime: "",
    endTime: "",
    // status: "pending",
};