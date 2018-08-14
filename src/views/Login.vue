<template>
	<div class="page-login">
		<div class="container">
			<div class="login">
				<!-- Login Box -->
				<div class="login-box" v-if="!isShowResetPassword">
					<div class="login-box-logo">
						<img src="../assets/logo.png" class="d-block m-auto" alt="Awesome App">
					</div>
					<div class="login-error callout callout--danger" v-if="loginError">
						<div class="callout__content">{{ loginError }}</div>
					</div>
					<form @submit.prevent="login({ email, password })">
						<div class="form-group">
							<input type="email" name="email" class="form-control" placeholder="Email" v-model="email" required>
						</div>
						<div class="form-group">
							<input type="password" name="password" class="form-control" placeholder="Password" v-model="password" required>
						</div>
						<button type="submit" class="btn btn-submit btn-primary btn-block" :class="{ 'is-loading': pending }">Sign in</button>
					</form>
					<div class="text-right">
						<a class="login-action" @click="showResetPassword">Forgot Password?</a>
					</div>
				</div>

				<!-- Reset Password -->
				<div class="login-box" v-if="isShowResetPassword">
					<div class="login-box-logo">
						<img src="../assets/logo.png" class="d-block m-auto" alt="Awesome App">
					</div>
					<div class="login-error callout callout--danger" v-if="resetPasswordError">
						<div class="callout__content">{{ resetPasswordError }}</div>
					</div>
					<div class="login-error callout callout--success" v-if="resetPasswordSuccess">
						<div class="callout__title">Please Check Your Email</div>
						<div class="callout__content">If your email is registered in OrderOnline.id, you will receive a link to reset your password in your email inbox</div>
					</div>
					<form @submit.prevent="resetPassword({ email, password })">
						<div class="form-group">
							<input type="email" name="email" class="form-control" placeholder="Your Email Address" v-model="email" required>
						</div>
						<button type="submit" class="btn btn-submit btn-primary btn-block" :class="{ 'is-loading': isResettingPassword }">Reset Password</button>
					</form>
					<div class="text-right">
						<a class="login-action" @click="showLogin">Back to Login</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import userApi from '../api/user';

export default {
	name: 'login',
	data() {
		return {
			title: 'Login',
			email: '',
			password: '',
			isShowResetPassword: false,
			isResettingPassword: false,
			resetPasswordError: false,
			resetPasswordSuccess: false,
		};
	},
	methods: {
		...mapActions({
		}),
		login() {
			this.$store.dispatch('login', {
				email: this.email,
				password: this.password,
			});
		},
		resetPassword() {
			this.isResettingPassword = true;
			const callback = () => {
				this.isResettingPassword = false;
				this.resetPasswordSuccess = true;
			};
			const errorCallback = () => {
				this.isResettingPassword = false;
			};
			userApi.resetPassword(this.email, callback, errorCallback);
		},
		showResetPassword(event) {
			event.preventDefault();
			this.isShowResetPassword = true;
		},
		showLogin() {
			this.isShowResetPassword = false;
		},
	},
	computed: {
		...mapGetters({
			pending: 'pending',
			loginError: 'loginError',
		}),
		action() {
			const { action } = this.$route.query;
			return action;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.navbar-brand {
	margin: 0 auto;
}

.login {
	padding-top: 4em;
	text-align: center;
}

h3 {
	font-weight: 300;
}

.login-box {
	margin: 2em auto;
	padding: 2.5em;
	max-width: 420px;
	background-color: #fff;
	border-radius: 3px;
	// border: 1px solid #d7d7da;
	box-shadow: 0 1px 10px -4px #9c9c9c;
}

.login-box-logo {
	margin: 0 auto;
	margin-bottom: 2em;
	max-width: 210px;

	img {
		max-width: 100%;
		height: auto;
	}
}

.login-error {
	margin-bottom: 2em;
	font-size: .95em;
}

.login-action {
	display: inline-block;
	margin-top: 1em;
	// color: #75cfd8 !important;
	cursor: pointer;

	&:hover {
		text-decoration: underline !important;
	}
}

.btn-submit {
	padding-top: .5em;
	padding-bottom: .5em;
	// font-weight: bold;
	text-transform: uppercase;
}
</style>
