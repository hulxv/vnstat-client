import Chart from "../components/Chart";
import { useState, useEffect } from "react";
import useFilterDate from "../hooks/useFilterDate";
import { getDate } from "date-fns";

import electron from "electron";
import { useRouter } from "next/router";

import SwitchBar from "../components/SwitchBar";
import { Button, Heading, Flex } from "@chakra-ui/react";
import { HiRefresh } from "react-icons/hi";

export default function Month() {
	const router = useRouter();

	const [previousMonths, setPreviousMonths] = useState(0);
	const [data, setData] = useState([]);

	useEffect(async () => {
		if (electron.ipcRenderer) {
			electron.ipcRenderer.send("getMonthData");
			electron.ipcRenderer.on("monthData", (evt, result) => {
				setData(result);
			});
		}
	}, []);

	const FilteredData = useFilterDate(data, "month", previousMonths);

	const lineChartData = [
		{
			id: "Upload",
			data: FilteredData.map((e) => ({
				x: getDate(new Date(e.date)),
				y: (e.tx / 1024 / 1024 / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: FilteredData.map((e) => ({
				x: getDate(new Date(e.date)),
				y: (e.rx / 1024 / 1024 / 1024).toFixed(2),
			})),
		},
	];
	const barChartData = FilteredData.map((e) => ({
		date: getDate(new Date(e.date)),
		Download: (e.rx / 1024 / 1024 / 1024).toFixed(2),
		Upload: (e.tx / 1024 / 1024 / 1024).toFixed(2),
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
					<Chart lineChartData={lineChartData} barChartData={barChartData} />{" "}
				</>
			)}
		</>
	);
}

// export async function getStaticProps() {
// 	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/day`);
// 	console.log(response);
// 	const data = await response.json();

// 	return {
// 		props: {
// 			data,
// 		},
// 	};
// }
