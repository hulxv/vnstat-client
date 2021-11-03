import Chart from "../components/Chart";
import { useState, useEffect } from "react";
import useFilterDate from "../hooks/useFilterDate";
import { getDate } from "date-fns";

import { ipcRenderer } from "electron";
import { useRouter } from "next/router";

import SwitchBar from "../components/SwitchBar";
import { Button, Heading, Flex } from "@chakra-ui/react";
import { HiRefresh } from "react-icons/hi";

export default function Month() {
	const router = useRouter();

	const [previousMonths, setPreviousMonths] = useState(0);
	const [data, setData] = useState([]);

	useEffect(() => {
		ipcRenderer.send("getMonthData");
		ipcRenderer.on("monthData", (evt, result) => setData(result));

		// Cleaning
		return () => {
			ipcRenderer.removeAllListeners("monthData", "getMonthData");
		};
	}, []);

	const FilteredData = useFilterDate(data, "month", previousMonths);
	const dataUsage = FilteredData.reduce((a, b) => a + (b.tx + b.rx), 0);

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
						onClick={() => router.replace(router.asPath)}>
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
					<Heading fontWeight='thin'>
						{`${(dataUsage < 1024 ? dataUsage : dataUsage / 1024).toFixed(2)} ${
							dataUsage > 1024 ? "GB" : "MB"
						}`}
					</Heading>
					<Chart lineChartData={lineChartData} barChartData={barChartData} />{" "}
				</>
			)}
		</>
	);
}
