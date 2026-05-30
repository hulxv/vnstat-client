import { ResponsiveBar, type BarDatum as NivoBarDatum } from "@nivo/bar";

import { useConfig } from "@Context/configuration";
import type { BarDatum } from "@Util/PrepareDataToDisplay";

interface BarChartProps {
	data: BarDatum[];
	axisBottomRotation?: number;
}

export default function BarChart({
	data,
	axisBottomRotation = 0,
}: BarChartProps) {
	const { config } = useConfig();

	return (
		<>
			<ResponsiveBar
				data={data as unknown as NivoBarDatum[]}
				keys={["Download", "Upload"]}
				indexBy='date'
				margin={{ top: 50, right: 110, bottom: 50, left: 50 }}
				groupMode={
					config?.appearance?.barChart?.isGrouped ? "grouped" : "stacked"
				}
				valueScale={{ type: "linear" }}
				indexScale={{ type: "band", round: true }}
				// nivo's `scheme` is a strict union; the value comes from runtime
				// user config, so cast at this third-party boundary.
				colors={
					{
						scheme: config?.appearance?.barChart?.colors ?? "nivo",
					} as never
				}
				layout={
					(config?.appearance?.barChart?.layout ?? "vertical") as
						| "horizontal"
						| "vertical"
				}
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
					legend:
						config?.appearance?.barChart?.layout === "horizontal"
							? "Usage (GB)"
							: "Date / Time",
					legendPosition: "middle",
					legendOffset: 32,
				}}
				axisLeft={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
					legend:
						config?.appearance?.barChart?.layout === "horizontal"
							? "Date / Time"
							: "Usage (GB)",
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
				ariaLabel='Usage Bar Chart'
			/>
		</>
	);
}
