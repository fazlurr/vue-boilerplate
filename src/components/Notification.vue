<template>
	<optional-router-link
		class="notification-item link-text flex-center-left"
		:class="{ 'unread': item.status === 'unread' }"
		:to="link"
		:disabled="link === ''">
		<i class="material-icons">{{ icon }}</i>
		<div class="notification__title mr-2">
			<div class="flex-center-left">
				<div>
					<div class="notification-dot mr-3 visible-sm"></div>
				</div>
				<div class="notification__title__text" v-tooltip="item.text">{{ item.text }}</div>
			</div>
			<!-- <div class="notification__date mt-1 text-secondary visible-sm" v-if="showDate">{{ formatDate(item.updatedAt) }}</div> -->
		</div>
		<div class="notification__date ml-a text-secondary hidden-sm" v-if="showDate">{{ formatDate(item.updatedAt) }}</div>
	</optional-router-link>
</template>

<script>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import noLocale from '../lib/locale/no';
import OptionalRouterLink from './OptionalRouterLink.vue';
import { getNotifLink } from '../lib/helper';

dayjs.locale(noLocale);
dayjs.extend(relativeTime);

export default {
	name: 'Notification',
	props: {
		item: {
			type: Object,
		},
		showDate: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		OptionalRouterLink,
	},
	methods: {
		formatDate(dateString) {
			const formatted = dayjs(dateString).from(dayjs());
			return formatted;
		},
	},
	computed: {
		icon() {
			let icon = 'how_to_vote';
			if (this.item.type === 'local_training_register') {
				icon = 'how_to_reg';
			}
			return icon;
		},
		link() {
			const link = getNotifLink(this.item);
			return link;
		},
	},
};
</script>
