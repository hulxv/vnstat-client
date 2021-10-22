import Chart from "../components/Chart";
import useFilterDate from "../hooks/useFilterDate";

export default function Home({ _data }) {
	console.log(_data);
	const Data = useFilterDate(_data, "month");

	const lineChartData = [
		{
			id: "upload",
			data: Data.map((e) => ({
				x: parseInt(e.date.slice(-2)),
				y: (e.tx / 1024 / 1024 / 1024).toFixed(2),
			})),
		},
		{
			id: "download",
			data: Data.map((e) => ({
				x: parseInt(e.date.slice(-2)),
				y: (e.rx / 1024 / 1024 / 1024).toFixed(2),
			})),
		},
	];
	const barChartData = Data.map((e) => ({
		date: parseInt(e.date.slice(-2)),
		download: (e.rx / 1024 / 1024 / 1024).toFixed(2),
		upload: (e.tx / 1024 / 1024 / 1024).toFixed(2),
	}));

	return (
		<>
			<Chart
				lineChartData={lineChartData}
				barChartData={barChartData}
				title='Month'
			/>
		</>
	);
}

export async function getStaticProps() {
	const response = await fetch("http://localhost:12999/api/day");
	const _data = await response.json();

	return {
		props: {
			_data,
		},
	};
}
