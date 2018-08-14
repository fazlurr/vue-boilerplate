<template>
	<div class="calendar-root" :class="{ 'calendar--active': isOpen }">
		<div class="input-date input-date-pill form-control" @click="toggleCalendar()">{{ label }}</div>
		<div class="calendar" :class="{'calendar-mobile ': isCompact, 'calendar-right-to-left': isRighttoLeft}" v-if="isOpen">
			<div class="calendar-body">
				<div class="calendar-range" :class="{'calendar-range-mobile ': isCompact}" v-if="!showMonth || !isCompact">
					<ul class="calendar-preset">
						<li
							class="calendar-preset-ranges"
							v-for="(item, idx) in finalPresetRanges"
							:key="idx"
							:class="{'active': item.label === presetActive.label }"
							@click="updatePreset(item)"
						>
							{{item.label}}
						</li>
					</ul>
				</div>
				<div class="calendar-wrap">
					<div class="calendar-month calendar-month-left" :class="{ 'calendar-left-mobile': isCompact }">
						<div class="months-text">
							<i class="left" @click="goPrevMonth"></i>
							<span>{{monthsLocale[activeMonthStart] +' '+ activeYearStart}}</span>
							<i class="right" @click="goNextMonth" v-if="isCompact"></i>
						</div>
						<ul :class="s.daysWeeks">
							<li v-for="item in shortDaysLocale" :key="item">{{item}}</li>
						</ul>
						<ul v-for="r in 6" :class="[s.days]" :key="r">
							<li
								class="calendar-day"
								v-for="i in numOfDays"
								:key="i"
								v-html="getDayCell(r, i, startMonthDay, endMonthDate)"
								@click="selectDate(r, i, startMonthDay, activeMonthStart, activeYearStart)"
								:class="[{[s.daysSelected]: isDateSelected(r, i, 'first', startMonthDay, endMonthDate),
								[s.daysInRange]: isDateInRange(r, i, 'first', startMonthDay, endMonthDate),
								[s.dateDisabled]: isDateDisabled(r, i, startMonthDay, endMonthDate)}]"
							>
							</li>
						</ul>
					</div>
					<div class="calendar-month calendar-month-right" v-if="!isCompact">
						<div class="months-text">
							<span>{{monthsLocale[startNextActiveMonth] +' '+ activeYearEnd}}</span>
							<i class="right" @click="goNextMonth"></i>
						</div>
						<ul :class="s.daysWeeks">
							<li v-for="item in shortDaysLocale" :key="item">{{item}}</li>
						</ul>
						<ul v-for="r in 6" :class="[s.days]" :key="r">
							<li
								class="calendar-day"
								v-for="i in numOfDays"
								:key="i"
								v-html="getDayCell(r, i, startNextMonthDay, endNextMonthDate)"
								@click="selectDate(r, i, startNextMonthDay, startNextActiveMonth, activeYearEnd)"
								:class="[{[s.daysSelected]: isDateSelected(r, i, 'second', startNextMonthDay, endNextMonthDate),
								[s.daysInRange]: isDateInRange(r, i, 'second', startNextMonthDay, endNextMonthDate),
								[s.dateDisabled]: isDateDisabled(r, i, startNextMonthDay, endNextMonthDate)}]"
							>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="calendar-footer">
				<button type="button" class="btn btn-light" @click="toggleCalendar()">{{ captions.cancel }}</button>
				<button type="button" class="calendar-btn-apply btn btn-primary" @click="setDateValue()">{{ captions.apply }}</button>
			</div>
		</div>
	</div>
</template>

<script src="./js/daterangepicker.js"></script>

