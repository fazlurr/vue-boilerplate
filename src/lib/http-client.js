import axios from 'axios';

const url = process.env.VUE_APP_API_URL;
const token = localStorage.getItem('token');

const globalResponseHandler = response => response;

const globalErrorHandler = (error) => {
	const { status } = error.response;
	const isTokenExpired = status === 401;
	if (isTokenExpired) {
		localStorage.removeItem('token');
		const originalRequest = error.config;
		delete originalRequest.headers.Authorization;
		window.location.href = '/';
	}
	return Promise.reject(error);
};

const client = axios.create({
	baseURL: url,
	headers: {
		Authorization: `Bearer ${token}`,
	},
});

// Add a response interceptor
client.interceptors.response.use(globalResponseHandler, globalErrorHandler);

export default client;
