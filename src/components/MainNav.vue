<template>
	<nav class="navbar navbar-main navbar-light navbar-expand-lg sticky-top" :class="{ 'shrink': shrink }">
		<div class="container">
			<router-link class="navbar-brand" to="/">
				<img src="/static/images/orderonline.png" class="d-inline-block align-top" alt="Awesome App">
			</router-link>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-nav-dropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="main-nav-dropdown collapse navbar-collapse justify-content-end" id="main-nav-dropdown">
				<ul class="navbar-nav">
					<li class="nav-item" :class="{ 'active': isMenuActive('/') }">
						<router-link class="nav-link nav-link-text" to="/">{{ $t('menu.home') }}</router-link>
					</li>
					<li class="nav-item m-0">
						<!-- <notifications></notifications> -->
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
// import Notifications from './Notifications';

export default {
	name: 'mainNav',
	components: {
		// Notifications,
	},
	data() {
		return {
			shrink: false,
		};
	},
	methods: {
		...mapActions([
			'logout',
		]),
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
	},
	computed: {
		...mapGetters({
			user: 'user',
			isMenuActive: 'isMenuActive',
			isAdmin: 'isAdmin',
		}),
		isUserHasPicture() {
			return this.user.picture !== '';
		},
		isPaidUser() {
			return this.user.package !== 'free';
		},
		isOwner() {
			return this.user && this.user.role === 'owner';
		},
		isCanAddProduct() {
			return this.user && this.user.capabilities.includes('product_add');
		},
	},
	watch: {
		$route() {
			// eslint-disable-next-line
			$('#main-nav-dropdown').collapse('hide');
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
