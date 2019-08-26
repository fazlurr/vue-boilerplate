<template>
	<div class="navigation-drawer" :class="{ 'is-open': isNavOpen }">
		<div class="nav-drawer-top p-3">
			<div class="flex-center-left">
				<div class="nav-drawer-close mr-2" @click="toggleNavDrawer(false)">
					<i class="material-icons">close</i>
				</div>
			</div>
		</div>
		<ul class="navbar-nav">
			<!-- Dashboard -->
			<li class="nav-item m-0">
				<router-link to="/" class="nav-link">{{ $t('Dashboard') }}</router-link>
			</li>
			<!-- Profile -->
			<li class="nav-item dropdown profile-menu" v-if="user">
				<router-link to="/profile" class="nav-link">{{ $t('Profile') }}</router-link>
			</li>
			<!-- Settings -->
			<li class="nav-item m-0" v-if="isAdmin">
				<router-link to="/settings" class="nav-link">{{ $t('Settings') }}</router-link>
			</li>
			<!-- Help -->
			<li class="nav-item m-0">
				<a class="nav-link help-toggle cur-p" :title="$t('Help')" @click="showHelp">
					{{ $t('Help') }}
				</a>
			</li>
			<!-- Logout -->
			<li class="nav-item m-0">
				<router-link to="/logout" class="nav-link">{{ $t('Logout') }}</router-link>
			</li>
		</ul>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'navigationDrawer',
	components: {
	},
	data() {
		return {
		};
	},
	methods: {
		...mapActions({
			toggleNavDrawer: 'toggleNavDrawer',
			setHelpState: 'setHelpState',
			setSwitcherState: 'setSwitcherState',
		}),
		showHelp() {
			this.toggleNavDrawer(false);
			this.setHelpState(true);
		},
	},
	computed: {
		...mapGetters({
			user: 'user',
			role: 'role',
			isNavOpen: 'isNavOpen',
			isAdmin: 'isAdmin',
		}),
		fullname() {
			return `${this.user.profile.firstName} ${this.user.profile.lastName}`;
		},
		roles() {
			return this.user ? this.user.roles : [];
		},
	},
	watch: {
		$route() {
			this.toggleNavDrawer(false);
		},
	},
};
</script>
