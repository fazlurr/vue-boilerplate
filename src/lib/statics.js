// Languages
export const languages = [
	{ value: 'en', label: 'English' },
	{ value: 'no', label: 'Norsk' },
];

// File MIME Types
export const fileTypes = {
	document: ['application/pdf', 'application/msword', 'application/vnd.ms-excel'],
	video: ['video/mp4'],
	image: ['image/png', 'image/jpg', 'image/jpeg'],
};

// User Excel Schema
export const schema = {
	EMAIL: {
		prop: 'email',
		type: String,
		required: true,
	},
	PASSWORD: {
		prop: 'password',
		type: String,
		required: true,
		parse(value) {
			const passwordString = String(value);
			return passwordString;
		},
	},
	LANGUAGE: {
		prop: 'language',
		type: String,
		required: true,
	},
	'FIRST NAME': {
		prop: 'firstName',
		type: String,
		required: true,
	},
	'LAST NAME': {
		prop: 'lastName',
		type: String,
		required: true,
	},
	GENDER: {
		prop: 'gender',
		type: String,
		required: true,
	},
	ROLES: {
		prop: 'roles',
		type: String,
		required: true,
	},
};
