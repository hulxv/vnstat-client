import { useState, type ReactElement, type ReactNode } from "react";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import Table, { type TableRow } from "./Table";
import ErrorBoundary from "../ErrorBoundary";

import { IconButton, Tooltip, HStack, Stack } from "@chakra-ui/react";

import { BiLineChart, BiBarChart, BiTable } from "react-icons/bi";

import { useConfig } from "../../context/configuration";
import { useHotkeys } from "react-hotkeys-hook";
import type { BarDatum, LineSeries } from "@Util/PrepareDataToDisplay";

type DisplayStyle = "line chart" | "bar chart" | "table";

interface ChartProps {
	lineChartData: LineSeries[];
	barChartData: BarDatum[];
	data: TableRow[];
	lineAxisBottomRotation?: number;
	barAxisBottomRotation?: number;
}

const Chart = ({
	lineChartData,
	barChartData,
	data,
	lineAxisBottomRotation = 0,
	barAxisBottomRotation = 0,
}: ChartProps) => {
	const [style, setStyle] = useState<DisplayStyle>("bar chart");
	const { config } = useConfig();

	const DisplayStyles: Record<
		DisplayStyle,
		{ render: ReactNode; icon: ReactElement }
	> = {
		"line chart": {
			render: (
				<LineChart
					data={lineChartData}
					axisBottomRotation={lineAxisBottomRotation}
					LeftLegend='Usage (GB)'
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
	useHotkeys("ctrl+b", () => setStyle("bar chart"));
	useHotkeys("ctrl+l", () => setStyle("line chart"));
	useHotkeys("ctrl+t", () => setStyle("table"));

	return (
		<Stack minH={600} h='full' w='full'>
			<HStack alignSelf='end' spacing={2} mr={1}>
				{(Object.keys(DisplayStyles) as DisplayStyle[]).map((__style__, index) => (
					<Tooltip key={index} textTransform='capitalize' label={__style__}>
						<IconButton
							aria-label={__style__}
							colorScheme={
								__style__ === style
									? config?.appearance?.globalTheme ?? "green"
									: "gray"
							}
							icon={DisplayStyles[__style__].icon}
							onClick={() => setStyle(__style__)}
						/>
					</Tooltip>
				))}
			</HStack>
			<ErrorBoundary label={style}>
				{DisplayStyles[style].render}
			</ErrorBoundary>
		</Stack>
	);
};

export default Chart;
