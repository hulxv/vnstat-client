import router from "next/router";
import { useUsage } from "../context/dataUsage";

import { getMonth } from "date-fns";
import DataDisplay from "../components/DataDisplay";
import { useState, useEffect } from "react";
import useFilterDate from "../hooks/useFilterDate";

import SwitchBar from "../components/SwitchBar";
import { Button, Heading, Flex } from "@chakra-ui/react";
import { HiRefresh } from "react-icons/hi";

export default function Year() {
	const { year, reloading, dataIsReady } = useUsage();

	const [PreviousYears, setPreviousYears] = useState(0);
	const [data, setData] = useState([]);

	useEffect(() => {
		setData(year);
	}, [dataIsReady]);

	const FilteredData = useFilterDate(data, "year", PreviousYears);
	const dataUsage = FilteredData.reduce((a, b) => a + (b.tx + b.rx), 0);

	const lineChartData = [
		{
			id: "Upload",
			data: FilteredData.map((e) => ({
				x: getMonth(new Date(e.date)) + 1,
				y: (e.tx / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: FilteredData.map((e) => ({
				x: getMonth(new Date(e.date)) + 1,
				y: (e.rx / 1024).toFixed(2),
			})),
		},
	];
	const barChartData = FilteredData.map((e) => ({
		date: getMonth(new Date(e.date)) + 1,
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
						state={PreviousYears}
						setState={setPreviousYears}
						dateFormat='yyyy'
						interval='year'
					/>
					<Heading fontWeight='thin'>
						{`${(dataUsage < 1024 ? dataUsage : dataUsage / 1024).toFixed(2)} ${
							dataUsage > 1024 ? "GB" : "MB"
						}`}
					</Heading>
					<DataDisplay
						data={FilteredData}
						lineChartData={lineChartData}
						barChartData={barChartData}
					/>{" "}
				</>
			)}
		</>
	);
}
