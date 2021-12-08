// yarn add @nivo/core @nivo/line
import { ResponsiveBar } from "@nivo/bar";

import { useConfig } from "../../context/configration";

export default function BarChart({ data, axisBottomRotation = 0 }) {
	const { config } = useConfig();

	return (
		<>
			<ResponsiveBar
				data={data}
				keys={["Download", "Upload"]}
				indexBy='date'
				margin={{ top: 50, right: 110, bottom: 50, left: 50 }}
				groupMode={config.apperance.barChart.isGrouped ? "grouped" : "stacked"}
				valueScale={{ type: "linear" }}
				indexScale={{ type: "band", round: true }}
				colors={{ scheme: config.apperance.barChart.colors }}
				defs={[
					{
						id: "dots",
						type: "patternDots",
						background: "inherit",
						color: "#38bcb2",
						size: 4,
						padding: 1,
						stagger: true,
					},
					{
						id: "lines",
						type: "patternLines",
						background: "inherit",
						color: "#eed312",
						rotation: -45,
						lineWidth: 6,
						spacing: 10,
					},
				]}
				borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
				axisTop={null}
				axisRight={null}
				padding={0.2}
				axisBottom={{
					tickSize: 1,
					tickPadding: 5,
					tickRotation: axisBottomRotation,
					legend: "Date",
					legendPosition: "middle",
					legendOffset: 32,
				}}
				axisLeft={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend: "Usage (GB)",
					legendPosition: "middle",
					legendOffset: -40,
				}}
				enableGridX={true}
				labelSkipWidth={12}
				labelSkipHeight={12}
				labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
				legends={[
					{
						dataFrom: "keys",
						anchor: "top-right",
						direction: "column",
						justify: false,
						translateX: 120,
						translateY: 0,
						itemsSpacing: 2,
						itemWidth: 100,
						itemHeight: 20,
						itemDirection: "left-to-right",
						itemOpacity: 1,
						symbolSize: 20,
						effects: [
							{
								on: "hover",
								style: {
									itemOpacity: 1,
								},
							},
						],
					},
				]}
				role='application'
				ariaLabel='Usage Bar Chart'
			/>
		</>
	);
}
