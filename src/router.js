import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

const APP_NAME = process.env.VUE_APP_NAME;

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	// linkActiveClass: 'active',
	scrollBehavior() {
		return { x: 0, y: 0 };
	},
	routes: [
		// Dashboard
		{
			path: '/',
			name: 'dashboard',
			component: Home,
			meta: {
				title: `Dashboard - ${APP_NAME}`,
				gtm: 'Dashboard',
			},
		},
		// Login
		{
			path: '/login',
			name: 'login',
			component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
			meta: {
				title: `Login - ${APP_NAME}`,
				gtm: 'Login',
			},
		},
		// Logout
		{
			path: '/logout',
			name: 'logout',
			component: () => import(/* webpackChunkName: "login" */ './views/Logout.vue'),
			meta: {
				title: `Logout - ${APP_NAME}`,
				gtm: 'Logout',
			},
		},
	],
});
