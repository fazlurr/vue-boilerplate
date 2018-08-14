import client from '../lib/http-client';
import { buildQuery } from '../lib/helper';

const endpoint = '/notification';

export default {
	// Get Notifications List
	getList(params, cb, errorCb) {
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

	// Mark As Read
	markAsRead(ids, cb, errorCb) {
		const url = `${endpoint}/read`;
		const params = {
			notification_ids: JSON.stringify(ids),
		};
		client.put(url, params)
			.then((response) => {
				if (cb) {
					cb(response.data);
				}
			})
			.catch((e) => {
				if (errorCb) {
					errorCb(e);
				}
			});
	},
};
