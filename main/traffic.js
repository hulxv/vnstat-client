import { knex } from "knex";
import { getMonth, isToday, isYesterday } from "date-fns";

const DB_PATH = "/var/lib/vnstat/vnstat.db";

const db = knex({
	client: "sqlite",
	connection: {
		filename: DB_PATH,
	},
	useNullAsDefault: false,
});
async function getDataFromDB(table) {
	const result = await db(table).select();

	return result;
}

export default class traffic {
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
		this.month = await getDataFromDB("day");
		return this.month;
	}
	async Year() {
		this.year = await getDataFromDB("month");
		return this.year;
	}
	async Day() {
		this.day = await getDataFromDB("hour");
		return this.day;
	}
	async Main() {
		const MonthUsageData = await (
			await getDataFromDB("month")
		).find((e) => getMonth(new Date(e.date)) === getMonth(new Date()));

		const TodayUsageData = await (
			await getDataFromDB("day")
		).find((e) => isToday(new Date(e.date)));

		const YesterdayUsageData = await (
			await getDataFromDB("day")
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
