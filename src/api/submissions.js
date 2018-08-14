import { buildQuery } from '../lib/helper';
import client from '../lib/http-client';

const endpoint = '/submission';

export default {
	getSubmissions(params, cb, errorCb) {
		const query = buildQuery(params);
		const url = `${endpoint}?${query}`;
		client.get(url)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	getDetails(id, cb, errorCb) {
		const url = `${endpoint}/${id}`;
		client.get(url)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	delete(id, cb, errorCb) {
		const url = `${endpoint}/${id}`;
		client.delete(url)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	updateProgress(id, params, cb, errorCb) {
		const url = `${endpoint}/${id}/progress`;
		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	setStatus(id, params, cb, errorCb) {
		const url = `${endpoint}/${id}/status`;
		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	bulkDelete(ids = [], cb, errorCb) {
		const url = endpoint;

		const idsJSON = JSON.stringify(ids);
		const params = {
			submission_ids: idsJSON,
		};

		client.delete(url, { data: params })
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				if (errorCb) {
					errorCb(e);
				} else {
					// eslint-disable-next-line
					console.log(e);
				}
			});
	},

	export(params, cb, errorCb) {
		const query = buildQuery(params);
		const url = `${endpoint}/export?${query}`;
		client.get(url)
			.then((response) => {
				if (cb) {
					cb(response.data);
				}
			})
			.catch((e) => {
				if (errorCb) {
					errorCb(e);
				} else {
					// eslint-disable-next-line
					console.log(e);
				}
			});
	},
};
