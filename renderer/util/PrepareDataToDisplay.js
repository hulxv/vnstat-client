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
	getMonth,
} from "date-fns";

function prepareMonthData(Data, amountMonths = 0) {
	// console.log("Data before prepareing ", Data);
	let DaysInCurrentMonth = eachDayOfInterval({
		start: startOfMonth(subMonths(new Date(), amountMonths)),
		end: lastDayOfMonth(subMonths(new Date(), amountMonths)),
	}).map((date) => format(new Date(date), "yyyy-MM-dd"));

	let DefaultData = DaysInCurrentMonth.map((day) => ({
		date: day,
		rx: 0,
		tx: 0,
	}));

	let dataAfterFiltering = DefaultData.map(
		(day) => Data.find((data) => data.date === day.date) || day,
	);

	let preparedData = dataAfterFiltering.map((data) => ({
		...data,
		rx: data.rx / 1024 / 1024,
		tx: data.tx / 1024 / 1024,
	}));

	let lineChartData = [
		{
			id: "Upload",
			data: preparedData.map((e) => ({
				x: getDate(new Date(e.date)),
				y: (e.tx / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: preparedData.map((e) => ({
				x: getDate(new Date(e.date)),
				y: (e.rx / 1024).toFixed(2),
			})),
		},
	];
	let barChartData = preparedData.map((e) => ({
		date: getDate(new Date(e.date)),
		Download: (e.rx / 1024).toFixed(2),
		Upload: (e.tx / 1024).toFixed(2),
	}));
	let total = {
		down: preparedData?.reduce((a, b) => a + b.rx, 0),
		up: preparedData?.reduce((a, b) => a + b.tx, 0),
	};

	return { preparedData, lineChartData, barChartData, total };
}

function prepareDayData(Data, amountDays = 0) {
	let HoursInDay = eachHourOfInterval({
		start: startOfDay(subDays(new Date(), amountDays)),
		end: endOfDay(subDays(new Date(), amountDays)),
	}).map((date) => format(new Date(date), "yyyy-MM-dd HH:mm:ss"));

	let DefaultData = HoursInDay.map((hour) => ({
		date: hour,
		rx: 0,
		tx: 0,
	}));

	let dataAfterFiltering = DefaultData.map(
		(day) => Data.find((data) => data.date === day.date) || day,
	);

	let preparedData = dataAfterFiltering.map((data) => ({
		...data,
		rx: data.rx / 1024 / 1024,
		tx: data.tx / 1024 / 1024,
	}));

	let total = {
		down: preparedData.reduce((a, b) => a + b.rx, 0),
		up: preparedData.reduce((a, b) => a + b.tx, 0),
	};
	let lineChartData = [
		{
			id: "Upload",
			color: "hsl(227, 18%, 50%)",
			data: preparedData.map((e) => ({
				x: format(new Date(e.date), "haaa"),
				y: (e.tx / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: preparedData.map((e) => ({
				x: format(new Date(e.date), "haaa"),

				y: (e.rx / 1024).toFixed(2),
			})),
		},
	];

	let barChartData = preparedData.map((e) => ({
		date: format(new Date(e.date), "haaa"),
		Download: (e.rx / 1024).toFixed(2),
		Upload: (e.tx / 1024).toFixed(2),
	}));

	return { preparedData, lineChartData, barChartData, total };
}

function prepareYearData(Data, amountYears = 0) {
	let MonthsInYear = eachMonthOfInterval({
		start: startOfYear(subYears(new Date(), amountYears)),
		end: endOfYear(subYears(new Date(), amountYears)),
	}).map((date) => format(new Date(date), "yyyy-MM-dd"));

	let DefaultData = MonthsInYear.map((month) => ({
		date: month,
		rx: 0,
		tx: 0,
	}));

	let dataAfterFiltering = DefaultData.map(
		(day) => Data.find((data) => data.date === day.date) || day,
	);

	let preparedData = dataAfterFiltering.map((data) => ({
		...data,
		rx: data.rx / 1024 / 1024,
		tx: data.tx / 1024 / 1024,
	}));

	let lineChartData = [
		{
			id: "Upload",
			data: preparedData.map((e) => ({
				x: getMonth(new Date(e.date)) + 1,
				y: (e.tx / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: preparedData.map((e) => ({
				x: getMonth(new Date(e.date)) + 1,
				y: (e.rx / 1024).toFixed(2),
			})),
		},
	];

	let barChartData = preparedData.map((e) => ({
		date: getMonth(new Date(e.date)) + 1,
		Download: (e.rx / 1024).toFixed(2),
		Upload: (e.tx / 1024).toFixed(2),
	}));

	let total = {
		down: preparedData?.reduce((a, b) => a + b.rx, 0),
		up: preparedData?.reduce((a, b) => a + b.tx, 0),
	};

	return { preparedData, lineChartData, barChartData, total };
}

function prepareCustomIntervalData(
	Data,
	from = `${getYear(new Date())}-1-1`,
	to = `${getYear(new Date())}-1-1`,
) {
	let DaysInInterval = eachDayOfInterval({
		start: new Date(from),
		end: new Date(to),
	}).map((date) => format(new Date(date), "yyyy-MM-dd"));

	let DefaultData = DaysInInterval.map((day) => ({
		date: day,
		rx: 0,
		tx: 0,
	}));

	let dataAfterFiltering = DefaultData.map(
		(day) => Data.find((data) => data.date === day.date) || day,
	);

	let preparedData = dataAfterFiltering.map((data) => ({
		...data,
		rx: data.rx / 1024 / 1024,
		tx: data.tx / 1024 / 1024,
	}));

	let total = {
		down: preparedData.reduce((a, b) => a + b.rx, 0),
		up: preparedData.reduce((a, b) => a + b.tx, 0),
	};
	let lineChartData = [
		{
			id: "Upload",
			data: preparedData.map((e) => ({
				x: format(new Date(e.date), "MMM d"),
				y: (e.tx / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: preparedData.map((e) => ({
				x: format(new Date(e.date), "MMM d"),
				y: (e.rx / 1024).toFixed(2),
			})),
		},
	];
	let barChartData = preparedData.map((e) => ({
		date: format(new Date(e.date), "MMM d"),
		Download: (e.rx / 1024).toFixed(2),
		Upload: (e.tx / 1024).toFixed(2),
	}));

	return { preparedData, lineChartData, barChartData, total };
}

export {
	prepareMonthData,
	prepareCustomIntervalData,
	prepareDayData,
	prepareYearData,
};
