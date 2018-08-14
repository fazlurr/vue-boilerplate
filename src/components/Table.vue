<template>
<div class="table-wrapper">
	<!-- Menu -->
	<div class="table-list-menu">
		<div class="row">
			<div class="col-md-6">
				<div class="table-actions">
					<button class="btn btn-light btn-sm btn-icon-danger hidden" :class="{ 'is-loading': isDeleting }" :disabled="selected.length === 0" @click="isShowDeleteBulk = true"><i class="material-icons">delete</i>Delete</button>
					<div class="btn btn-plain btn-sm disabled" v-if="selected.length > 0">{{ selected.length }} Selected Order<span v-if="selected.length > 1">s</span></div>
				</div>
			</div>
			<div class="col-md-6">
				<div class="table-filters form-inline is-right">
					<button class="filter-toggle btn btn-light btn-sm hidden" @click="isShowFilter = true"><i class="material-icons">filter_list</i>Filter</button>
					<input type="text" class="input form-control form-control-sm" placeholder="Search.." v-model="keyword" @input="onKeywordChange">
				</div>
			</div>
		</div>
	</div>

	<!-- Main Table -->
	<div class="table-responsive">
		<table class="table table-primary table-striped table--small">
			<thead>
				<tr>
					<th width="5%" class="hidden">
						<label class="input-checkbox-container">
							<input type="checkbox" class="input-checkbox" v-model="selectAll">
							<span></span>
						</label>
					</th>
					<td class="align-middle p-0">
						<!-- <router-link :to="{ name: 'productDetails', params: { id: member._id } }">
							<div class="product-image" :style="{ backgroundImage: `url(${member.pictures[0]})` }"></div>
						</router-link> -->
					</td>
					<th class="text-left th-sort" :class="sortClass('name')" @click="changeSorting('name')">Name</th>
					<th class="text-left th-sort hidden-sm" :class="sortClass('email')" @click="changeSorting('email')">Email</th>
					<th class="text-left hidden-sm">Phone</th>
					<th class="text-left th-sort hidden-sm" :class="sortClass('role')" @click="changeSorting('role')">Role</th>
					<th class="text-left th-sort hidden-sm" :class="sortClass('created_at')" @click="changeSorting('created_at')">Created At</th>
					<th width="13%" class="text-left hidden-sm">Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="member in all" :key="member._id">
					<td class="hidden">
						<label class="input-checkbox-container">
							<input type="checkbox" class="input-checkbox" :value="member._id" v-model="selected">
							<span></span>
						</label>
					</td>
					<td class="align-middle text-center pt-0 pb-0">
						<div class="member-picture">
							<img :src="member.picture" :alt="member.name" v-if="member.picture">
							<i class="material-icons" v-if="!member.picture">account_box</i>
						</div>
					</td>
					<td>
						<div class="member-name">{{ member.name }}</div>
					</td>
					<td>
						<div class="member-email">{{ member.email }}</div>
					</td>
					<td>
						<div class="member-phone" v-if="member.phone">{{ member.phone }}</div>
					</td>
					<td>
						<div class="member-role">{{ member.role }}</div>
					</td>
					<td>
						<div class="member-date">{{ moment(member.created_at).format('DD-MM-YYYY') }}</div>
					</td>
					<td>
						<div class="table-col-actions member-actions">
							<router-link class="btn btn-sm btn-light" :to="{ name: 'memberDetails', params: { id: member._id } }" v-tooltip="'Edit Member'"><i class="material-icons m-0">edit</i></router-link>
							<button type="button" class="btn btn-sm btn-light" v-tooltip="'Remove Member'" @click="showDelete(member)"><i class="material-icons m-0">delete</i></button>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>

	<!-- Table Loader -->
	<div class="table-fetch-status" v-if="isFetching">
		<div class="is-loading large dark m-auto"></div>
	</div>

	<!-- Table Empty -->
	<div class="list-empty" v-if="all.length === 0 && isFetching === false"><i class="material-icons md-48">error_outline</i> <span v-if="keyword === ''">You have no member.</span><span v-else>No member was found</span></div>

	<div class="modals">
		<!-- Delete Confirm -->
		<modal class="delete-modal" size="medium" v-if="isShowDelete" @close="isShowDelete = false">
			<div slot="header"><h3><i class="material-icons">delete</i>Remove Member</h3></div>
			<div slot="body">
				Are you sure want to remove {{ selectedMember.name }} from your team?
			</div>
			<div slot="footer">
				<button type="button" class="btn btn-light" @click="isShowDelete = false">Close</button>
				<button type="button" class="btn btn-danger" :class="{ 'is-loading': isDeleting }" @click="deleteMember">Delete</button>
			</div>
		</modal>
	</div>
