<template>
	<div class="page-logout">
		<div class="container">
			<div class="is-loading large dark"></div>
		</div>
	</div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	name: 'logout',
	data() {
		return {
		};
	},
	methods: {
		...mapActions({
			logout: 'logout',
		}),
	},
	created() {
		this.logout();
	},
};
</script>
