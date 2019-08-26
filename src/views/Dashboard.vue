<template>
	<div class="page-dashboard">
		<div class="app-loader is-loading dark large mt-4"></div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'dashboard',
	components: {
	},
	data() {
		return {};
	},
	methods: {
		...mapActions({
			isLoggedIn: 'isLoggedIn',
			fetchUser: 'fetchUser',
		}),
	},
	computed: {
		...mapGetters({
			user: 'user',
			role: 'role',
			isFetchingUser: 'isFetchingUser',
		}),
	},
	created() {
		// Fetch user if logged in
		if (this.isLoggedIn && !this.user && !this.isFetchingUser) {
			this.fetchUser();
		}
	},
};
</script>