</div>
</template>

<script>
import Modal from '../Modal';
import { duplicateVar } from '../../lib/helper';
import teamApi from '../../api/team';

export default {
	name: 'membersTable',
	components: {
		Modal,
	},
	data() {
		return {
			all: [],
			page: 1,
			limit: 25,
			sort_by: 'created_at',
			sort: 'desc',
			keyword: '',
			selected: [],
			selectedRole: [],
			isFetching: false,
			isAll: false,
			isShowFilter: false,
			isShowDelete: false,
			isDeleting: false,
			selectedMember: null,
		};
	},
	methods: {
		fetch(reset = false) {
			if (reset) {
				this.reset();
			}
			this.isFetching = true;
			const params = {
				limit: this.limit,
				sort_by: this.sort_by,
				sort: this.sort,
				page: this.page,
				keyword: this.keyword,
			};
			const callback = (response) => {
				const items = response.data;
				if (items.length > 0) {
					if (this.all.length === 0) {
						this.all = items;
					} else {
						this.all = this.all.concat(items);
					}
				} else {
					this.isAll = true;
				}
				this.page++;
				this.isFetching = false;
			};
			const errorCallback = () => {
				this.isFetching = false;
			};
			teamApi.getMembers(params, callback, errorCallback);
		},
		handleScroll() {
			const pageHeight = document.documentElement.offsetHeight;
			const windowHeight = window.innerHeight;
			const scrollPosition = window.scrollY;
			const offset = 50;
			const isOnBottom = pageHeight - offset <= windowHeight + scrollPosition;
			if (isOnBottom) {
				if (!this.isFetching && !this.isAll) {
					this.fetch(false);
				}
			}
		},
		changeSorting(key) {
			const isSame = this.sort_by === key;
			this.sort_by = key;
			const sort = isSame && this.sort === 'asc' ? 'desc' : 'asc';
			this.sort = sort;
			// Re-fetch
			this.fetch(true);
		},
		sortClass(key) {
			const sameKey = this.sort_by === key;
			const className = sameKey ? `th-sort-${this.sort}` : '';
			return className;
		},
		applyFilter() {
			const status = this.selectedRole.join(',').toLowerCase();
			const query = duplicateVar(this.$route.query);
			if (status !== '') {
				query.status = status;
			} else {
				delete query.status;
			}
			const params = { path: document.location.pathname, query };
			this.$router.push(params);
			this.isShowFilter = false;
		},
		clear() {
			this.all = [];
		},
		reset() {
			this.all = [];
			this.page = 1;
			this.isAll = false;
		},
		deleteItem(index) {
			this.all.splice(index, 1);
		},
		onKeywordChange() {
			const self = this;
			this.ooDelay(() => {
				self.fetch(true);
			}, 1000);
		},
		showDelete(member) {
			this.selectedMember = member;
			this.isShowDelete = true;
		},
		deleteMember() {
			const memberId = this.selectedMember._id;
			this.isDeleting = true;
			const callback = () => {
				const index = this.all.findIndex(member => member._id === memberId);
				if (index !== -1) {
					this.all.splice(index, 1);
				}
				this.isDeleting = false;
				this.isShowDelete = false;
			};
			const errorCallback = () => {
				this.isDeleting = false;
			};
			teamApi.delete(memberId, callback, errorCallback);
		},
	},
	computed: {
		selectAll: {
			get() {
				return this.all ? this.selected.length === this.all.length : false;
			},
			set(value) {
				const selected = [];
				if (value) {
					this.all.forEach((member) => {
						selected.push(member._id);
					});
				}
				this.selected = selected;
			},
		},
		status() {
			const status = this.$route.query.status ? this.$route.query.status : '';
			return status;
		},
		selectedItems() {
			return this.all.filter(item => this.selected.includes(item._id));
		},
	},
	watch: {
	},
	created() {
		this.fetch();
		window.addEventListener('scroll', this.handleScroll);
	},
	destroyed() {
		window.removeEventListener('scroll', this.handleScroll);
	},
};
</script>
