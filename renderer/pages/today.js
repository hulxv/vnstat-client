import router from "next/router";
import { useUsage } from "../context/dataUsage";

import { useEffect, useState } from "react";
import DataDisplay from "../components/DataDisplay";
import useFilterDate from "../hooks/useFilterDate";

import SwitchBar from "../components/SwitchBar";
import TotalTraffic from "../components/TotalTraffic";

import { Button, Heading, Flex } from "@chakra-ui/react";
import { HiRefresh } from "react-icons/hi";
import { format } from "date-fns";
export default function Hour() {
	const { day, reloading, dataIsReady } = useUsage();
	const [previousDays, setPreviousDays] = useState(0);
	const [data, setData] = useState([]);

	useEffect(() => {
		setData(day);
	}, [dataIsReady]);
	const FilteredData = useFilterDate(data, "day", previousDays);
	const dataUsage = {
		down: FilteredData.reduce((a, b) => a + b.rx, 0),
		up: FilteredData.reduce((a, b) => a + b.tx, 0),
	};
	const lineChartData = [
		{
			id: "Upload",
			color: "hsl(227, 18%, 50%)",
			data: FilteredData.map((e) => ({
				x: format(new Date(e.date), "haaa"),
				y: (e.tx / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: FilteredData.map((e) => ({
				x: format(new Date(e.date), "haaa"),

				y: (e.rx / 1024).toFixed(2),
			})),
		},
	];

	const barChartData = FilteredData.map((e) => ({
		date: format(new Date(e.date), "haaa"),
		Download: (e.rx / 1024).toFixed(2),
		Upload: (e.tx / 1024).toFixed(2),
	}));

	return (
		<>
			{data.length <= 0 ? (
				<Flex flexDir='column'>
					<Heading m='4'>No Data is Found</Heading>
					<Button
						leftIcon={<HiRefresh size='1.4em' />}
						mr={1}
						onClick={() => {
							reloading();
							router.replace(router.asPath);
						}}>
						Refresh
					</Button>
				</Flex>
			) : (
				<>
					<SwitchBar
						state={previousDays}
						setState={setPreviousDays}
						dateFormat='MMM dd'
						interval='day'
					/>
					<TotalTraffic data={dataUsage} />

					<DataDisplay
						data={FilteredData}
						lineChartData={lineChartData}
						barChartData={barChartData}
					/>
				</>
			)}
		</>
	);
}
