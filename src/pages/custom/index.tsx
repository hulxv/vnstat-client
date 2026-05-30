import { format, differenceInDays } from "date-fns";
// Utilities
import {
	prepareCustomIntervalData,
	type PreparedResult,
} from "@Util/PrepareDataToDisplay";
// Hooks
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVnStat } from "@Context/vnstat";

// Components
import DataDisplay from "@Components/DataDisplay";
import TotalTraffic from "@Components/TotalTraffic";
import SwitchBar from "@Components/SwitchBar";
import NotFound from "@Pages/NotFound";
import { Box } from "@chakra-ui/react";

export default function CustomInterval() {
	const { from, to } = useParams();
	const { traffic } = useVnStat();
	const [displayData, setDisplayData] = useState<PreparedResult | null>(null);

	useEffect(() => {
		let { preparedData, lineChartData, barChartData, total } =
			prepareCustomIntervalData(traffic?.month, from, to);
		setDisplayData({ preparedData, lineChartData, barChartData, total });
	}, [traffic]);

	// const FilteredData = useFilterDate(
	// 	data,
	// 	"custom",
	//
	// );

	if (!from || !to) return null;

	return (
		<>
			{traffic?.month?.length <= 0 ||
			!displayData ||
			(displayData?.preparedData as unknown as number) <= 0 ? (
				<NotFound />
			) : (
				<>
					<SwitchBar
						title={
							<>
								{format(new Date(from), "d MMM yyyy ")}
								{from !== to &&
									` - ${format(new Date(to), "d MMM yyyy")}`}
							</>
						}
						canReset={false}
						durationInDays={differenceInDays(
							new Date(to),
							new Date(from)
						)}
					/>
					<TotalTraffic data={displayData?.total} />
					<DataDisplay
						data={displayData?.preparedData}
						lineChartData={displayData?.lineChartData}
						barChartData={displayData?.barChartData}
						barAxisBottomRotation={
							displayData?.preparedData?.length > 15 ? 90 : 45
						}
						lineAxisBottomRotation={
							displayData?.preparedData?.length > 15 ? 90 : 45
						}
					/>{" "}
				</>
			)}
		</>
	);
}
