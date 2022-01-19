// yarn add @nivo/core @nivo/line
import { ResponsiveLine } from "@nivo/line";
import { useConfig } from "@Context/configuration";

export default function LineChart({
	data,
	axisBottomRotation = 0,
	BottomLegend,
	LeftLegend,
	disableAxisBottom,
	disableAnimate,
}) {
	const { config } = useConfig();

	return (
		<ResponsiveLine
			data={data}
			margin={{ top: 50, right: 110, bottom: 50, left: 50 }}
			xScale={{ type: "point" }}
			yScale={{
				type: "linear",
				min: "auto",
				max: "auto",
				stacked: true,
				reverse: false,
			}}
			yFormat=' >-.2f'
			curve={config?.appearance?.lineChart?.curve}
			axisTop={null}
			axisRight={null}
			axisBottom={
				disableAxisBottom
					? false
					: {
							orient: "bottom",
							tickSize: 5,
							tickPadding: 10,
							tickRotation: axisBottomRotation,
							legend: BottomLegend,
							legendOffset: 36,
							legendPosition: "middle",
					  }
			}
			axisLeft={{
				orient: "left",
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: LeftLegend,
				legendOffset: -40,
				legendPosition: "middle",
			}}
			colors={{ scheme: config?.appearance?.lineChart?.colors ?? "nivo" }}
			lineWidth={5}
			pointSize={10}
			pointColor={{ theme: "background" }}
			pointBorderWidth={2}
			pointBorderColor={{ from: "seriesColor" }}
			pointLabelYOffset={-12}
			useMesh={true}
			enableArea={config?.appearance?.lineChart?.hasArea ?? true}
			areaOpacity={config?.appearance?.lineChart?.areaOpacity ?? 0.5}
			enableSlices='x'
			legends={[
				{
					anchor: "top-right",
					direction: "column",
					justify: false,
					translateX: 100,
					translateY: 0,
					itemsSpacing: 0,
					itemDirection: "left-to-right",
					itemWidth: 80,
					itemHeight: 20,
					itemsSpacing: 2,
					itemOpacity: 1,
					symbolSize: 20,
					symbolShape: "square",
					symbolBorderColor: "rgba(0, 0, 0, .5)",
					effects: [
						{
							on: "hover",
							style: {
								itemBackground: "rgba(0, 0, 0, .03)",
								itemOpacity: 1,
							},
						},
					],
				},
			]}
			animate={!disableAnimate}
			motionConfig='slow'
		/>
	);
}
