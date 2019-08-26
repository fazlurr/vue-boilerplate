<template>
	<transition name="modal">
		<div class="lightbox">
			<div class="modal-mask" @click="close">
				<div class="modal-wrapper has-scroll">
					<div
						class="lightbox-container modal-container"
						:class="`modal-container-${size}`"
						:style="{ backgroundImage: `url('${bgImage}')` }">
						<div class="lightbox-body">
							<slot name="body">Lightbox Body</slot>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'Lightbox',
	props: {
		size: {
			type: String,
			default: 'small',
		},
		bgImage: {
			type: String,
			default: '',
		},
	},
	methods: {
		onKeyup(event) {
			if (event.key === 'Escape') {
				this.close();
			}
		},
		close() {
			this.$emit('close');
		},
	},
	created() {
		document.body.classList.add('modal-open');
		window.addEventListener('keyup', this.onKeyup);
	},
	destroyed() {
		document.body.classList.remove('modal-open');
		window.removeEventListener('keyup', this.onKeyup);
	},
};
</script>
