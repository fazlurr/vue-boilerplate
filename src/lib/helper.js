export const CURRENCY_SYMBOLS = {
	IDR: 'Rp', // Indonesian Rupiah
	USD: '$', // US Dollar
	EUR: '€', // Euro
	CRC: '₡', // Costa Rican Colón
	GBP: '£', // British Pound Sterling
	ILS: '₪', // Israeli New Sheqel
	INR: '₹', // Indian Rupee
	JPY: '¥', // Japanese Yen
	CNY: '¥', // Chinese Yuan
	KRW: '₩', // South Korean Won
	NGN: '₦', // Nigerian Naira
	PHP: '₱', // Philippine Peso
	PLN: 'zł', // Polish Zloty
	PYG: '₲', // Paraguayan Guarani
	THB: '฿', // Thai Baht
	UAH: '₴', // Ukrainian Hryvnia
	VND: '₫', // Vietnamese Dong
};

export const getCurrencySymbol = currencyName => CURRENCY_SYMBOLS[currencyName] || currencyName;

export const getMoneyFormat = (currency = 'IDR') => {
	const decimal = currency === 'IDR' ? 0 : 2;
	const decimalSep = currency === 'IDR' ? ',' : '.';
	const thousandSep = currency === 'IDR' ? '.' : ',';
	const format = {
		decimal,
		decimalSep,
		thousandSep,
	};
	return format;
};

