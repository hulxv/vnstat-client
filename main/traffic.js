import { getMonth, isToday, isYesterday } from "date-fns";
import Database from "./db";

export default class traffic {
	#db = new Database(); // initialize database
	constructor() {
		this.month = [];
		this.year = [];
		this.main = [];
		this.day = [];
	}

	async getData() {
		await this.Month();
		await this.Day();
		await this.Year();
		await this.Main();
	}

	async Month() {
		this.month = await this.#db.Get("day");
		return this.month;
	}
	async Year() {
		this.year = await this.#db.Get("month");
		return this.year;
	}
	async Day() {
		this.day = await this.#db.Get("hour");
		return this.day;
	}
	async Main() {
		const MonthUsageData = await (
			await this.#db.Get("month")
		).find((e) => getMonth(new Date(e.date)) === getMonth(new Date()));

		const TodayUsageData = await (
			await this.#db.Get("day")
		).find((e) => isToday(new Date(e.date)));

		const YesterdayUsageData = await (
			await this.#db.Get("day")
		).find((e) => isYesterday(new Date(e.date)));

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

		return this.main;
	}
}
