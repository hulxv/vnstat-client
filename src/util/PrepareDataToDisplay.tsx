import {
	lastDayOfMonth,
	startOfMonth,
	eachDayOfInterval,
	eachHourOfInterval,
	startOfDay,
	format,
	eachMonthOfInterval,
	endOfDay,
	subDays,
	startOfYear,
	subMonths,
	subYears,
	getYear,
	endOfYear,
	getDate,
	startOfWeek,
	lastDayOfWeek,
	subWeeks,
} from "date-fns";

/** Minimal shape consumed by the prepare* helpers (a TrafficEntry subset). */
export interface RawTrafficEntry {
	date: string;
	rx: number;
	tx: number;
}

export interface PreparedEntry {
	date: string;
	rx: number;
	tx: number;
}

/** A nivo line-chart series. */
export interface LineSeries {
	id: string;
	color?: string;
	data: { x: number | string; y: string }[];
}

/** A nivo bar-chart datum. */
export interface BarDatum {
	date: number | string;
	Download: string;
	Upload: string;
}

export interface PreparedResult {
	preparedData: PreparedEntry[];
	lineChartData: LineSeries[];
	barChartData: BarDatum[];
	total: { down: number; up: number };
}

/** Merge fetched rows onto a zero-filled calendar and convert bytes → MB. */
function mergeAndConvert(
	calendar: string[],
	data: RawTrafficEntry[]
): PreparedEntry[] {
	const defaults: PreparedEntry[] = calendar.map(date => ({
		date,
		rx: 0,
		tx: 0,
	}));
	return defaults
		.map(day => data.find(d => d.date === day.date) ?? day)
		.map(d => ({ ...d, rx: d.rx / 1024 / 1024, tx: d.tx / 1024 / 1024 }));
}

function totalOf(preparedData: PreparedEntry[]): { down: number; up: number } {
	return {
		down: preparedData.reduce((a, b) => a + b.rx, 0),
		up: preparedData.reduce((a, b) => a + b.tx, 0),
	};
}

