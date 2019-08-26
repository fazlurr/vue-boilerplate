process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
	pwa: {
		name: 'MyProject',
		msTileColor: '#FFFFFF',
		// configure workbox plugin
		workboxPluginMode: 'InjectManifest',
		workboxOptions: {
			// navigateFallback: '/index.html',
			swSrc: 'src/service-worker.js',
		},
	},
};