export const formatNumber = (n, decimals, decimalSep, thousandsSep) => {
	// if decimal is zero we must take it, it means user does not want to show any decimal
	const c = isNaN(decimals) ? 2 : Math.abs(decimals);

	// if no decimal separator is passed we use the dot as default decimal separator
	// (we MUST use a decimal separator)
	const d = decimalSep || '.';

	// if you don't want to use a thousands separator you can pass empty string as thousandsSep value
	const t = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep;

	const sign = (n < 0) ? '-' : '';

	// extracting the absolute value of the integer part of the number and converting to string
	let nX = n;
	const i = parseInt(nX = Math.abs(nX).toFixed(c), 10).toString();

	let j = i.length;
	j = (j > 3) ? j % 3 : 0;

	const x = j ? i.substr(0, j) + t : '';
	const y = i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`);
	const z = c ? d + Math.abs(n - i).toFixed(c).slice(2) : '';

	return sign + x + y + z;
};

export const formatMoney = (number, currency = 'IDR') => {
	const isMinus = number < 0;
	const format = getMoneyFormat(currency);
	number = isMinus ? number * -1 : number;
	const money = formatNumber(number, format.decimal, format.decimalSep, format.thousandSep);
	const symbol = getCurrencySymbol(currency);
	const formatted = isMinus ? `-${symbol}${money}` : `${symbol}${money}`;
	return formatted;
};

// Format Number to display without symbol
export const formatNumberPlain = (number, currency = 'IDR') => {
	const format = getMoneyFormat(currency);
	const money = formatNumber(number, format.decimal, format.decimalSep, format.thousandSep);
	return money;
};

export const formatNumber2 = (num, decpoint, sep) => {
	let numNew = num;
	let decpointNew = decpoint;
	let sepNew = sep;
	// check for missing parameters and use defaults if so
	if (decpointNew === undefined) {
		decpointNew = '.';
	}

	if (sepNew === undefined) {
		sepNew = ',';
	}

	// need a string for operations
	numNew = numNew.toString();

	// separate the whole number and the fraction if possible
	const a = numNew.split(decpointNew);
	let x = a[0]; // decimal
	const y = a[1]; // fraction
	let z = '';

	if (typeof (x) !== 'undefined') {
		// reverse the digits. regexp works from left to right.
		for (let i = x.length - 1; i >= 0; i -= 1) {
			z += x.charAt(i);
		}

		// add separators. but undo the trailing one, if there
		z = z.replace(/(\d{3})/g, `$1${sepNew}`);
		if (z.slice(-sepNew.length) === sepNew) {
			z = z.slice(0, -sepNew.length);
		}

		x = '';
		// reverse again to get back the number
		for (let i = z.length - 1; i >= 0; i -= 1) {
			x += z.charAt(i);
		}

		// add the fraction back in, if it was there
		if (typeof (y) !== 'undefined' && y.length > 0) {
			x += decpointNew + y;
		}
	}

	return x;
};

export const nFormatter = (num, digits, currency) => {
	let si = [];
	if (currency === 'IDR') {
		si = [
			{ value: 1, symbol: '' },
			{ value: 1E3, symbol: 'rb' },
			{ value: 1E6, symbol: 'jt' },
			{ value: 1E9, symbol: 'M' },
			{ value: 1E12, symbol: 'T' },
			{ value: 1E15, symbol: 'P' },
			{ value: 1E18, symbol: 'E' },
		];
	} else {
		si = [
			{ value: 1, symbol: '' },
			{ value: 1E3, symbol: 'k' },
			{ value: 1E6, symbol: 'M' },
			{ value: 1E9, symbol: 'B' },
			{ value: 1E12, symbol: 'T' },
			{ value: 1E15, symbol: 'P' },
			{ value: 1E18, symbol: 'E' },
		];
	}
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	let i;
	for (i = si.length - 1; i > 0; i--) {
		if (num >= si[i].value) {
			break;
		}
	}
	return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
};

export const formatMoneyShort = (number, currency = 'IDR') => {
	const symbol = getCurrencySymbol(currency);
	const money = nFormatter(number, 2, currency);
	const formatted = `${symbol}${money}`;
	return formatted;
};

export const duplicateVar = value => JSON.parse(JSON.stringify(value));

/**
 * Slugify
 * @see https://gist.github.com/mathewbyrne/1280286
*/
export const slugify = text =>
	text.toString().toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		// eslint-disable-next-line
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		// eslint-disable-next-line
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, '') // Trim - from end of text
;

/**
 * Build Query String
 * @param params
 * @see https://stackoverflow.com/a/34209399/5627904
*/
export const buildQuery = (params) => {
	const esc = encodeURIComponent;
	const query = Object.keys(params)
		.map(k => `${esc(k)}=${esc(params[k])}`)
		.join('&');
	return query;
};

/**
 * Detect Mobile Browser
 * @see https://stackoverflow.com/a/11381730/5627904
 */
export const isMobile = () => {
	let check = false;
	// eslint-disable-next-line
	(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; }(navigator.userAgent || navigator.vendor || window.opera));
	return check;
};

/**
 * Detect Mobile and Tab Browser
 * @see https://stackoverflow.com/a/11381730/5627904
 */
export const isMobileOrTablet = () => {
	let check = false;
	// eslint-disable-next-line
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};

/**
* Get YouTube ID from various YouTube URL
* @author takien
* @see http://takien.com
*/
export const getYoutubeId = (url) => {
	let ID = '';
	url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
	if (url[2] !== undefined) {
		// eslint-disable-next-line
		ID = url[2].split(/[^0-9a-z_\-]/i);
		ID = ID[0];
	} else {
		ID = url;
	}
	return ID;
};

/**
 * Is Valid URL
 * @see https://www.w3resource.com/javascript-exercises/javascript-regexp-exercise-9.php
 */
export const isValidURL = (str) => {
	const pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
	return pattern.test(str);
};

/**
 * Is Number
 * @description Check if string is contain number only
 */
export const isNumber = (str) => {
	const reg = new RegExp(/^\d+$/);
	const isNumber = reg.test(str);
	return isNumber;
};

/**
 * Delay
 */
export const delay = (function startDelay() {
	let timer = 0;
	const call = function (callback, ms) {
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	};
	return call;
}());

/**
 * Email Validation
 */
export const isValidEmail = (email) => {
	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

const reservedSubdomains = [
	'app',
	'api',
	'api-dev',
	'dev',
	'images',
	'public',
	'help',
	'support',
	'status',
];

export const isValidSubdomain = (name) => {
	if (name === '') {
		return false;
	}

	const index = reservedSubdomains.indexOf(name);

	if (index !== -1) {
		return false;
	}

	const patterns = [
		'db[0-9]+',
		'dc[0-9]+',
		'dev[0-9]+',
		'dns[0-9]+',
		'ftp[0-9]+',
		'host[0-9]+',
		'm[0-9]+',
		'mail[0-9]+',
		'mx[0-9]+',
		'ns[0-9]+',
		'server-[0-9]+',
		'server[0-9]+',
		'smtp[0-9]+',
		'static[0-9]+',
		'test[0-9]+',
		'v[0-9]+',
		'vpn[0-9]+',
		'web[0-9]+',
		'ww[a-z0-9-]+',
	];

	const patternsRegex = patterns.map(pattern => new RegExp(pattern));

	for (let i = 0; i < patternsRegex.length; ++i) {
		const regex = patternsRegex[i];

		if (regex.test(name)) {
			return false;
		}
	}

	return true;
};

export const triggerEvent = (el, type) => {
	if ('createEvent' in document) {
		// modern browsers, IE9+
		const e = document.createEvent('HTMLEvents');
		e.initEvent(type, false, true);
		el.dispatchEvent(e);
	} else {
		// IE 8
		const e = document.createEventObject();
		e.eventType = type;
		el.fireEvent(`on${e.eventType}`, e);
	}
};

/**
 * Insert Text at Textarea Cursor
 *
 * @param {HTMLTextAreaElement} myField
 * @param {String} myValue
 *
 * @see https://stackoverflow.com/a/47850725/5627904
 */
export const insertAtCursor = (myField, myValue) => {
	// IE support
	if (document.selection) {
		myField.focus();
		const sel = document.selection.createRange();
		sel.text = myValue;
	} else if (window.navigator.userAgent.indexOf('Edge') > -1) { // Microsoft Edge
		const startPos = myField.selectionStart;
		const endPos = myField.selectionEnd;

		myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);

		const pos = startPos + myValue.length;
		myField.focus();
		myField.setSelectionRange(pos, pos);
	} else if (myField.selectionStart || myField.selectionStart === 0) { // MOZILLA and others
		const startPos = myField.selectionStart;
		const endPos = myField.selectionEnd;
		myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
	} else {
		myField.value += myValue;
	}
	triggerEvent(myField, 'input');
};

export const formatMonth = (month, lang = 'ID') => {
	const months = {
		ID: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
		US: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	};
	return months[lang][month];
};

export const getAxiosErrorMessage = e => e.response.data.message;

// Create Combinations
export const createCombinations = (data) => {
	const result = data.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []));
	// const result = data.reduce(
	// 	(a, b) => a.reduce(
	// 		(r, v) => r.concat(b.map(w => [].concat(v, w))),
	// 		[],
	// 	),
	// );
	return result;
};

// Parse Price
export const parsePrice = (price) => {
	let parsedPrice = price.replace(/[^0-9]/g, '').trim();
	const parsedPriceLength = parsedPrice.length;
	if (parsedPriceLength > 1 && parsedPrice.charAt(0) === '0') {
		parsedPrice = parsedPrice.substring(1, parsedPriceLength);
	}
	return parsedPrice;
};

/**
 * Convert Image URL into Base64 Data
 *
 * @param url Image URL
 * @param callback Retrieve Base64 as Param
 *
 * @see https://stackoverflow.com/a/50155915/5627904 StackOverflow
 */
export const imageURLtoBase64 = (url, callback) => {
	const img = new Image();
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	img.crossOrigin = 'Anonymous';
	// img.setAttribute('crossOrigin', 'Anonymous');
	img.src = url;

	img.onload = () => {
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
		const dataURL = canvas.toDataURL('image/png');
		callback(dataURL);
	};
};

/**
 * Make PDF with html2canvas and jsPDF
 *
 * @param doc Document
 * @param id Element ID
 * @param h2c html2canvas Library
 * @param jsPDF jsPDF Library
 *
 * @see https://stackoverflow.com/a/42299908/5627904
 */
export const makePDF = (doc, id, h2c, jsPDF, name, callback) => {
	const config = {
		page: {
			width: 960,
			height: 1280,
		},
	};

	const quotes = doc.getElementById(id);

	const callbackCanvas = (canvas) => {
		//! MAKE YOUR PDF
		// eslint-disable-next-line
		const pdf = new jsPDF('p', 'pt');

		const pageWidth = config.page.width;
		const pageHeight = config.page.height;

		for (let i = 0; i <= quotes.clientHeight / pageHeight; i++) {
			//! This is all just html2canvas stuff
			const srcImg = canvas;
			const sX = 0;
			const sY = pageHeight * i; // start 980 pixels down for every new page
			const sWidth = pageWidth;
			const sHeight = pageHeight;
			const dX = 0;
			const dY = 0;
			const dWidth = pageWidth;
			const dHeight = pageHeight;

			const onePageCanvas = doc.createElement('canvas');
			onePageCanvas.setAttribute('width', sWidth);
			onePageCanvas.setAttribute('height', sHeight);
			const ctx = onePageCanvas.getContext('2d');
			// details on this usage of this function:
			// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
			ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

			// document.body.appendChild(canvas);
			const canvasDataURL = onePageCanvas.toDataURL('image/png', 1.0);

			const width = onePageCanvas.width;
			const height = onePageCanvas.clientHeight;

			//! If we're on anything other than the first page,
			// add another page
			if (i > 0) {
				pdf.addPage();
				// pdf.addPage(612, 791); // 8.5" x 11" in pts (in*72)
				// pdf.addPage(595.44, 841.68); // A4 8.27" x 11.69" in pts (in*72)
			}
			//! now we declare that we're working on that page
			pdf.setPage(i + 1);
			//! now we add content to that page!
			// pdf.addImage(canvasDataURL, 'PNG', 20, 10, (width * 0.62), (height * 0.62));
			pdf.addImage(canvasDataURL, 'PNG', 0, 0, (width * 0.62), (height * 0.62));
		}
		//! after the for loop is finished running, we save the pdf.
		const filename = `${name}.pdf`;
		pdf.save(filename);

		if (callback) {
			callback(filename);
		}
	};

	const errorCallbackCanvas = (e) => {
		// eslint-disable-next-line
		console.log(e);
	};

	h2c(quotes).then(callbackCanvas).catch(errorCallbackCanvas);
};

/**
 * Download File URL
 */
export const downloadFile = (url) => {
	const a = document.createElement('A');
	a.href = url;
	a.download = url.substr(url.lastIndexOf('/') + 1);
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};

// nl2br
export const nl2br = (str) => {
	const breakTag = '<br>';
	return (`${str}`).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, `$1${breakTag}$2`);
};

// Get Date Range
export const getDateRange = () => {
	const today = new Date();
	// const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 1);
	// const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
	const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
	const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

	const filterDate = {
		start: startDate,
		end: endDate,
	};

	return filterDate;
};