function prepareMonthData(
	Data: RawTrafficEntry[],
	amountMonths = 0
): PreparedResult {
	const calendar = eachDayOfInterval({
		start: startOfMonth(subMonths(new Date(), amountMonths)),
		end: lastDayOfMonth(subMonths(new Date(), amountMonths)),
	}).map(date => format(new Date(date), "yyyy-MM-dd"));

	const preparedData = mergeAndConvert(calendar, Data);

	const lineChartData: LineSeries[] = [
		{
			id: "Upload",
			data: preparedData.map(e => ({
				x: getDate(new Date(e.date)),
				y: (e.tx / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: preparedData.map(e => ({
				x: getDate(new Date(e.date)),
				y: (e.rx / 1024).toFixed(2),
			})),
		},
	];
	const barChartData: BarDatum[] = preparedData.map(e => ({
		date: getDate(new Date(e.date)),
		Download: (e.rx / 1024).toFixed(2),
		Upload: (e.tx / 1024).toFixed(2),
	}));

	return {
		preparedData,
		lineChartData,
		barChartData,
		total: totalOf(preparedData),
	};
}

function prepareDayData(
	Data: RawTrafficEntry[],
	amountDays = 0
): PreparedResult {
	const calendar = eachHourOfInterval({
		start: startOfDay(subDays(new Date(), amountDays)),
		end: endOfDay(subDays(new Date(), amountDays)),
	}).map(date => format(new Date(date), "yyyy-MM-dd HH:mm:ss"));

	const preparedData = mergeAndConvert(calendar, Data);

	const lineChartData: LineSeries[] = [
		{
			id: "Upload",
			color: "hsl(227, 18%, 50%)",
			data: preparedData.map(e => ({
				x: format(new Date(e.date), "haaa"),
				y: (e.tx / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: preparedData.map(e => ({
				x: format(new Date(e.date), "haaa"),
				y: (e.rx / 1024).toFixed(2),
			})),
		},
	];

	const barChartData: BarDatum[] = preparedData.map(e => ({
		date: format(new Date(e.date), "haaa"),
		Download: (e.rx / 1024).toFixed(2),
		Upload: (e.tx / 1024).toFixed(2),
	}));

	return {
		preparedData,
		lineChartData,
		barChartData,
		total: totalOf(preparedData),
	};
}

function prepareYearData(
	Data: RawTrafficEntry[],
	amountYears = 0
): PreparedResult {
	const calendar = eachMonthOfInterval({
		start: startOfYear(subYears(new Date(), amountYears)),
		end: endOfYear(subYears(new Date(), amountYears)),
	}).map(date => format(new Date(date), "yyyy-MM-dd"));

	const preparedData = mergeAndConvert(calendar, Data);

	const lineChartData: LineSeries[] = [
		{
			id: "Upload",
			data: preparedData.map(e => ({
				x: format(new Date(e.date), "MMM"),
				y: (e.tx / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: preparedData.map(e => ({
				x: format(new Date(e.date), "MMM"),
				y: (e.rx / 1024).toFixed(2),
			})),
		},
	];

	const barChartData: BarDatum[] = preparedData.map(e => ({
		date: format(new Date(e.date), "MMM"),
		Download: (e.rx / 1024).toFixed(2),
		Upload: (e.tx / 1024).toFixed(2),
	}));

	return {
		preparedData,
		lineChartData,
		barChartData,
		total: totalOf(preparedData),
	};
}

function prepareWeekData(
	Data: RawTrafficEntry[],
	amountWeeks = 0
): PreparedResult {
	const calendar = eachDayOfInterval({
		start: startOfWeek(subWeeks(new Date(), amountWeeks)),
		end: lastDayOfWeek(subWeeks(new Date(), amountWeeks)),
	}).map(date => format(new Date(date), "yyyy-MM-dd"));

	const preparedData = mergeAndConvert(calendar, Data);

	const lineChartData: LineSeries[] = [
		{
			id: "Upload",
			data: preparedData.map(e => ({
				x: format(new Date(e.date), "EEE"),
				y: (e.tx / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: preparedData.map(e => ({
				x: format(new Date(e.date), "EEE"),
				y: (e.rx / 1024).toFixed(2),
			})),
		},
	];
	const barChartData: BarDatum[] = preparedData.map(e => ({
		date: format(new Date(e.date), "EEE"),
		Download: (e.rx / 1024).toFixed(2),
		Upload: (e.tx / 1024).toFixed(2),
	}));

	return {
		preparedData,
		lineChartData,
		barChartData,
		total: totalOf(preparedData),
	};
}

function prepareCustomIntervalData(
	Data: RawTrafficEntry[],
	from: string = `${getYear(new Date())}-1-1`,
	to: string = `${getYear(new Date())}-1-1`
): PreparedResult {
	const calendar = eachDayOfInterval({
		start: new Date(from),
		end: new Date(to),
	}).map(date => format(new Date(date), "yyyy-MM-dd"));

	const preparedData = mergeAndConvert(calendar, Data);

	const lineChartData: LineSeries[] = [
		{
			id: "Upload",
			data: preparedData.map(e => ({
				x: format(new Date(e.date), "MMM d"),
				y: (e.tx / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: preparedData.map(e => ({
				x: format(new Date(e.date), "MMM d"),
				y: (e.rx / 1024).toFixed(2),
			})),
		},
	];
	const barChartData: BarDatum[] = preparedData.map(e => ({
		date: format(new Date(e.date), "MMM d"),
		Download: (e.rx / 1024).toFixed(2),
		Upload: (e.tx / 1024).toFixed(2),
	}));

	return {
		preparedData,
		lineChartData,
		barChartData,
		total: totalOf(preparedData),
	};
}

export {
	prepareMonthData,
	prepareCustomIntervalData,
	prepareDayData,
	prepareWeekData,
	prepareYearData,
};
