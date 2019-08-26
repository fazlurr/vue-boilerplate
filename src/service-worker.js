if (typeof window === 'undefined') {
	// eslint-disable-next-line
	window = self;
}

const apiUrl = window.API_URL || 'https://mp-api.ajak.in';

/* eslint-disable no-undef */
workbox.routing.registerNavigationRoute('/index.html');

workbox.routing.registerRoute(
	new RegExp(apiUrl),
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'api-cache',
		plugins: [
			// new workbox.cacheableResponse.Plugin({
			// 	headers: {
			// 		'X-Is-Cacheable': 'true',
			// 	},
			// }),
		],
	}),
);
