import { createRouter, createWebHistory } from 'vue-router';
import { RoutesEnum } from '@/core/enums/routesEnum';
import WelcomeView from '@/views/WelcomeView.vue';
import TodayView from '@/views/TodayView.vue';
import TestView from '@/views/TestView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
        {
			path: '/',
			name: RoutesEnum.HOME,
			component: WelcomeView
		},
		{
			path: '/today',
			name: RoutesEnum.HOME,
			component: TodayView
		},
		{
			path: '/test',
			name: "test",
			component: TestView
		},
		{
			path: '/:pathMatch(.*)*',
			redirect: { name: RoutesEnum.HOME }
		}
	]
});

export default router;
