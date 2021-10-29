import Chart from "../components/Chart";
import { useState } from "react";
import useFilterDate from "../hooks/useFilterDate";
import { Box, Flex, IconButton, Heading, Button } from "@chakra-ui/react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { GrPowerReset } from "react-icons/gr";

import { getDate, format, subMonths } from "date-fns";

export default function Month({ _data }) {
	const [previousMonths, setPreviousMonths] = useState(0);
	console.log(_data);
	const Data = useFilterDate(_data, "month", previousMonths);
	console.log(Data);
	const lineChartData = [
		{
			id: "Upload",
			data: Data.map((e) => ({
				x: getDate(new Date(e.date)),
				y: (e.tx / 1024 / 1024 / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: Data.map((e) => ({
				x: getDate(new Date(e.date)),
				y: (e.rx / 1024 / 1024 / 1024).toFixed(2),
			})),
		},
	];
	const barChartData = Data.map((e) => ({
		date: getDate(new Date(e.date)),
		Download: (e.rx / 1024 / 1024 / 1024).toFixed(2),
		Upload: (e.tx / 1024 / 1024 / 1024).toFixed(2),
	}));

	return (
		<>
			<Flex justify='space-around' w='full' mb={4}>
				<Box w='30px'>
					<IconButton
						variant='ghost'
						icon={<HiArrowLeft size='1.4em' />}
						onClick={() => setPreviousMonths(previousMonths + 1)}
					/>
				</Box>

				<Flex flexDir='column' alignItems='center'>
					<Heading>
						{format(subMonths(new Date(), previousMonths), "yyyy MMMM")}
					</Heading>
					<Button
						size='xs'
						variant='ghost'
						leftIcon={<GrPowerReset />}
						onClick={() => setPreviousMonths(0)}>
						Reset
					</Button>
				</Flex>
				<Box w='30px'>
					{previousMonths > 0 && (
						<IconButton
							variant='ghost'
							icon={<HiArrowRight size='1.4em' />}
							onClick={() => setPreviousMonths(previousMonths - 1)}
						/>
					)}
				</Box>
			</Flex>
			<Chart lineChartData={lineChartData} barChartData={barChartData} />
		</>
	);
}

export async function getStaticProps() {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/day`);
	const _data = await response.json();

	return {
		props: {
			_data,
		},
	};
}
