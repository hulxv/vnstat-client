import DataDisplay from "../components/DataDisplay";
import { useState, useEffect } from "react";
import useFilterDate from "../hooks/useFilterDate";
import { getDate } from "date-fns";

import router from "next/router";

// Components
import SwitchBar from "../components/SwitchBar";
import TotalTraffic from "../components/TotalTraffic";

import { Button, Heading, Flex } from "@chakra-ui/react";
import { HiRefresh } from "react-icons/hi";

import { useUsage } from "../context/dataUsage";

export default function Month() {
	const [previousMonths, setPreviousMonths] = useState(0);
	const [data, setData] = useState([]);

	const { month, reloading, dataIsReady } = useUsage();

	useEffect(async () => {
		setData(month);
	}, [dataIsReady]);

	const FilteredData = useFilterDate(data, "month", previousMonths);
	const dataUsage = {
		down: FilteredData.reduce((a, b) => a + b.rx, 0),
		up: FilteredData.reduce((a, b) => a + b.tx, 0),
	};

	const lineChartData = [
		{
			id: "Upload",
			data: FilteredData.map((e) => ({
				x: getDate(new Date(e.date)),
				y: (e.tx / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: FilteredData.map((e) => ({
				x: getDate(new Date(e.date)),
				y: (e.rx / 1024).toFixed(2),
			})),
		},
	];
	const barChartData = FilteredData.map((e) => ({
		date: getDate(new Date(e.date)),
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
					{" "}
					<SwitchBar
						state={previousMonths}
						setState={setPreviousMonths}
						dateFormat='yyyy MMMM'
						interval='month'
					/>
					<TotalTraffic data={dataUsage} />
					<DataDisplay
						lineChartData={lineChartData}
						barChartData={barChartData}
						data={FilteredData}
					/>{" "}
				</>
			)}
		</>
	);
}
