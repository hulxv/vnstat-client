import { getMonth, getDate, getHours } from "date-fns";
import Chart from "../components/Chart";
import { useState } from "react";
import useFilterDate from "../hooks/useFilterDate";
import SwitchBar from "../components/SwitchBar";
import { useRouter } from "next/router";
export default function Year({ data }) {
	const [PreviousYears, setPreviousYears] = useState(0);
	const { query } = useRouter();

	const Data = useFilterDate(data, query.interval, PreviousYears);

	const intervals = {
		day: {
			x: (date) => getDate(new Date(date)),
			titleFormat: "yyyy MMMM",
		},
		month: {
			x: (date) => getMonth(new Date(date)) + 1,
			titleFormat: "yyyy",
		},
		hour: {
			x: (date) => getHours(new Date(date)),
			titleFormat: "MMM dd",
		},
	};
	const lineChartData = [
		{
			id: "Upload",
			data: Data.map((e) => ({
				x: intervals[query.interval].x(e.date),
				y: (e.tx / 1024 / 1024 / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: Data.map((e) => ({
				x: intervals[query.interval].x(e.date),
				y: (e.rx / 1024 / 1024 / 1024).toFixed(2),
			})),
		},
	];
	const barChartData = Data.map((e) => ({
		date: intervals[query.interval].x(e.date),
		Download: (e.rx / 1024 / 1024 / 1024).toFixed(2),
		Upload: (e.tx / 1024 / 1024 / 1024).toFixed(2),
	}));

	return (
		<>
			<SwitchBar
				state={PreviousYears}
				setState={setPreviousYears}
				dateFormat={intervals[query.interval].titleFormat}
				interval={query.interval}
			/>

			<Chart lineChartData={lineChartData} barChartData={barChartData} />
		</>
	);
}

export async function getServerSideProps({ query }) {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/${query.interval}`,
		);
		const data = await response.json();

		if (["month", "day", "hour"].indexOf(query.interval) < 0) {
			return {
				notFound: true,
			};
		}
		return {
			props: {
				data,
			},
		};
	} catch (err) {
		return { notFound: true };
	}
}
