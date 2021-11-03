import electron from "electron";

import { useEffect, useState } from "react";
import Chart from "../components/Chart";
import useFilterDate from "../hooks/useFilterDate";

import { getHours } from "date-fns";

import SwitchBar from "../components/SwitchBar";
import { Button, Heading, Flex } from "@chakra-ui/react";
import { HiRefresh } from "react-icons/hi";
export default function Hour() {
	const [previousDays, setPreviousDays] = useState(0);
	const [data, setData] = useState([]);

	useEffect(() => {
		electron.ipcRenderer.send("getDayData");
		electron.ipcRenderer.on("dayData", (evt, result) => {
			setData(result);
		});
	}, []);
	const FilteredData = useFilterDate(data, "day", previousDays);
	const dataUsage = FilteredData.reduce((a, b) => a + (b.tx + b.rx), 0);

	const lineChartData = [
		{
			id: "Upload",
			color: "hsl(227, 18%, 50%)",
			data: FilteredData.map((e) => ({
				x: getHours(new Date(e.date)) + 1,
				y: e.tx.toFixed(2),
			})),
		},
		{
			id: "Download",
			data: FilteredData.map((e) => ({
				x: getHours(new Date(e.date)) + 1,

				y: e.rx.toFixed(2),
			})),
		},
	];
	const barChartData = FilteredData.map((e) => ({
		date: getHours(new Date(e.date)) + 1,
		Download: e.rx.toFixed(2),
		Upload: e.tx.toFixed(2),
	}));

	return (
		<>
			{data.length <= 0 ? (
				<Flex flexDir='column'>
					<Heading m='4'>No Data is Found</Heading>
					<Button
						leftIcon={<HiRefresh size='1.4em' />}
						mr={1}
						onClick={() => router.replace(router.asPath)}>
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
					<Heading fontWeight='thin'>
						{`${(dataUsage < 1024 ? dataUsage : dataUsage / 1024).toFixed(2)} ${
							dataUsage > 1024 ? "GB" : "MB"
						}`}
					</Heading>
					<Chart lineChartData={lineChartData} barChartData={barChartData} />
				</>
			)}
		</>
	);
}
