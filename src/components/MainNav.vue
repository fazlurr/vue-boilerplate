<template>
	<nav class="navbar navbar-main navbar-expand-lg sticky-top hidden-sm" :class="{ 'shrink': shrink }">
		<div class="container-fluid">
			<router-link class="navbar-brand" to="/">
				<img src="/img/logo-small.png" class="d-inline-block align-top" alt="LMS">
			</router-link>
			<button type="button" class="navbar-toggler">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="main-nav-dropdown collapse navbar-collapse justify-content-between">
				<ul class="navbar-nav">
					<li class="nav-item hidden" :class="{ 'active': isMenuActive('/') }">
						<router-link class="nav-link nav-link-text" to="/">
							<!-- <span class="link-label">{{ $t('menu.home') }}</span> -->
						</router-link>
					</li>
				</ul>

				<ul class="navbar-nav">
					<!-- Dashboard -->
					<li class="nav-item m-0">
						<router-link to="/" class="nav-link" v-tooltip="$t('Dashboard')">
							<div class="icon-toggle">
								<i class="material-icons">dashboard</i>
							</div>
						</router-link>
					</li>
					<!-- Notifications -->
					<li class="nav-item m-0">
						<notifications-list />
					</li>
					<!-- Settings -->
					<li class="nav-item m-0" v-if="isAdmin">
						<router-link to="/settings" class="nav-link settings-toggle" v-tooltip="$t('settings')">
							<div class="settings-icon icon-toggle">
								<i class="material-icons">settings</i>
							</div>
							<!-- <div class="label ml-2">Settings</div> -->
						</router-link>
					</li>
					<!-- Profile -->
					<li class="nav-item dropdown profile-menu" v-if="user">
						<div class="nav-link p-0">
							<md-menu md-size="big" md-direction="bottom-end" md-align-trigger>
								<md-button class="btn-fluid ml-3" v-tooltip="fullname" :md-ripple="false" md-menu-trigger>
									<div class="flex-center-left">
										<span class="mr-2 pt-1">{{ user.profile.firstName }} {{ user.profile.lastName }}</span>
										<div
											class="profile-image"
											:style="{ backgroundImage: `url('${user.profile.picture}')` }"
											v-if="user.profile.picture && user.profile.picture !== ''">
										</div>
										<i class="material-icons profile-image" v-else>account_circle</i>
									</div>
								</md-button>
								<md-menu-content>
									<md-menu-item @click="$router.push('/profile')">{{ $t('Profile') }}</md-menu-item>
									<md-menu-item @click="setSwitcherState(true)" v-if="roles.length > 1">{{ $t('changeRole') }}</md-menu-item>
									<md-menu-item @click="logout()">{{ $t('Logout') }}</md-menu-item>
								</md-menu-content>
							</md-menu>
						</div>
					</li>
					<!-- Help -->
					<li class="nav-item m-0">
						<a class="nav-link help-toggle cur-p" v-tooltip="$t('Help')" @click="showHelp">
							<div class="help-icon icon-toggle">
								<i class="material-icons">help</i>
							</div>
							<!-- <div class="label ml-2">Help</div> -->
						</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import NotificationsList from './NotificationsList.vue';

export default {
	name: 'mainNav',
	components: {
		NotificationsList,
	},
	data() {
		return {
			shrink: false,
		};
	},
	methods: {
		...mapActions({
			logout: 'logout',
			switchRole: 'switchRole',
			setSwitcherState: 'setSwitcherState',
			setHelpState: 'setHelpState',
		}),
		handleScroll() {
			const scrollPosition = window.scrollY;
			const treshold = 0;
			if (scrollPosition > treshold) {
				this.shrink = true;
			} else {
				this.shrink = false;
			}
		},
		isUserCan(capability) {
			return this.user && this.user.capabilities.includes(capability);
		},
		showHelp() {
			this.setHelpState(true);
		},
	},
	computed: {
		...mapGetters({
			user: 'user',
			role: 'role',
			isMenuActive: 'isMenuActive',
			isAdmin: 'isAdmin',
			isTeacher: 'isTeacher',
			isStudent: 'isStudent',
			isLeader: 'isLeader',
		}),
		fullname() {
			return `${this.user.profile.firstName} ${this.user.profile.lastName}`;
		},
		roles() {
			return this.user ? this.user.roles : [];
		},
	},
	created() {
		window.addEventListener('scroll', this.handleScroll);
	},
	destroyed() {
		window.removeEventListener('scroll', this.handleScroll);
	},
};
</script>
