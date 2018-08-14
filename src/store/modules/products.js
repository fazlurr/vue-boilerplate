import products from '../../api/products';

const SET_PRODUCTS = 'SET_PRODUCTS';
const APPEND_PRODUCTS = 'APPEND_PRODUCTS';
const SET_IS_FETCHING = 'SET_IS_FETCHING';
const SET_IS_FETCHED = 'SET_IS_FETCHED';
const SET_IS_ALL = 'SET_IS_ALL';
const ADD_PAGE = 'ADD_PAGE';
const RESET_PRODUCTS = 'RESET_PRODUCTS';
const DELETE = 'DELETE';

const state = {
	all: [],
	isFetching: false,
	isAll: false,
	page: 1,
	isFetched: false,
};

const getters = {
	allProducts: state => state.all,
	isFetching: state => state.isFetching,
	isAll: state => state.isAll,
	page: state => state.page,
	isFetched: state => state.isFetched,
};

const mutations = {
	[SET_PRODUCTS](state, products) {
		state.all = products;
	},
	[APPEND_PRODUCTS](state, products) {
		state.all = state.all.concat(products);
	},
	[RESET_PRODUCTS](state) {
		state.all = [];
		state.isAll = false;
		state.page = 1;
	},
	[DELETE](state, index) {
		state.all.splice(index, 1);
	},
	[SET_IS_FETCHING](state, status) {
		state.isFetching = status;
	},
	[SET_IS_FETCHED](state, status) {
		state.isFetched = status;
	},
	[SET_IS_ALL](state, status) {
		state.isAll = status;
	},
	[ADD_PAGE](state) {
		state.page++;
	},
};

const actions = {
	getProducts({ commit, getters }, params) {
		if (!getters.isFetching) {
			commit(SET_IS_FETCHING, true);
			const callback = (response) => {
				const products = response.data;
				if (products.length !== 0) {
					commit(APPEND_PRODUCTS, products);
					commit(ADD_PAGE);
				} else {
					commit(SET_IS_ALL, true);
				}
				commit(SET_IS_FETCHING, false);
				commit(SET_IS_FETCHED, true);
			};
			const errorCallback = (e) => {
				// eslint-disable-next-line
				console.log(e);
				commit(SET_IS_FETCHED, true);
			};
			products.getProducts(params, callback, errorCallback);
		}
	},
	resetProducts({ commit }) {
		commit(RESET_PRODUCTS);
	},
	delete({ commit }, index) {
		commit(DELETE, index);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
