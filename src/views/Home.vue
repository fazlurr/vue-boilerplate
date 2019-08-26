<template>
	<div class="home">
		<login v-if="!isLoggedIn" />
		<dashboard v-if="isLoggedIn" />
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';

export default {
	name: 'home',
	components: {
		Login,
		Dashboard,
	},
	computed: {
		...mapGetters({
			isLoggedIn: 'isLoggedIn',
		}),
	},
};
</script>
