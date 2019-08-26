<template>
	<nav class="navbar navbar-mobile sticky-top visible-sm" :class="{ 'shrink': shrink }">
		<div class="container-fluid">
			<div class="flex-center w-100">
				<button type="button" class="btn btn-plain" @click="open">
					<i class="material-icons">menu</i>
				</button>
				<div class="nav-page-title">{{ title }}</div>
				<router-link to="/notifications" class="btn btn-plain text-primary">
					<i class="material-icons">notifications</i>
				</router-link>
			</div>
		</div>
	</nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'mobileNav',
	data() {
		return {
			shrink: false,
		};
	},
	methods: {
		...mapActions({
			toggleNavDrawer: 'toggleNavDrawer',
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
		open() {
			this.toggleNavDrawer(true);
		},
	},
	computed: {
		...mapGetters({
			user: 'user',
			role: 'role',
			isAdmin: 'isAdmin',
			isTeacher: 'isTeacher',
			isStudent: 'isStudent',
		}),
		title() {
			return this.$route.meta.gtm || 'LMS';
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