<style lang="scss" scoped>
	@import '../assets/scss/variables';

	$blue: #0096d9;

	.calendar {
		display: block;
		position: absolute;
		right: 0;
		// margin-top: 5px;
		width: 700px;
		height: auto;
		font-size: 13px;
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 3px;
		box-shadow: 0 1px 10px -4px #9c9c9c;
		text-align: left;
		z-index: 9;

		@media (max-width: 767px) {
			width: 100%;
		}

		&:after {
			content: '';
			display: none;
			position: absolute;
			top: -10px;
			right: .5em;
			width: 0;
			height: 0;
			color: #999;
			margin-top: 4px;
			border-style: solid;
			border-width: 5px 5px 0;
			border-color: #999 transparent transparent;
			transition: .2s all ease-in-out;
		}
	}

	.input-date {
		display: inline-block;
		position: relative;
		padding-right: 2em;
		width: auto;
		text-align: left;
		cursor: pointer;

		&:after {
			content: '';
			position: absolute;
			display: block;
			top: 36%;
			right: .5em;
			width: 0;
			height: 0;
			color: #999;
			margin-top: 4px;
			border-style: solid;
			border-width: 5px 5px 0;
			border-color: #999 transparent transparent;
			transition: .2s all ease-in-out;
		}

		&:hover {
			box-shadow: $shadow-elevate;
		}
	}

	.input-date-pill {
		padding-left: 1em;
		padding-right: 2.5em;
		border-radius: 2em;

		&:before {
			content: '';
			position: absolute;
			display: block;
			top: 0;
			bottom: 0;
			right: .5em;
			margin: auto;
			width: 25px;
			height: 25px;
			border-radius: 50%;
			background-color: $color__primary;
			transition: .2s all ease-in-out;
		}

		&:after {
			top: 34%;
			right: 15px;
			border-top-color: #fff;
		}
	}

	.calendar--active {
		.input-date {
			&:after {
				transform: rotate(180deg);
			}
		}
	}

	.months-text {
		text-align: center;
		font-weight: bold;
	}

	.months-text .left {
		float: left;
		cursor: pointer;
		width: 16px;
		height: 16px;
		background-image: url("data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDMxLjQ5NCAzMS40OTQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMxLjQ5NCAzMS40OTQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4Ij4KPHBhdGggZD0iTTEwLjI3Myw1LjAwOWMwLjQ0NC0wLjQ0NCwxLjE0My0wLjQ0NCwxLjU4NywwYzAuNDI5LDAuNDI5LDAuNDI5LDEuMTQzLDAsMS41NzFsLTguMDQ3LDguMDQ3aDI2LjU1NCAgYzAuNjE5LDAsMS4xMjcsMC40OTIsMS4xMjcsMS4xMTFjMCwwLjYxOS0wLjUwOCwxLjEyNy0xLjEyNywxLjEyN0gzLjgxM2w4LjA0Nyw4LjAzMmMwLjQyOSwwLjQ0NCwwLjQyOSwxLjE1OSwwLDEuNTg3ICBjLTAuNDQ0LDAuNDQ0LTEuMTQzLDAuNDQ0LTEuNTg3LDBsLTkuOTUyLTkuOTUyYy0wLjQyOS0wLjQyOS0wLjQyOS0xLjE0MywwLTEuNTcxTDEwLjI3Myw1LjAwOXoiIGZpbGw9IiMwMDZERjAiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==");
	}

	.months-text .right {
		float: right;
		cursor: pointer;
		width: 16px;
		height: 16px;
		background-image: url("data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDMxLjQ5IDMxLjQ5IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAzMS40OSAzMS40OTsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiPgo8cGF0aCBkPSJNMjEuMjA1LDUuMDA3Yy0wLjQyOS0wLjQ0NC0xLjE0My0wLjQ0NC0xLjU4NywwYy0wLjQyOSwwLjQyOS0wLjQyOSwxLjE0MywwLDEuNTcxbDguMDQ3LDguMDQ3SDEuMTExICBDMC40OTIsMTQuNjI2LDAsMTUuMTE4LDAsMTUuNzM3YzAsMC42MTksMC40OTIsMS4xMjcsMS4xMTEsMS4xMjdoMjYuNTU0bC04LjA0Nyw4LjAzMmMtMC40MjksMC40NDQtMC40MjksMS4xNTksMCwxLjU4NyAgYzAuNDQ0LDAuNDQ0LDEuMTU5LDAuNDQ0LDEuNTg3LDBsOS45NTItOS45NTJjMC40NDQtMC40MjksMC40NDQtMS4xNDMsMC0xLjU3MUwyMS4yMDUsNS4wMDd6IiBmaWxsPSIjMDA2REYwIi8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=");
	}

	.calendar-root {
		position: relative;
	}

	.calendar-right-to-left {
		margin-left: -460px;
	}

	.calendar-body {
		display: flex;
	}

	.calendar-footer {
		padding: 8px;
		text-align: right;
		border-top: 1px solid #ddd;

		.btn {
			font-size: 1em;
		}
	}

	.close:hover {
		cursor: pointer;
	}

	.close {
		float: right;
		padding: 0 10px;
		margin-top: -35px;
		font-size: 32px;
		font-weight: normal;
	}

	.calendar ul {
		margin: 0;
		list-style-type: none;
	}

	.calendar-wrap {
		display: flex;
		width: 75%;
		padding: 10px;

		@media (max-width: 767px) {
			display: none;
		}
	}

	.calendar-mobile {
		.calendar-wrap {
			width: 100%;
		}
	}

	.calendar-range {
		display: block;
		width: 25%;
		border-right: 1px solid #ccc;

		@media (max-width: 767px) {
			width: 100%;
		}
	}

	.calendar-left-mobile {
		width: 100% !important;
	}

	.calendar-month {
		padding: 10px;
		width: 50%;
	}

	.calendar-weeks {
		margin: 0;
		padding: 10px 0;
		width: auto;
	}

	.calendar-weeks li {
		display: inline-block;
		width: 14%;
		color: #999;
		text-align: center;
	}

	.calendar-days {
		margin: 0;
		padding: 0;
	}

	.calendar-day {
		display: inline-block;
		width: 14%;
		color: #333;
		text-align: center;
		cursor: pointer;
		line-height: 28px;

		&:last-child {
			color: red;
		}

		&:hover {
			color: #fff;
			background: darken($blue, 5%);
		}
	}

	.calendar-days-in-range {
		color: #fff !important;
		background: $blue;
	}

	.calendar-days-selected {
		color: #fff !important;
		background: #005a82;
	}

	.calendar-days--disabled {
		background-color: transparent;
		pointer-events: none;
	}

	.calendar-preset {
		margin: 10px 0 !important;
		padding: 0;
	}

	.calendar-preset-ranges {
		padding: 8px 12px;
		cursor: pointer;

		&:hover {
			background: #eee;
		}

		&.active {
			color: #fff;
			background-color: $blue;
		}
	}

	.calendar-mobile {
		width: 260px;
		z-index: 1;
		box-shadow: none;
	}

	.calendar-range-mobile {
		display: none;
	}

	.calendar-btn-apply {
		margin-left: .5em;
		background-color: #0096d9;
	}

</style>
