<template>
	<div
		class="dnd-uploader"
		:class="{ 'is-dragged-over': isDraggedOver }"
		@drop="onDrop"
		@dragover="preventDrag"
		@dragenter="onDragEnter"
		@dragleave="onDragLeave"
		@click="onClick">
		<slot name="body">
			<div class="icon">
				<img :src="`/img/uploader-${role}@2x.png`" alt="Upload File">
			</div>
			<div class="info">Click to select file<span v-if="multiple">(s)</span> or drag the file here</div>
		</slot>
		<input
			type="file"
			name="file"
			class="input"
			ref="input"
			:accept="acceptedFiles"
			:multiple="multiple"
			@change="onInputChange">
	</div>
</template>

<script>
import { fileTypes } from '../lib/statics';

export default {
	name: 'dropArea',
	props: {
		role: {
			type: String,
			default: 'admin',
		},
		multiple: {
			type: Boolean,
			default: true,
		},
		maxSize: {
			type: Number,
			default: 100,
		},
		type: {
			type: String,
			default: 'video',
		},
	},
	data() {
		return {
			isDraggedOver: false,
			files: [],
			fileTypes,
		};
	},
	methods: {
		preventDrag(event) {
			event.preventDefault();
		},
		onClick() {
			this.$refs.input.click();
		},
		onDragEnter() {
			this.isDraggedOver = true;
		},
		onDragLeave() {
			this.isDraggedOver = false;
		},
		onDrop(event) {
			event.preventDefault();
			this.isDraggedOver = false;
			const files = event.dataTransfer.files;
			this.process(files);
		},
		onInputChange(event) {
			const input = event.target;
			const files = input.files;
			this.process(files);
		},
		process(files) {
			const oneMB = 1048576; // 1MB
			const maxUploadSize = this.maxSize; // MB
			for (let i = 0; i < files.length; i++) {
				const file = files[i];

				// Check File Size
				let fileSize = file.size;
				fileSize /= oneMB;

				// Limit Size
				const isFileSizeTooLarge = fileSize > maxUploadSize;

				// Show Notice if file size too large
				if (isFileSizeTooLarge) {
					const noticeMessage = `'${file.name}' size is too large (max ${maxUploadSize}MB)`;
					this.$notify({
						group: 'uploader',
						text: noticeMessage,
						type: 'warn',
					});
					break;
				}

				this.files.push(file);
			}
			this.$emit('change', this.files);
		},
	},
	computed: {
		acceptedFiles() {
			return this.fileTypes[this.type] ? this.fileTypes[this.type].join(',') : '';
		},
	},
};
</script>
