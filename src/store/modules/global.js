import router from '../../router';
import client from '../../lib/http-client';
import { setCookie, removeCookie } from '../../lib/cookie';
import userApi from '../../api/user';

const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILED = 'LOGIN_FAILED';
const LOGOUT = 'LOGOUT';
const SET_USER = 'SET_USER';
const FETCH_USER_START = 'FETCH_USER_START';
const FETCH_USER_END = 'FETCH_USER_END';

const sessionCookieName = 'mm_user';
const domain = 'mymeet.no';

const state = function () {
	return {
		location: '/',
		user: false,
		isFetchingUser: false,
		locale: 'en',
		isLoggedIn: !!localStorage.getItem('token'),
		loginError: false,
		pending: false,
	};
};

const mutations = {
	[LOGIN](state) {
		state.pending = true;
	},
	[LOGIN_SUCCESS](state) {
		state.isLoggedIn = true;
		state.loginError = false;
		state.pending = false;
	},
	[LOGIN_FAILED](state, errorMessage) {
		state.loginError = errorMessage;
		state.pending = false;
	},
	[LOGOUT](state) {
		state.user = false;
		state.isLoggedIn = false;
		state.fbAdAccounts = [];
	},
	[FETCH_USER_START](state) {
		state.isFetchingUser = true;
	},
	[FETCH_USER_END](state) {
		state.isFetchingUser = false;
	},
	[SET_USER](state, user) {
		state.user = user;
	},
	navigate(state, to) {
		state.location = to;
	},
};

const actions = {
	login({ commit }, creds) {
		commit(LOGIN); // show spinner
		const authCallback = function (response) {
			const jwt = response.data.access_token;
			localStorage.setItem('token', jwt);
			client.defaults.headers.Authorization = `Bearer ${jwt}`;
			commit(LOGIN_SUCCESS);
			router.push('/');
		};
		const authErrorCallback = function (e) {
			// eslint-disable-next-line
			console.log(e);
			const response = e.response.data;
			const { message } = response;
			commit(LOGIN_FAILED, message);
		};
		// Post Auth
		userApi.auth(creds, authCallback, authErrorCallback);
	},
	logout({ commit }) {
		localStorage.removeItem('token');
		delete client.defaults.headers.Authorization;
		commit(LOGOUT);
		removeCookie(sessionCookieName);
		// router.push('/');
		router.go();
	},
	navigate({ commit }, to) {
		commit('navigate', to);
	},
	setUser({ commit }, user) {
		commit(SET_USER, user);
	},
	fetchUser({ commit }) {
		if (!this.isFetchingUser) {
			commit(FETCH_USER_START);
			const callback = function (response) {
				const user = response.data;
				commit(FETCH_USER_END);
				commit(SET_USER, user);

				if (user) {
					setCookie(sessionCookieName, user._id, 30, domain);
				}

				if (user.username === '') {
					router.push('/welcome');
				}
			};
			const errorCallback = function (e) {
				commit(FETCH_USER_END);
				// eslint-disable-next-line
				console.log(e);
			};
			userApi.getProfile(callback, errorCallback);
		}
	},
};

const getters = {
	user: state => state.user,
	locale: state => state.locale,
	isLoggedIn: state => state.isLoggedIn,
	isFetchingUser: state => state.isFetchingUser,
	loginError: state => state.loginError,
	pending: state => state.pending,
	isMenuActive: state => (menuName) => {
		const isActive = state.location.to.path === menuName;
		return isActive;
	},
};

export default {
	state,
	getters,
	actions,
	mutations,
};
