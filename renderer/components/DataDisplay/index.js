import { useState } from "react";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import Table from "./Table";

import { IconButton, Tooltip, Flex } from "@chakra-ui/react";

import { BiLineChart, BiBarChart, BiTable } from "react-icons/bi";

import { useConfig } from "../../context/configration";

const Chart = ({
	lineChartData,
	barChartData,
	data,
	lineAxisBottomRotation = 0,
	barAxisBottomRotation = 0,
}) => {
	const [chart, setChart] = useState("bar");

	const { config } = useConfig();
	return (
		<>
			<Flex alignSelf='end' mr={4}>
				<Tooltip label='Bar Chart'>
					<IconButton
						colorScheme={config?.apperance?.globalTheme ?? "green"}
						icon={<BiBarChart size='1.4em' />}
						onClick={() => setChart("bar")}
					/>
				</Tooltip>
				<Tooltip label='Line Chart'>
					<IconButton
						colorScheme={config?.apperance?.globalTheme ?? "green"}
						icon={<BiLineChart size='1.4em' />}
						onClick={() => setChart("line")}
						ml={1}
					/>
				</Tooltip>{" "}
				<Tooltip label='Table'>
					<IconButton
						colorScheme={config?.apperance?.globalTheme ?? "green"}
						icon={<BiTable size='1.4em' />}
						onClick={() => setChart("table")}
						ml={1}
					/>
				</Tooltip>
			</Flex>
			{chart === "bar" ? (
				<BarChart
					data={barChartData}
					axisBottomRotation={barAxisBottomRotation}
				/>
			) : chart === "line" ? (
				<LineChart
					data={lineChartData}
					axisBottomRotation={lineAxisBottomRotation}
				/>
			) : chart === "table" ? (
				<Table data={data} />
			) : (
				<div>Choose a Display Style</div>
			)}
		</>
	);
};

export default Chart;
