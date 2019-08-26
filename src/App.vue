<template>
	<div id="app">
		<!-- Nav -->
		<template v-if="!isMaintenance">
			<main-nav v-if="isLoggedIn"></main-nav>
			<mobile-nav v-if="isLoggedIn"></mobile-nav>
		</template>
		<!-- Page Loader -->
		<div class="page-loader p-5" v-if="!user && !isRouteAllowed">
			<div class="is-loading large dark"></div>
		</div>
		<!-- Main Route View -->
		<router-view v-if="isRouteAllowed || !!user" />
		<!-- Notifications -->
		<notifications group="app" position="bottom right" />
		<!-- Navigation Drawer -->
		<navigation-drawer></navigation-drawer>
		<!-- Footer -->
		<footer class="footer footer-main d-md-flex" v-if="isLoggedIn">
			<div class="flex-center-left">
				<div class="footer-image">
					<img src="/img/logo-small.png" alt="LMS" class="d-inline-block align-top">
				</div>
				<div class="footer-brand">{{ appName }} - {{ $t('Copyright') }} © 2019 LO Media.</div>
			</div>
			<router-link to="/privacy-policy" class="link-plain footer-privacy mr-2">{{ $t('Privacy Statement') }}</router-link>
			<span class="ml-a" v-if="showVersion">v{{ appVersion }}</span>
		</footer>
		<!-- Modals -->
		<div class="modals">
			<!-- Role Switcher -->
			<role-switcher v-if="isRoleSwitcherVisible" />
			<!-- Help -->
			<help-modal v-if="isHelpVisible" />
		</div>
		<cookie-law theme="primary"></cookie-law>
		<offline-status v-if="!isOnline"></offline-status>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import CookieLaw from 'vue-cookie-law';
import MainNav from './components/MainNav.vue';
import MobileNav from './components/MobileNav.vue';
import NavigationDrawer from './components/NavigationDrawer.vue';
import OfflineStatus from './components/OfflineStatus.vue';

const NOTIF_PERMISSION_GRANTED = 'notif_granted';
const NETWORK_EVENTS = ['online', 'offline', 'load'];

export default {
	name: 'App',
	components: {
		CookieLaw,
		MainNav,
		MobileNav,
		NavigationDrawer,
		OfflineStatus,
	},
	data() {
		return {};
	},
	methods: {
		...mapActions({
			fetchUser: 'fetchUser',
			setOnlineStatus: 'setOnlineStatus',
		}),
		init() {
			// Notification Prompt
			this.requestNotifPermission();
			// Fetch user if logged in
			if (this.isLoggedIn && !this.user) {
				this.fetchUser();
			}
			const role = localStorage.getItem('role');
			if (role) {
				this.setRole(role);
			}
		},
		requestNotifPermission() {
			const isGranted = localStorage.getItem(NOTIF_PERMISSION_GRANTED);
			if (!isGranted) {
				Notification.requestPermission().then((result) => {
					if (result === 'denied' || result === 'default') {
						if (result === 'denied') {
							console.log('Permission wasn\'t granted. Allow a retry.');
						} else if (result === 'default') {
							console.log('The permission request was dismissed.');
						}
					} else {
						// Do something with the granted permission.
						localStorage.setItem(NOTIF_PERMISSION_GRANTED, true);
					}
				});
			}
		},
		initSocketSubs() {
			const userId = this.user.id;
			// Global Channel
			this.$socket.emit('room-join', 'global');
			// Other Channels
			const channels = this.getSocketChannels(userId);
			for (let index = 0; index < channels.length; index++) {
				const channel = channels[index];
				this.$socket.emit('room-join', channel);
			}
			this.$options.sockets['room-joined'] = (data) => {
				// eslint-disable-next-line
				console.log('Room Joined', data);
				// if (data.indexOf(userId) !== -1) {
				// 	this.testBroadcast();
				// }
			};
		},
		getSocketChannels(userId) {
			const prefixes = ['user'];
			const channels = prefixes.map(prefix => `${prefix}_${userId}`);
			return channels;
		},
		testBroadcast() {
			// const userId = this.user.id;
			// const params = {
			// 	roomId: `user_${userId}`,
			// 	channel: 'notification_add',
			// 	payload: { yeah: 'yeah' },
			// };
			// const callback = () => {};
			// const errorCallback = () => {};
			// broadcastApi.create(params, callback, errorCallback);
		},
		updateOnlineStatus() {
			const isOnline = navigator.onLine || false;
			this.setOnlineStatus(isOnline);
		},
	},
	computed: {
		...mapGetters({
			user: 'user',
			isLoggedIn: 'isLoggedIn',
			isOnline: 'isOnline',
			isHelpVisible: 'isHelpVisible',
			isRoleSwitcherVisible: 'isRoleSwitcherVisible',
		}),
		isRouteAllowed() {
			const routePath = this.$route.path;
			const isIndex = routePath === '/';
			const isAllowed = isIndex
				|| routePath === '/maintenance'
				|| routePath === '/login'
				|| routePath.indexOf('/password/reset') !== -1;
			return isAllowed;
		},
		isMaintenance() {
			const routePath = this.$route.path;
			return routePath === '/maintenance';
		},
		showVersion() {
			return process.env.VUE_APP_SHOW_VERSION;
		},
		appName() {
			return process.env.VUE_APP_NAME;
		},
		appVersion() {
			return process.env.VUE_APP_VERSION;
		},
	},
	watch: {
		$route(to, from) {
			if (to.path === '/' && from.path === '/login') {
				this.init();
			}
		},
		role(role) {
			document.body.classList.remove('role-admin', 'role-teacher', 'role-student', 'role-branch_leader');
			document.body.classList.add(`role-${role}`);
		},
		user(user) {
			if (user) {
				this.initSocketSubs();
			}
		},
	},
	created() {
		this.init();
		NETWORK_EVENTS.forEach(event => window.addEventListener(event, this.updateOnlineStatus));
	},
	destroyed() {
		NETWORK_EVENTS.forEach(event => window.removeEventListener(event, this.updateOnlineStatus));
	},
};
</script>

<style lang="scss">
	@import './assets/scss/base.scss';
</style>
