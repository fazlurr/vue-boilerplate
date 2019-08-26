<template>
	<div class="maintenance-page">
		<div class="card maintenance-card">
			<div class="card-body">
				<picture>
					<source srcset="/img/login-logo.png 1x, /img/login-logo@2x.png 2x">
					<img src="/img/login-logo.png" class="app-logo" loading="lazy" alt="LMS">
				</picture>
				<h5>{{ $t('Oops, we\'re offline') }}!</h5>
				<hr>
				<div class="text-secondary mb-2">{{ $t('Check whats happening and subscribe to updates on') }}</div>
				<div class="mb-4">
					<a :href="`https://${statusPage}`" target="_blank">{{ statusPage }}</a>
				</div>
				<div>
					<a class="btn btn-primary mb-3" :href="`https://${statusPage}`" target="_blank">{{ $t('Check Status Page') }}</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'maintenance',
	computed: {
		statusPage() {
			return process.env.VUE_APP_STATUS_PAGE || 'status.lms-app.ajak.in';
		},
	},
};
</script>
