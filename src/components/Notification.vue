<template>
	<div class="notification-item dropdown-item" :class="[{ 'unread': !item.seen }, { 'empty': isEmpty }]" @click="go">
		<div class="notification__icon">
			<div class="notification-icon notification-icon-order" v-if="isNewOrder">
				<icon name="cart-plus" scale=".8"></icon>
			</div>
			<div class="notification-icon notification-icon-payment" v-if="isNewPayment">
				<icon name="dollar-sign" scale=".8"></icon>
			</div>
			<div class="notification-icon notification-icon-facebook" v-if="isFBToken">
				<icon name="brands/facebook-f" scale=".8"></icon>
			</div>
			<div class="notification-icon notification-icon-payment-confirmation" v-if="isPaymentConfirmation">
				<icon name="money-bill-alt" scale=".8"></icon>
			</div>
			<div class="notification-icon notification-icon-limit" v-if="isOrderLimit">
				<i class="material-icons">remove_shopping_cart</i>
			</div>
			<div class="notification-icon notification-icon-empty" v-if="isEmpty">
				<i class="material-icons">notifications</i>
			</div>
		</div>
		<div class="notification__content">
			<div class="notification__content__top">
				<div class="notification__type">{{ type }}</div>
				<div class="notification__time" :title="item.created_at">{{ time }}</div>
			</div>
			<div class="notification__message" v-html="message"></div>
		</div>
	</div>
</template>

<script>
import moment from 'moment';
import { formatMoney } from '../lib/helper';
import notificationsApi from '../api/notifications';

export default {
	name: 'notification',
	data() {
		return {
		};
	},
	props: {
		item: {
			type: Object,
		},
	},
	methods: {
		go() {
			// Mark as read
			const callback = () => {};
			const ids = [this.item._id];
			notificationsApi.markAsRead(ids, callback);
			this.item.seen = true;

			if (this.isNewOrder || this.isNewPayment) {
				const orderId = this.item.data.submission_id.$oid;
				this.$router.push({ name: 'submissionDetails', params: { id: orderId } });
			} else if (this.isFBToken) {
				this.$router.push('/settings/customer-file');
			} else if (this.isOrderLimit) {
				this.$router.push('/plans');
			} else if (this.isPaymentConfirmation) {
				this.$router.push('/payments');
			}
		},
	},
	computed: {
		isNewOrder() {
			return this.item.type === 'new_order';
		},
		isNewPayment() {
			return this.item.type === 'new_payment';
		},
		isFBToken() {
			return this.item.type === 'fb_token_expired';
		},
		isOrderLimit() {
			return this.item.type === 'order_limit';
		},
		isPaymentConfirmation() {
			return this.item.type === 'new_payment_confirmation';
		},
		isEmpty() {
			return this.item.type === 'empty';
		},
		type() {
			let typeLabel = '';
			const { type } = this.item;
			if (this.isNewOrder) {
				typeLabel = 'Pesanan Baru';
			} else if (this.isNewPayment) {
				typeLabel = 'Pembayaran';
			} else if (this.isPaymentConfirmation) {
				typeLabel = 'Konfirmasi Pembayaran';
			} else if (this.isFBToken) {
				typeLabel = 'Integrasi Facebook';
			} else if (this.isOrderLimit) {
				typeLabel = 'Order Limit';
			} else if (type === 'empty') {
				typeLabel = 'Notifikasi';
			} else {
				typeLabel = 'Notifikasi';
			}
			return typeLabel;
		},
		time() {
			const createdAt = this.item.created_at;
			const timezone = this.user ? this.user.timezone : 'Asia/Jakarta';
			const relativeTime = moment.utc(createdAt, 'YYYY-MM-DD hh:mm:ss').tz(timezone).fromNow();
			const time = !this.isEmpty ? relativeTime : '';
			return time;
		},
		message() {
			let message = '';
			if (this.isNewOrder) {
				message = `${this.item.data.name} memesan ${this.item.data.product_name}`;
			} else if (this.isNewPayment) {
				message = `${this.item.data.name} telah melakukan pembayaran untuk produk ${this.item.data.product_name}`;
			} else if (this.isFBToken) {
				message = 'Access token anda telah kedaluwarsa, silahkan integrasikan ulang akun Facebook anda';
			} else if (this.isOrderLimit) {
				message = 'Jumlah order anda telah mencapai limit';
			} else if (this.isPaymentConfirmation) {
				const customerName = this.item.data.customer_name ? this.item.data.customer_name : 'Seseorang';
				message = `${customerName} telah melakukan konfirmasi pembayaran sejumlah <b>${formatMoney(this.item.data.transfer_amount)}</b>`;
			} else if (this.isEmpty) {
				message = 'Anda tidak memiliki notifikasi baru';
			} else {
				message = '';
			}
			return message;
		},
	},
};
</script>

<style lang="scss">
$icon_height: 25px;

// $color__order: #f06277;
$color__order: #FFCC29;
// $color__payment: #ffcc29;
$color__payment: #8AB94B;
$color__payment-confirmation: #75CFD8;
$color__facebook: #395A9A;
$color__limit: #ED3237;
$color__empty: #CED5D9;

.notification-item {
	display: flex;
	padding: 1.1em 1em;
	width: 100%;
	border-bottom: 1px solid #ddd;

	@media (min-width: 576px) {
		min-width: 400px;
	}

	&:active {
		color: inherit;
	}

	&:last-child {
		border-bottom: 0;
	}

	&.unread {
		// background-color: #e7fbfd;
		background-color: #f6faff;
	}

	&.empty {
		pointer-events: none;
	}
}

.notification__icon {
	padding-top: 4px;
	min-width: 35px;
}

.notification-icon {
	width: $icon_height;
	height: $icon_height;
	text-align: center;
	border-radius: 50%;
	background-color: #ddd;

	.material-icons,
	.fa-icon {
		height: $icon_height;
		color: #fff;
	}

	.material-icons {
		font-size: 1em;
		line-height: $icon_height;
	}
}

.notification-icon-order {
	background-color: $color__order;

	.fa-icon {
		position: relative;
		left: -1px;
	}
}

.notification-icon-payment {
	background-color: $color__payment;
}

.notification-icon-payment-confirmation {
	background-color: $color__payment-confirmation;
}

.notification-icon-facebook {
	background-color: $color__facebook;
}

.notification-icon-limit {
	background-color: $color__limit;
}

.notification-icon-empty {
	background-color: $color__empty;
}

.notification__content {
	width: 100%;
	// max-width: 239px;
}

.notification__content__top {
	display: flex;
	justify-content: space-between;
}

.notification__type {
	min-width: 100px;
	font-weight: bold;
}

.notification__time {
	opacity: .6;
}

.notification__message {
	margin-top: .5em;
	white-space: normal;
}
</style>
