import client from '../lib/http-client';

const endpoint = '/file';

export default {
	/**
	 * File Upload
	 * @param {Object} params Params
	 * @param {File} params.fileUpload File to be uploaded
	 * @param {*} cb
	 * @param {*} errorCb
	 */
	upload(params, cb, errorCb, progressCallback) {
		const url = `${endpoint}/upload`;
		const config = {
			onUploadProgress: (progressEvent) => {
				const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
				if (progressCallback) progressCallback(percentCompleted);
			},
		};
		const responseHandler = (response) => {
			if (cb) cb(response.data);
		};
		const errorHandler = (e) => {
			if (errorCb) errorCb(e);
		};
		client.post(url, params, config)
			.then(responseHandler)
			.catch(errorHandler);
	},
};
