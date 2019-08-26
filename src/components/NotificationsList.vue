<template>
	<div class="nav-link" :class="{ 'unread': isHasUnread }" aria-haspopup="true">
		<div class="menu-dropdown">
			<div class="notifications-icon" :data-unread="unreadDisplay" @click="isOpen = !isOpen" v-tooltip="$t('Notifications')">
				<i class="material-icons" :class="{ 'ring': isRinging }">notifications</i>
			</div>
			<div class="menu-dropdown-content" v-if="isOpen">
				<div class="notifications-wrapper">
					<div class="notifications-actions flex-center">
						<div>{{ $t('Notifications') }}</div>
						<a @click="markAllAsRead" class="notifications-mark-all">{{ $t('Mark All as Read') }}</a>
					</div>
					<div class="notifications-list" @scroll="handleScroll">
						<notification
							v-for="(notification, index) in notifications"
							:key="index"
							:item="notification"
							:show-date="true"
							@read="reduceUnread">
						</notification>
						<div class="p-2 bg-grey-light text-primary text-center" v-if="!isFetching && notifications.length === 0">
							{{ $t('No Notifications') }}
						</div>
						<loader v-if="isFetching"></loader>
					</div>
					<div class="notifications-footer" @click="showAll">{{ $t('Show All Notifications') }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Loader from './Loader.vue';
import Notification from './Notification.vue';
import notificationsApi from '../api/notifications';
// import { notifSound } from '../lib/statics';
import { delay, getNotifLink, showNotif } from '../lib/helper';

export default {
	name: 'NotificationsList',
	components: {
		Loader,
		Notification,
	},
	data() {
		return {
			notifications: [],
			isFetching: false,
			page: 1,
			limit: 10,
			sortBy: 'created_at',
			sort: 'desc',
			isAll: false,
			unread: 0,
			isOpen: false,
			isRinging: false,
		};
	},
	sockets: {
		notification_add(notification) {
			// eslint-disable-next-line
			// console.log('New Notification', notification);
			this.add(notification);
			this.showDeviceNotif(notification);
		},
	},
	methods: {
		fetchNotifications() {
			this.isFetching = true;
			const params = {
				page: this.page,
				limit: this.limit,
				sort_by: this.sortBy,
				sort: this.sort,
			};
			const callback = (response) => {
				this.isFetching = false;
				const notifications = response.data || [];
				const isEmpty = this.notifications.length === 0;
				if (isEmpty) {
					this.notifications = notifications;
				} else {
					this.notifications = this.notifications.concat(notifications);
				}
				// const unread = response.data.unread ? response.data.unread : 0;
				// this.unread = unread;
				this.isAll = notifications.length < this.limit;
				this.page++;
			};
			const errorCallback = () => {
				this.isFetching = false;
			};
			notificationsApi.getAll(params, callback, errorCallback);
		},
		handleScroll(event) {
			const elem = event.target;
			const height = elem.offsetHeight;
			const scrollTop = elem.scrollTop;
			const scrollHeight = elem.scrollHeight;
			if ((scrollTop + height) >= scrollHeight) {
				if (!this.isFetching && !this.isAll) {
					this.fetchNotifications();
				}
			}
		},
		markAllAsRead() {
			// Mark as read
			const ids = this.notifications.map(({ id }) => id);
			const params = { notificationIds: JSON.stringify(ids) };
			const callback = () => {
				this.unread = 0;
				for (let index = 0; index < this.notifications.length; index++) {
					this.$set(this.notifications[index], 'status', 'read');
				}
			};
			notificationsApi.read(params, callback);
		},
		reduceUnread() {
			this.unread--;
		},
		add(notification) {
			const index = this.notifications.findIndex(currNotification => currNotification._id === notification._id);
			if (index === -1) {
				this.notifications.unshift(notification);
				this.addUnread(1);
				this.ring(notification.type);
			}
		},
		addUnread(value) {
			if (this.unread === -1) {
				this.unread = 0;
			}
			this.unread += value;
		},
		ring() {
			this.isRinging = true;
			delay(() => {
				this.isRinging = false;
			}, 2000);
		},
		showAll() {
			this.isOpen = false;
			this.$router.push('/notifications');
		},
		showDeviceNotif(notif) {
			const notifLink = getNotifLink(notif);
			const title = notif.title || 'Notification';
			const message = notif.text || 'Message';
			showNotif(title, message, notifLink);
		},
	},
	computed: {
		isHasUnread() {
			return this.unread > 0;
		},
		unreadDisplay() {
			return this.unread <= 99 ? this.unread : '99+';
		},
	},
	created() {
		this.fetchNotifications();
	},
};
</script>
