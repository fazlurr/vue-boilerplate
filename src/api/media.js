// import client from '../lib/http-client';
import axios from 'axios';

const host = 'https://public.orderonline.id/media';

export default {
	// Upload Image
	uploadImage(params, cb, errorCb) {
		const endpoint = `${host}/image`;
		axios.post(endpoint, params)
			.then((response) => {
				cb(response.data);
			})
			.catch((e) => {
				errorCb(e);
			});
	},
};
