import 'es6-promise/auto';
import Vue from 'vue';
import Vuex from 'vuex';
import global from './modules/global';
import products from './modules/products';
import createLogger from '../plugins/logger';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
	modules: {
		global,
		products,
	},
	strict: debug,
	plugins: debug ? [createLogger()] : [],
});

export default store;
