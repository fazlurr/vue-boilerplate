<template>
	<div class="page-login">
		<div class="container">
			<!-- Login Logo -->
			<div class="login-logo visible-sm">
				<picture>
					<source srcset="/img/login-logo.png 1x, /img/login-logo@2x.png 2x">
					<img src="/img/login-logo.png" class="d-block m-auto" loading="lazy" alt="MyProject">
				</picture>
			</div>
			<!-- Login Box -->
			<div class="login-box card d-flex align-items-center">
				<div class="login-box-image hidden-sm">
					<picture>
						<source srcset="/img/login-logo.png 1x, /img/login-logo@2x.png 2x">
						<img src="/img/login-logo.png" class="d-block m-auto" loading="lazy" alt="MyProject">
					</picture>
				</div>
				<div class="login-box-content card-body">
					<!-- Login Fields -->
					<template v-if="!isShowResetPassword">
						<div class="login-error callout callout--danger hidden" v-if="loginError">
							<div class="callout__content">{{ loginError }}</div>
						</div>
						<form @submit.prevent="login({ email, password })">
							<h3 class="text-left">{{ $t('Login') }}</h3>
							<!-- Email -->
							<div class="form-group">
								<md-field>
									<md-icon>email</md-icon>
									<label>{{ $t('Email') }}</label>
									<md-input type="email" name="email" v-model="email"></md-input>
								</md-field>
							</div>
							<!-- Password -->
							<div class="form-group">
								<md-field>
									<md-icon>lock</md-icon>
									<label>{{ $t('Password') }}</label>
									<md-input type="password" name="password" v-model="password"></md-input>
								</md-field>
							</div>
							<!-- Submit -->
							<div class="text-right">
								<button
									type="submit"
									class="btn btn-submit btn-primary"
									:class="{ 'is-loading': isLoggingIn }">{{ $t('Login') }}</button>
							</div>
							<div class="login-extra d-flex justify-content-between align-items-center mt-4">
								<div class="col-50">
									<a class="login-action" @click="showResetPassword">{{ $t('Forgot Password') }}</a>
								</div>
								<div class="col-50">
									<div class="flex-center">
										<div class="w-100">{{ $t('Language') }}:</div>
										<md-menu md-size="medium" md-direction="bottom-end" md-align-trigger>
											<md-button class="md-button-plain" md-menu-trigger>
												<span class="va-m">{{ languageLabel[lang] }}</span>
												<i class="material-icons va-m">arrow_drop_down</i>
											</md-button>
											<md-menu-content>
												<md-menu-item @click="setLanguage('en')">English</md-menu-item>
												<md-menu-item @click="setLanguage('no')">Norsk</md-menu-item>
											</md-menu-content>
										</md-menu>
									</div>
								</div>
							</div>
						</form>
					</template>

					<!-- Reset Password -->
					<template v-if="isShowResetPassword">
						<div class="login-error callout callout--danger" v-if="resetPasswordError">
							<div class="callout__content">{{ resetPasswordError }}</div>
						</div>
						<div class="login-error callout callout--success" v-if="resetPasswordSuccess">
							<div class="callout__title">Please Check Your Email</div>
							<div class="callout__content">If your email is registered in LMS, you will receive a link to reset your password in your email inbox</div>
						</div>
						<form @submit.prevent="resetPassword({ email, password })">
							<h3 class="m-0 text-left">{{ $t('Reset Password') }}</h3>
							<div class="form-group">
								<md-field>
									<md-icon>email</md-icon>
									<label>{{ $t('Email') }}</label>
									<md-input name="email" v-model="email"></md-input>
								</md-field>
							</div>
							<div class="d-flex justify-content-between align-items-center">
								<a class="login-action" @click="showLogin">{{ $t('Login') }}</a>
								<button type="submit" class="btn btn-submit btn-primary" :class="{ 'is-loading': isResettingPassword }" @click="resetPassword">{{ $t('Reset') }}</button>
							</div>
						</form>
					</template>
				</div>
			</div>
		</div>
		<div class="modals">
			<!-- Login Error -->
			<modal class="login-error-modal" size="small-medium" v-if="error" @close="error = false">
				<div slot="header"><h3>LOGIN ERROR</h3></div>
				<div slot="body" class="text-left">
					<div v-if="errorMessage === ''">{{ $t('Wrong Email or Password') }}</div>
					<div v-else>{{ errorMessage }}</div>
				</div>
				<div slot="footer">
					<button type="button" class="btn btn-secondary" @click="error = false">OK</button>
				</div>
			</modal>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getAxiosErrorMessage } from '../lib/helper';
import Modal from '../components/Modal.vue';
import authApi from '../api/auth';

export default {
	name: 'login',
	components: {
		Modal,
	},
	data() {
		return {
			email: '',
			password: '',
			isShowResetPassword: false,
			isResettingPassword: false,
			resetPasswordError: false,
			resetPasswordSuccess: false,
			error: false,
			errorMessage: '',
			languageLabel: {
				en: 'English',
				no: 'Norsk',
			},
		};
	},
	methods: {
		...mapActions({
			setLocale: 'setLocale',
		}),
		login() {
			const credentials = {
				email: this.email,
				password: this.password,
				device: 'test',
			};
			this.$store.dispatch('login', credentials);
		},
		resetPassword() {
			const callback = () => {
				this.$notify({
					group: 'app',
					type: 'success',
					title: 'Reset Password',
					text: 'Please check your email for password reset insctructions',
				});
				this.resetPasswordSuccess = true;
				this.isResettingPassword = false;
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: 'Reset Password',
					text: message,
				});
				this.isResettingPassword = false;
			};
			authApi.resetPassword(this.email, callback, errorCallback);
			this.isResettingPassword = true;
		},
		showResetPassword(event) {
			event.preventDefault();
			this.isShowResetPassword = true;
		},
		showLogin() {
			this.isShowResetPassword = false;
		},
		setLanguage(lang) {
			this.$router.push({ query: { lang } });
		},
	},
	computed: {
		...mapGetters({
			user: 'user',
			locale: 'locale',
			isLoggingIn: 'isLoggingIn',
			loginError: 'loginError',
		}),
		action() {
			const { action } = this.$route.query;
			return action;
		},
		lang() {
			const lang = this.$route.query.lang || this.locale;
			return lang;
		},
	},
	watch: {
		loginError(loginError) {
			if (loginError) {
				this.error = true;
				this.errorMessage = loginError;
			}
		},
	},
	created() {
		document.body.classList.add('login');
		if (this.action && this.action === 'forgot_password') {
			this.isShowResetPassword = true;
		}
	},
	destroyed() {
		document.body.classList.remove('login');
	},
};
</script>
