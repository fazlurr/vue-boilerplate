<template>
	<div class="progress-wrapper flex-center-left">
		<!-- Preview -->
		<div
			class="progress-image"
			:style="{ backgroundImage: `url('${preview}')` }"
			v-if="preview !== ''">
		</div>
		<div class="w-100">
			<!-- Info -->
			<div class="flex-center">
				<div class="progress-name">{{ name }}</div>
				<!-- Status - Default -->
				<div class="progress-status" v-if="statusPosition === 'default'">
					<span v-if="isCompleted">{{ $t('Completed') }}</span>
					<span v-if="!isCompleted && value !== 0">{{ $t('Uploading') }} {{ percentage }}%</span>
					<span v-if="!isCompleted && value === 0">-</span>
				</div>
			</div>
			<!-- Bar -->
			<div class="progress" style="height: 6px;">
				<div class="progress-bar" role="progressbar" :style="barWidth" :aria-valuenow="value" aria-valuemin="0" aria-valuemax="100"></div>
			</div>
			<!-- Status - Bottom -->
			<div class="progress-status mt-2 text-left" v-if="statusPosition === 'bottom'">
				<span v-if="isCompleted">Completed</span>
				<span v-if="!isCompleted && value !== 0">{{ $t('Uploading') }} {{ percentage }}%</span>
				<span v-if="!isCompleted && value === 0">-</span>
			</div>
		</div>
	</div>
</template>

<script>
import { delay, getRandomInt } from '../lib/helper';

export default {
	name: 'ProgressBar',
	props: {
		name: {
			type: String,
			default: '',
		},
		value: {
			type: Number,
			default: 0,
		},
		statusPosition: {
			type: String,
			default: 'default',
		},
		preview: {
			type: String,
			default: '',
		},
		previewType: {
			type: String,
			default: 'image', // image, video
		},
		isFake: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			max: 80,
			isCompleted: false,
		};
	},
	computed: {
		percentage() {
			const isHasTreshold = this.isFake && this.value > this.max && !this.isCompleted;
			const value = isHasTreshold ? this.max : this.value;
			return value;
		},
		barWidth() {
			const style = `width: ${this.percentage}%;`;
			return style;
		},
	},
	watch: {
		value(value) {
			if (value >= 100) {
				delay(() => {
					this.isCompleted = true;
				}, 1000);
			} else {
				this.isCompleted = false;
			}
		},
	},
	created() {
		this.max = getRandomInt(80, 90);
	},
};
</script>
