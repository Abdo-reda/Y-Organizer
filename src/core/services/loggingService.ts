import { DateTime } from "luxon";

export class LoggingService {
    private static readonly IS_ENABLED = true;
    static log(...data: unknown[]) {
        if (!this.IS_ENABLED) return;
        console.log(`[${DateTime.now().toISOTime({includeOffset: false})}]:`, ...data)
    }
}