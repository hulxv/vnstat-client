import { useState } from "react";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import Table from "./Table";

import { IconButton, Tooltip, HStack } from "@chakra-ui/react";

import { BiLineChart, BiBarChart, BiTable } from "react-icons/bi";

import { useConfig } from "../../context/configration";
import { useHotkeys } from "react-hotkeys-hook";
const Chart = ({
	lineChartData,
	barChartData,
	data,
	lineAxisBottomRotation = 0,
	barAxisBottomRotation = 0,
}) => {
	const [style, setStyle] = useState("bar chart");
	const { config } = useConfig();

	const DisplayStyles = {
		"line chart": {
			render: (
				<LineChart
					data={lineChartData}
					axisBottomRotation={lineAxisBottomRotation}
				/>
			),
			icon: <BiLineChart size='1.4em' />,
		},

		"bar chart": {
			render: (
				<BarChart
					data={barChartData}
					axisBottomRotation={barAxisBottomRotation}
				/>
			),
			icon: <BiBarChart size='1.4em' />,
		},

		table: { render: <Table data={data} />, icon: <BiTable size='1.4em' /> },
	};

	// Shortcuts
	useHotkeys("shift+b", () => setStyle("bar chart"));
	useHotkeys("shift+l", () => setStyle("line chart"));
	useHotkeys("shift+t", () => setStyle("table"));

	return (
		<>
			<HStack alignSelf='end' spacing={2} mr={1}>
				{Object.keys(DisplayStyles).map((__style__) => (
					<Tooltip textTransform='capitalize' label={__style__}>
						<IconButton
							colorScheme={
								__style__ === style
									? config?.apperance?.globalTheme ?? "green"
									: "gray"
							}
							icon={DisplayStyles[__style__].icon}
							onClick={() => setStyle(__style__)}
						/>
					</Tooltip>
				))}
			</HStack>
			{DisplayStyles[style].render}
		</>
	);
};

export default Chart;
