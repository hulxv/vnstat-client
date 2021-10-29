import { getMonth, format, subYears } from "date-fns";
import Chart from "../components/Chart";
import { useState } from "react";
import { Flex, IconButton, Heading, Box, Button } from "@chakra-ui/react";
import useFilterDate from "../hooks/useFilterDate";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { GrPowerReset } from "react-icons/gr";
export default function Year({ _data }) {
	const [PreviousYears, setPreviousYears] = useState(0);

	const Data = useFilterDate(_data, "year", PreviousYears);

	const lineChartData = [
		{
			id: "Upload",
			data: Data.map((e) => ({
				x: getMonth(new Date(e.date)) + 1,
				y: (e.tx / 1024 / 1024 / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: Data.map((e) => ({
				x: getMonth(new Date(e.date)) + 1,
				y: (e.rx / 1024 / 1024 / 1024).toFixed(2),
			})),
		},
	];
	const barChartData = Data.map((e) => ({
		date: getMonth(new Date(e.date)) + 1,
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
						onClick={() => setPreviousYears(PreviousYears + 1)}
					/>
				</Box>
				<Flex flexDir='column' alignItems='center'>
					<Heading>
						{format(subYears(new Date(), PreviousYears), "yyyy")}
					</Heading>
					<Button
						size='xs'
						variant='ghost'
						leftIcon={<GrPowerReset />}
						onClick={() => setPreviousYears(0)}>
						Reset
					</Button>
				</Flex>
				<Box w='30px'>
					{PreviousYears > 0 && (
						<IconButton
							variant='ghost'
							icon={<HiArrowRight size='1.4em' />}
							onClick={() => setPreviousYears(PreviousYears - 1)}
						/>
					)}
				</Box>
			</Flex>
			<Chart lineChartData={lineChartData} barChartData={barChartData} />
		</>
	);
}

export async function getStaticProps() {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/month`);
	const _data = await response.json();

	return {
		props: {
			_data,
		},
	};
}
