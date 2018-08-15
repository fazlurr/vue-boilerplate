import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

const APP_NAME = process.env.VUE_APP_NAME;

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
			meta: {
				title: `Home - ${APP_NAME}`,
				gtm: 'Home',
			},
		},
		{
			path: '/about',
			name: 'about',
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
			meta: {
				title: `About - ${APP_NAME}`,
				gtm: 'ABout',
			},
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('./views/Login.vue'),
			meta: {
				title: `Login - ${APP_NAME}`,
				gtm: 'Login',
			},
		},
	],
});
