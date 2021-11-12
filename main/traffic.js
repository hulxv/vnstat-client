import { error, info } from "electron-log";

import {
	format,
	getMonth,
	isToday,
	isYesterday,
	startOfMonth,
	startOfToday,
	startOfYesterday,
} from "date-fns";
import Database from "./vndb";

export default class traffic {
	#db = new Database(); // initialize database
	constructor() {
		this.month = [];
		this.year = [];
		this.main = [];
		this.day = [];
	}

	async getData() {
		try {
			await this.Month();
			await this.Day();
			await this.Year();
			await this.Main();
		} catch (err) {}
	}

	async Month() {
		try {
			this.month = await this.#db.Get("day");
			info("Getting month data is successfully");
			return this.month;
		} catch (err) {
			error(err.message);
		}
	}
	async Year() {
		try {
			this.year = await this.#db.Get("month");
			info("Getting year data is successfully");

			return this.year;
		} catch (err) {
			error(err.message);
		}
	}
	async Day() {
		try {
			this.day = await this.#db.Get("hour");
			info("Getting day data is successfully");

			return this.day;
		} catch (err) {
			error(err.message);
		}
	}

	async Main() {
		try {
			const MonthUsageData = (await (
				await this.#db.Get("month")
			).find((e) => getMonth(new Date(e.date)) === getMonth(new Date()))) ?? {
				date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
				rx: 0,
				tx: 0,
			};

			const TodayUsageData = (await (
				await this.#db.Get("day")
			).find((e) => isToday(new Date(e.date)))) ?? {
				date: format(startOfToday(new Date()), "yyyy-MM-dd"),
				rx: 0,
				tx: 0,
			};

			const YesterdayUsageData = (await (
				await this.#db.Get("day")
			).find((e) => isYesterday(new Date(e.date)))) ?? {
				date: format(startOfYesterday(new Date()), "yyyy-MM-dd"),
				rx: 0,
				tx: 0,
			};
			// For debugging ---
			// console.log("month", MonthUsageData);
			// console.log("today", TodayUsageData);
			// console.log("yesterday", YesterdayUsageData);
			this.main = [
				{
					interval: "this month",
					data: {
						...MonthUsageData,
						rx: MonthUsageData.rx / 1024 / 1024,
						tx: MonthUsageData.tx / 1024 / 1024,
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
			info("Getting header data is successfully");

			return this.main;
		} catch (err) {
			error(err.message);
		}
	}
}
