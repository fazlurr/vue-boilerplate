<template>
<div class="dropdown">
	<a class="nav-link dropdown-toggle notifications-toggle" :class="{ 'unread': isHasUnread }" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
		<div class="notifications-icon" :data-unread="unreadDisplay">
			<i class="material-icons md-36">notifications</i>
		</div>
		<div class="label ml-2">Notifications</div>
	</a>
	<div class="notifications-wrapper dropdown-menu dropdown-menu-right">
		<div class="notifications-actions">
			<a href="#" @click="onMarkAllAsRead">Mark All as Read</a>
		</div>
		<div class="notifications-list" @scroll="handleScroll">
			<notification
				v-for="(notification, index) in notifications"
				:key="index"
				:item="notification">
			</notification>
			<notification v-if="notifications.length === 0" :item="emptyNotification"></notification>
			<div class="notification-loader is-loading" v-if="isFetching"></div>
		</div>
	</div>
</div>
</template>

<script>
import Notification from './Notification';
import notificationsApi from '../api/notifications';

export default {
	name: 'notifications',
	components: {
		Notification,
	},
	data() {
		return {
			notifications: [],
			isFetching: false,
			limit: 10,
			sortBy: 'created_at',
			sort: 'desc',
			page: 1,
			emptyNotification: {
				type: 'empty',
				seen: true,
			},
			unread: 0,
		};
	},
	methods: {
		fetchNotifications() {
			this.isFetching = true;
			const params = {
				limit: this.limit,
				sort_by: this.sortBy,
				sort: this.sort,
				page: this.page,
			};
			const callback = (response) => {
				this.isFetching = false;
				const notifications = response.data.lists ? response.data.lists : [];
				const unread = response.data.unread ? response.data.unread : 0;
				const isEmpty = this.notifications.length === 0;
				if (isEmpty) {
					this.notifications = notifications;
				} else {
					this.notifications = this.notifications.concat(notifications);
				}
				this.unread = unread;
				this.page++;
			};
			const errorCallback = () => {
				this.isFetching = false;
			};
			notificationsApi.getList(params, callback, errorCallback);
		},
		handleScroll(event) {
			const elem = event.target;
			const height = elem.offsetHeight;
			const scrollTop = elem.scrollTop;
			const scrollHeight = elem.scrollHeight;
			if ((scrollTop + height) >= scrollHeight) {
				if (!this.isFetching) {
					this.fetchNotifications();
				}
			}
		},
		onMarkAllAsRead(event) {
			event.preventDefault();
			this.markAllAsRead();
		},
		markAllAsRead() {
			// Mark as read
			const callback = () => {
				this.unread = 0;
			};
			const ids = [];
			notificationsApi.markAsRead(ids, callback);
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
