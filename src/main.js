import '@babel/polyfill';
import Vue from 'vue';
import VueI18n from 'vue-i18n';

// import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import store from './store';
import messages from './messages';
import './registerServiceWorker';

Vue.config.productionTip = false;

Vue.use(VueI18n);

// Route Middleware
router.beforeEach((to, from, next) => {
	const { path } = to;
	const { isLoggedIn } = store.getters;

	const errors = [];

	const alreadyLoggedIn = path === '/login' && isLoggedIn;
	if (alreadyLoggedIn) {
		errors.push('already_logged_in');
	}

	const isNotAvailable = errors.length > 0;

	if (path !== '/login' && path !== '/logout' && path !== '/password/reset' && !isLoggedIn) {
		next('/login');
	} else if (isNotAvailable) {
		next('/');
	} else {
		document.title = to.meta.title;
		next();
	}
});

router.beforeEach((to, from, next) => {
	store.dispatch('navigate', { to });
	next();
});

// Create VueI18n instance with options
const i18n = new VueI18n({
	locale: store.getters.locale, // set locale
	messages, // set locale messages
});

new Vue({
	router,
	store,
	i18n,
	render: h => h(App),
}).$mount('#app');
