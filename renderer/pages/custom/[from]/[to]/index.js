import { format, differenceInDays } from "date-fns";
// Utilities
import { prepareCustomIntervalData } from "@Util/PrepareDataToDisplay";
// Hooks
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useVnStat } from "@Context/vnstat";

// Components
import DataDisplay from "@Components/DataDisplay";
import TotalTraffic from "@Components/TotalTraffic";
import SwitchBar from "@Components/SwitchBar";
import NotFound from "@Pages/404";
import { Box } from "@chakra-ui/react";

export default function CustomInterval() {
	const router = useRouter();
	const { from, to } = router.query;
	const { traffic } = useVnStat();
	const [displayData, setDisplayData] = useState(null);

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

	return (
		<>
			{traffic?.month?.length <= 0 ||
			!displayData ||
			displayData?.preparedData <= 0 ? (
				<NotFound />
			) : (
				<>
					<SwitchBar
						title={
							<>
								{format(new Date(from), "d MMM yyyy ")}
								{from !== to && ` - ${format(new Date(to), "d MMM yyyy")}`}
							</>
						}
						canReset={false}
						durationInDays={differenceInDays(new Date(to), new Date(from))}
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
