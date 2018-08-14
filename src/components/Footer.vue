<template>
	<footer class="footer">
		<div class="footer__nav">
			<div class="container">
				<nav class="nav">
					<router-link class="nav-link" to="/changelog">Changelog</router-link>
				</nav>
			</div>
		</div>
		<div class="footer__bottom">
			<div class="container">
				<div class="text-center">
					<div class="footer-copyright">Copyright &copy; {{ year }} Awesome.id</div>
				</div>
			</div>
		</div>
	</footer>
</template>

<script>
export default {
	name: 'siteFooter',
	computed: {
		year() {
			return new Date().getFullYear();
		},
	},
};
</script>
