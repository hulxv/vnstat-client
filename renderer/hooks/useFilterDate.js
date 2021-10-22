import { useEffect, useState } from "react";
import {
	lastDayOfMonth,
	startOfMonth,
	eachDayOfInterval,
	eachHourOfInterval,
	startOfDay,
	format,
} from "date-fns";
export default function useFilterDate(data, interval) {
	const [resultDates, setResultDates] = useState();
	const currentDate = new Date().toISOString().substring(0, 10);

	const currentInterfaceData = data.filter((e) => e.interface === 2);
	console.log(DataSetters[interval](currentInterfaceData));
	return DataSetters[interval](currentInterfaceData);
}

const DataSetters = {
	today: (Data) => getTodayData(Data),

	month: (Data) => getMonthData(Data),

	year: (Data) => {},
};

function getMonthData(Data) {
	const DaysInCurrentMonth = eachDayOfInterval({
		start: startOfMonth(new Date()),
		end: lastDayOfMonth(new Date()),
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

function getTodayData(Data) {
	const HoursInToday = eachHourOfInterval({
		start: startOfDay(new Date()),
		end: new Date(),
	}).map((date) => format(new Date(date), "yyyy-MM-dd HH:mm:ss"));

	const DefaultData = HoursInToday.map((day) => ({
		date: day,
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
