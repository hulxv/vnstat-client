import { useEffect, useState } from "react";
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
	endOfMonth,
	subMonths,
	subYears,
} from "date-fns";
import { startOfYear } from "date-fns";

export default function useFilterDate(data, interval, ...args) {
	const [resultDates, setResultDates] = useState();

	const currentInterfaceData = data.filter((e) => e.interface === 2);
	// console.log(DataSetters[interval](currentInterfaceData));

	return DataSetters[interval](currentInterfaceData, ...args);
}

const DataSetters = {
	today: (Data, ...args) => getTodayData(Data, ...args),

	month: (Data, ...args) => getMonthData(Data, ...args),

	year: (Data, ...args) => getYearData(Data, ...args),
};

function getMonthData(Data, amountMonths = 0) {
	const DaysInCurrentMonth = eachDayOfInterval({
		start: startOfMonth(subMonths(new Date(), amountMonths)),
		end: lastDayOfMonth(subMonths(new Date(), amountMonths)),
	}).map((date) => format(new Date(date), "yyyy-MM-dd"));

	const DefaultData = DaysInCurrentMonth.map((day) => ({
		date: day,
		rx: 0,
		tx: 0,
	}));

	return DefaultData.map(
		(day) =>
			Data.find(
				(data) => format(new Date(data.date), "yyyy-MM-dd") === day.date,
			) || day,
	);
}

function getTodayData(Data, amountDays = 0) {
	const HoursInDay = eachHourOfInterval({
		start: startOfDay(subDays(new Date(), amountDays)),
		end: endOfDay(subDays(new Date(), amountDays)),
	}).map((date) => format(new Date(date), "yyyy-MM-dd HH:mm:ss"));

	const DefaultData = HoursInDay.map((hour) => ({
		date: hour,
		rx: 0,
		tx: 0,
	}));

	return DefaultData.map(
		(day) => Data.find((data) => data.date === day.date) || day,
	);
}

function getYearData(Data, amountYears = 0) {
	const MonthsInYear = eachMonthOfInterval({
		start: startOfYear(subYears(new Date(), amountYears)),
		end: new Date(),
	}).map((date) => format(new Date(date), "yyyy-MM-dd"));

	const DefaultData = MonthsInYear.map((month) => ({
		date: month,
		rx: 0,
		tx: 0,
	}));
	return DefaultData.map(
		(day) =>
			Data.find(
				(data) => data.date.substring(0, 13) === day.date.substring(0, 13),
			) || day,
	);
}
