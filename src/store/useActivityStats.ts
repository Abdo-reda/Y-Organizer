import { IActivity, ISessionActivity } from "@/core/interfaces/entities/IActivity";
import { ISession } from "@/core/interfaces/entities/ISession";
import { computed, Reactive } from "vue";

export default function useActivityStats(activities: Reactive<IActivity[]>, sessions: Reactive<ISession[]>) {
	const sessionsData = computed(() => {
		let totalDuration = 0;
		const activityDurations: Record<string, number> = {};
		const todayActivites = new Set<string>();
		sessions.forEach((session) => {
			const activity = session.activity;
			const duration = session.endTime.diff(session.startTime, "minutes").minutes;
			totalDuration += duration;
			activityDurations[activity] = (activityDurations[activity] || 0) + duration;
			todayActivites.add(activity);
		});

		return {
			totalDuration,
			activityDurations,
			todayActivites,
		};
	});

	const sessionActivities = computed(() => {
		let sessionActivites: ISessionActivity[] = [];
		let activityOffset = 0;
		activities.forEach((a) => {
			if (sessionsData.value.todayActivites.has(a.name)) {
				const activityDuration = sessionsData.value.activityDurations[a.name];
				const activityRatio = Math.round((activityDuration * 100) / sessionsData.value.totalDuration);
				sessionActivites.push({ ...a, duration: activityDuration, ratio: activityRatio, offset: activityOffset });
				activityOffset += activityRatio;
			}
		});
		return sessionActivites.sort((a, b) => b.duration - a.duration);
	});

	return { sessionsData, sessionActivities };
}
