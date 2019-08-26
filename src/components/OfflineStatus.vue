<template>
	<div class="offline-status" v-tooltip="'Some functions may not work correctly when you are offline'">
		<span class="dot va-m mr-2"></span>
		<!-- <span class="va-m">{{ $t('You seems to be offline') }}</span> -->
		<span class="va-m">{{ $t('No Internet Connection') }}</span>
	</div>
</template>

<script>
export default {
	name: 'OfflineStatus',
};
</script>

<style lang="scss">
	.offline-status {
		position: fixed;
		left: 1.25em;
		bottom: 3.5em;
		padding: 1em;
		font-size: .85em;
		border-radius: 2em;
		background-color: #fff;
		box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.1);
		z-index: 9999 !important;

		.dot {
			background-color: #ff6961;
			// background-color: #FE4C4C;
		}
	}
</style>
