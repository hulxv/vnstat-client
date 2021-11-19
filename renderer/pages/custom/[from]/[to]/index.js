import DataDisplay from "../../../../components/DataDisplay";
import { useState, useEffect } from "react";
import useFilterDate from "../../../../hooks/useFilterDate";
import { format } from "date-fns";

import { useRouter } from "next/router";

import TotalTraffic from "../../../../components/TotalTraffic";

import { Button, Heading, Flex } from "@chakra-ui/react";
import { HiRefresh } from "react-icons/hi";

import { useUsage } from "../../../../context/dataUsage";

export default function CustomInterval() {
	const router = useRouter();
	const { month, reloading, dataIsReady } = useUsage();
	const [data, setData] = useState([]);

	useEffect(async () => {
		setData(month);
	}, [dataIsReady]);

	const FilteredData = useFilterDate(
		data,
		"custom",
		router.query.from,
		router.query.to,
	);

	const dataUsage = {
		down: FilteredData.reduce((a, b) => a + b.rx, 0),
		up: FilteredData.reduce((a, b) => a + b.tx, 0),
	};
	const lineChartData = [
		{
			id: "Upload",
			data: FilteredData.map((e) => ({
				x: format(new Date(e.date), "MMM d"),
				y: (e.tx / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: FilteredData.map((e) => ({
				x: format(new Date(e.date), "MMM d"),
				y: (e.rx / 1024).toFixed(2),
			})),
		},
	];
	const barChartData = FilteredData.map((e) => ({
		date: format(new Date(e.date), "MMM d"),
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
					<Heading>
						{format(new Date(router.query.from), "yyyy MMM dd")}
						{router.query.from !== router.query.to &&
							` - ${format(new Date(router.query.to), "yyyy MMM dd")}`}
					</Heading>
					<TotalTraffic data={dataUsage} />
					<DataDisplay
						data={FilteredData}
						lineChartData={lineChartData}
						barChartData={barChartData}
						barAxisBottomRotation={FilteredData.legnth > 15 ? 90 : 45}
						lineAxisBottomRotation={FilteredData.legnth > 15 ? 90 : 45}
					/>{" "}
				</>
			)}
		</>
	);
}
