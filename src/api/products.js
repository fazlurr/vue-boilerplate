import { buildQuery } from '../lib/helper';
import client from '../lib/http-client';

const endpoint = '/product';

export default {
	getProducts(params, cb, errorCb) {
		// const url = `/product/?limit=${params.limit}&sort_by=${params.sort_by}&sort=${params.sort}&page=${params.page}`;
		const query = buildQuery(params);
		const url = `/product?${query}`;
		client.get(url)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	getProductsList(cb, errorCb) {
		const url = '/product/list';
		client.get(url)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	getMinimalProducts(params, cb, errorCb) {
		const query = buildQuery(params);
		const url = `/product/list?${query}`;
		client.get(url)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	getProductDetails(id, cb, errorCb) {
		const url = `/product/${id}`;
		client.get(url)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	createProduct(params, cb, errorCb) {
		const url = '/product';
		client.post(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	update(id, params, cb, errorCb) {
		const url = `${endpoint}/${id}`;
		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	getAutoText(id, cb, errorCb) {
		const url = `/product/${id}/follow_up_autotext`;
		client.get(url)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	validateSlug(id, slug, cb, errorCb) {
		const url = '/product/slug';
		const params = {
			product_id: id,
			slug,
		};
		client.post(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	bulkDelete(ids = [], cb, errorCb) {
		const url = '/product';

		const idsJSON = JSON.stringify(ids);
		const params = {
			product_ids: idsJSON,
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

	updateAutoText(id, autotext, cb, errorCb) {
		const url = `${endpoint}/${id}/follow_up_autotext`;

		const params = {
			follow_up_autotext: JSON.stringify(autotext),
		};

		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	updateAutoTextSms(id, autotext, cb, errorCb) {
		const url = `${endpoint}/${id}/sms_autotext`;

		const params = {
			sms_autotext: JSON.stringify(autotext),
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

	updateNotifications(id, notifications, cb, errorCb) {
		const url = `${endpoint}/${id}/notifications`;

		const params = {
			notifications: JSON.stringify(notifications),
		};

		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	updateContactFormat(id, contactFormat, cb, errorCb) {
		const url = `${endpoint}/${id}/contact_format`;

		const params = {
			contact_format: JSON.stringify(contactFormat),
		};

		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	updateAutoresponders(id, autoresponders, cb, errorCb) {
		const url = `${endpoint}/${id}/autoresponders`;

		const params = {
			autoresponders: JSON.stringify(autoresponders),
		};

		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	updateCustomAudiences(id, customAudiences, cb, errorCb) {
		const url = `${endpoint}/${id}/facebook_custom_audiences`;

		const params = {
			facebook_custom_audiences: JSON.stringify(customAudiences),
		};

		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	updateTraffic(id, trafficDistributions, cb, errorCb) {
		const url = `${endpoint}/${id}/traffic_distribution`;

		const params = {
			traffic_distribution: JSON.stringify(trafficDistributions),
		};

		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	duplicate(id, cb, errorCb) {
		const url = `${endpoint}/${id}/duplicate`;
		client.post(url)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	updateSmsGateways(id, selectedSmsGateway, cb, errorCb) {
		const url = `${endpoint}/${id}/sms_gateways`;

		const params = {
			sms_gateways: JSON.stringify(selectedSmsGateway),
		};

		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	getBelongsTo(id, cb, errorCb) {
		const url = `${endpoint}/${id}/belongs_to`;
		client.get(url)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	updateBelongsTo(id, params, cb, errorCb) {
		const url = `${endpoint}/${id}/belongs_to`;

		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},
};
