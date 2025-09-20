import { DateTime } from "luxon";

export class LoggingService {
    private static readonly IS_ENABLED = true;
    static log(context: string, ...data: unknown[]) {
        if (!this.IS_ENABLED) return;
        console.log(`[${context}_${DateTime.now().toISOTime({includeOffset: false})}]:`, ...data)
    }
}