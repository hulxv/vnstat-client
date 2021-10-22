import Chart from "../components/Chart";
import { useRouter } from "next/dist/client/router";
import useFilterDate from "../hooks/useFilterDate";

export default function Hour({ _data }) {
	const Hours = 24;

	const Data = useFilterDate(_data, "today");
	console.log("today", Data);
	const router = useRouter();

	const lineChartData = [
		{
			id: "upload",
			color: "hsl(227, 18%, 50%)",
			data: Data.map((e) => ({
				x: e.date.toString(),
				y: (e.tx / 1024 / 1024 / 1024).toFixed(2),
			})),
		},
		{
			id: "download",
			data: Data.filter((e) => e.interface === 2).map((e) => ({
				x: e.date.toString(),

				y: (e.rx / 1024 / 1024 / 1024).toFixed(2),
			})),
		},
	];
	const barChartData = Data.filter((e) => e.interface === 2).map((e) => ({
		date: parseInt(e.date.slice(-8).slice(0, 2)),
		download: (e.rx / 1024 / 1024 / 1024).toFixed(2),
		upload: (e.tx / 1024 / 1024 / 1024).toFixed(2),
	}));

	return (
		<>
			<Chart
				lineChartData={lineChartData}
				barChartData={barChartData}
				title={`Today`}
			/>
		</>
	);
}

export async function getStaticProps() {
	const response = await fetch("http://localhost:12999/api/hour");
	const _data = await response.json();

	return {
		props: {
			_data,
		},
	};
}
