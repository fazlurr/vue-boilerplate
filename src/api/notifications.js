import client from '../lib/http-client';

const endpoint = '/notification';

export default {
	// Get
	get(id, cb, errorCb) {
		const url = `${endpoint}/${id}`;
		const responseHandler = (response) => {
			if (cb) cb(response.data);
		};
		const errorHandler = (e) => {
			if (errorCb) errorCb(e);
		};
		client.get(url)
			.then(responseHandler)
			.catch(errorHandler);
	},

	/**
	 * Get All
	 *
	 * @param {Object} params Params
	 * @param {number} params.page Fetch Page
	 * @param {number} params.limit Fetch Limit
	 */
	getAll(params, cb, errorCb) {
		const url = `${endpoint}`;
		const responseHandler = (response) => {
			if (cb) cb(response.data);
		};
		const errorHandler = (e) => {
			if (errorCb) errorCb(e);
		};
		client.get(url, { params })
			.then(responseHandler)
			.catch(errorHandler);
	},

	// Read
	read(params, cb, errorCb) {
		const url = `${endpoint}/read`;
		client.put(url, params)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},
};
