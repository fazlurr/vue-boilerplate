<template>
	<div id="app">
		<main-nav v-if="isLoggedIn"></main-nav>
		<nav class="navbar navbar-main navbar-default text-center" v-if="!isLoggedIn">
			<router-link class="navbar-brand mx-auto" to="/">
				<img src="./assets/logo.png" class="d-inline-block align-top" alt="Awesome App">
			</router-link>
		</nav>
		<main class="main">
			<router-view/>
		</main>
		<site-footer v-if="isLoggedIn"></site-footer>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import MainNav from './components/MainNav.vue';
import Footer from './components/Footer.vue';

export default {
	name: 'App',
	components: {
		'main-nav': MainNav,
		'site-footer': Footer,
	},
	computed: {
		...mapGetters({
			isLoggedIn: 'isLoggedIn',
		}),
	},
	methods: {
		...mapActions([
			'fetchUser',
		]),
	},
	created() {
		// Fetch user if logged in
		if (this.isLoggedIn && !this.user) {
			this.fetchUser();
		}
	},
	watch: {
	},
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
@import './assets/scss/main.scss';
</style>
