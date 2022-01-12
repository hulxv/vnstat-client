import { error } from "electron-log";

import {
	format,
	getMonth,
	isToday,
	isYesterday,
	startOfMonth,
	startOfToday,
	startOfYesterday,
	isThisYear,
	isThisMonth,
} from "date-fns";
import vnStat from ".";
export default class traffic {
	#db = new vnStat().db();
	constructor() {
		this.month = [];
		this.year = [];
		this.summary = [];
		this.day = [];
	}

	async getData() {
		try {
			return {
				month: await this.Month(),
				day: await this.Day(),
				year: await this.Year(),
				week: await this.Week(),
				summary: await this.Summary(),
			};
		} catch (err) {
			error(err);
			throw err;
		}
	}

	async Month() {
		try {
			this.month = await this.#db.get("day");
			return this.month;
		} catch (err) {
			error(err.message);
			throw err;
		}
	}
	async Year() {
		try {
			this.year = await this.#db.get("month");

			return this.year;
		} catch (err) {
			error(err.message);
			throw err;
		}
	}
	async Day() {
		try {
			this.day = await this.#db.get("hour");

			return this.day;
		} catch (err) {
			error(err.message);
			throw err;
		}
	}

	async Week() {
		try {
			this.day = await this.#db.get("day");

			return this.day;
		} catch (err) {
			error(err.message);
			throw err;
		}
	}

	async Summary() {
		try {
			const CurrentMonthUsageData = (await (
				await this.#db.get("month")
			).find(
				(e) => isThisMonth(new Date(e.date)) && isThisYear(new Date(e.date)),
			)) ?? {
				date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
				rx: 0,
				tx: 0,
			};

			const TodayUsageData = (await (
				await this.#db.get("day")
			).find((e) => isToday(new Date(e.date)))) ?? {
				date: format(startOfToday(new Date()), "yyyy-MM-dd"),
				rx: 0,
				tx: 0,
			};

			const YesterdayUsageData = (await (
				await this.#db.get("day")
			).find((e) => isYesterday(new Date(e.date)))) ?? {
				date: format(startOfYesterday(new Date()), "yyyy-MM-dd"),
				rx: 0,
				tx: 0,
			};
			// For debugging ---
			// console.log("month", CurrentMonthUsageData);
			// console.log("today", TodayUsageData);
			// console.log("yesterday", YesterdayUsageData);
			this.summary = [
				{
					interval: "this month",
					data: {
						...CurrentMonthUsageData,
						rx: CurrentMonthUsageData.rx / 1024 / 1024,
						tx: CurrentMonthUsageData.tx / 1024 / 1024,
					},
				},
				{
					interval: "today",
					data: {
						...TodayUsageData,
						rx: TodayUsageData.rx / 1024 / 1024,
						tx: TodayUsageData.tx / 1024 / 1024,
					},
				},
				{
					interval: "yesterday",
					data: {
						...YesterdayUsageData,
						rx: YesterdayUsageData.rx / 1024 / 1024,
						tx: YesterdayUsageData.tx / 1024 / 1024,
					},
				},
			];

			return this.summary;
		} catch (err) {
			error(err.message);
			throw err;
		}
	}
}
