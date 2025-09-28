import { createRouter, createWebHistory } from 'vue-router';
import { RoutesEnum } from '@/core/enums/routesEnum';
// import WelcomeView from '@/views/WelcomeView.vue';
import TestView from '@/views/TestView.vue';
import DayView from '@/views/DayView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
        {
			path: '/',
			name: RoutesEnum.WELCOME,
			component: DayView
		},
		{
			path: `/${RoutesEnum.TODAY}`,
			name: RoutesEnum.TODAY,
			component: DayView
		},
		{
			path: '/test',
			name: "test",
			component: TestView
		},
		{
			path: '/:pathMatch(.*)*',
			redirect: { name: RoutesEnum.WELCOME }
		}
	]
});

export default router;
