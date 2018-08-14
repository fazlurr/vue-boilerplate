import client from '../lib/http-client';
import { buildQuery } from '../lib/helper';

const endpoint = '/user';

export default {
	// Auth
	auth(creds, cb, errorCb) {
		client.post('/auth', creds)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	// Reset Password
	resetPassword(email, cb, errorCb) {
		const params = {
			email,
		};
		const url = `${endpoint}/password/reset`;
		client.post(url, params)
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

	// Set Password
	setPassword(params, cb, errorCb) {
		const url = `${endpoint}/password/reset/create`;
		client.post(url, params)
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

	// Validate Reset Password Code
	validateResetPasswordCode(params, cb, errorCb) {
		const url = `${endpoint}/password/reset/validate`;
		client.post(url, params)
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

	// Get User Profile
	getProfile(cb, errorCb) {
		client.get(endpoint)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},

	// Update User Profile
	updateProfile(user, cb, errorCb) {
		client.put(endpoint, user)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				if (errorCb) {
					errorCb(e);
				}
			});
	},

	// Check Username
	checkUsername(username, cb, errorCb) {
		const params = {
			username,
		};
		const url = `${endpoint}/check_username`;
		client.post(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				if (errorCb) {
					errorCb(e);
				}
			});
	},

	// Change Password
	changePassword(currentPassword, newPassword, cb, errorCb) {
		const params = {
			current_password: currentPassword,
			new_password: newPassword,
		};
		const url = `${endpoint}/password`;
		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				if (errorCb) {
					errorCb(e);
				}
			});
	},

	// Update Bank Accounts
	updateBankAccounts(bankAccounts, cb, errorCb) {
		const params = {
			bank_accounts: JSON.stringify(bankAccounts),
		};
		const url = `${endpoint}/bank_accounts`;
		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				if (errorCb) {
					errorCb(e);
				}
			});
	},

	// Update Store
	updateStore(store, cb, errorCb) {
		const params = {
			store: JSON.stringify(store),
		};
		const url = `${endpoint}/store`;
		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				if (errorCb) {
					errorCb(e);
				}
			});
	},

	// Update Username
	updateUsername(username, cb, errorCb) {
		const params = {
			username,
		};
		const url = `${endpoint}/username`;
		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				if (errorCb) {
					errorCb(e);
				}
			});
	},

	// Update Auto Cancel Order
	updateAutoCancel(autoCancel, cb, errorCb) {
		const params = {
			auto_cancel_order: JSON.stringify(autoCancel),
		};
		const url = `${endpoint}/auto_cancel_order`;
		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				if (errorCb) {
					errorCb(e);
				}
			});
	},

	// Update Pixel IDs
	udpatePixelIds(pixelIds, cb, errorCb) {
		const params = {
			pixel_ids: JSON.stringify(pixelIds),
		};
		const url = `${endpoint}/pixel_ids`;
		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				if (errorCb) {
					errorCb(e);
				}
			});
	},

	// Update GTM IDs
	udpateGTMIds(gtmIds, cb, errorCb) {
		const params = {
			gtm_ids: JSON.stringify(gtmIds),
		};
		const url = `${endpoint}/gtm_ids`;
		client.put(url, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				if (errorCb) {
					errorCb(e);
				}
			});
	},

	// Create User
	create(params, cb, errorCb) {
		const responseHandler = (response) => {
			if (cb) {
				cb(response.data);
			}
		};
		const errorHandler = (e) => {
			if (errorCb) {
				errorCb(e);
			}
		};
		const url = `${endpoint}`;
		client.post(url, params)
			.then(responseHandler)
			.catch(errorHandler);
	},

	// Get Users
	getUsers(params, cb, errorCb) {
		const responseHandler = (response) => {
			if (cb) {
				cb(response.data);
			}
		};
		const errorHandler = (e) => {
			if (errorCb) {
				errorCb(e);
			}
		};
		const query = buildQuery(params);
		const url = `${endpoint}/lists?${query}`;
		client.get(url)
			.then(responseHandler)
			.catch(errorHandler);
	},

	// Bulk Delete
	bulkDelete(ids, cb, errorCb) {
		const params = {
			user_ids: JSON.stringify(ids),
			is_deleted: 1,
		};
		const url = `${endpoint}/is_deleted`;
		const responseHandler = (response) => {
			if (cb) {
				cb(response.data);
			}
		};
		const errorHandler = (e) => {
			if (errorCb) {
				errorCb(e);
			}
		};
		client.put(url, params)
			.then(responseHandler)
			.catch(errorHandler);
	},

	// Bulk Change Status
	bulkChangeStatus(ids, status, cb, errorCb) {
		const params = {
			user_ids: JSON.stringify(ids),
			is_active: status,
		};
		const url = `${endpoint}/is_active`;
		const responseHandler = (response) => {
			if (cb) {
				cb(response.data);
			}
		};
		const errorHandler = (e) => {
			if (errorCb) {
				errorCb(e);
			}
		};
		client.put(url, params)
			.then(responseHandler)
			.catch(errorHandler);
	},

	// Bulk Change Package
	bulkChangePackage(ids, packageName, cb, errorCb) {
		const params = {
			user_ids: JSON.stringify(ids),
			package: packageName,
		};
		const url = `${endpoint}/package`;
		const responseHandler = (response) => {
			if (cb) {
				cb(response.data);
			}
		};
		const errorHandler = (e) => {
			if (errorCb) {
				errorCb(e);
			}
		};
		client.put(url, params)
			.then(responseHandler)
			.catch(errorHandler);
	},

	// Bulk Change Expired At
	bulkChangeExpiredDate(ids, expiredDate, cb, errorCb) {
		const params = {
			user_ids: JSON.stringify(ids),
			expired_date: expiredDate,
		};
		const url = `${endpoint}/expired_date`;
		const responseHandler = (response) => {
			if (cb) {
				cb(response.data);
			}
		};
		const errorHandler = (e) => {
			if (errorCb) {
				errorCb(e);
			}
		};
		client.put(url, params)
			.then(responseHandler)
			.catch(errorHandler);
	},

	// Bulk Change Password
	bulkChangePassword(ids, password, cb, errorCb) {
		const params = {
			user_ids: JSON.stringify(ids),
			password,
		};
		const url = `${endpoint}/password/admin`;
		const responseHandler = (response) => {
			if (cb) {
				cb(response.data);
			}
		};
		const errorHandler = (e) => {
			if (errorCb) {
				errorCb(e);
			}
		};
		client.put(url, params)
			.then(responseHandler)
			.catch(errorHandler);
	},
};
