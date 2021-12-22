import { format } from "date-fns";
// Utilites
import { prepareCustomIntervalData } from "@Util/PrepareDataToDisplay";
// Hooks
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useVnStat } from "@Context/vnStat";

// Components
import DataDisplay from "@Components/DataDisplay";
import TotalTraffic from "@Components/TotalTraffic";
import SwitchBar from "@Components/SwitchBar";
import NotFound from "@Pages/404";

export default function CustomInterval() {
	const router = useRouter();
	const { traffic } = useVnStat();
	const [displayData, setDisplayData] = useState(null);

	useEffect(() => {
		let { preparedData, lineChartData, barChartData, total } =
			prepareCustomIntervalData(
				traffic?.month,
				router.query.from,
				router.query.to,
			);
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
								{format(new Date(router.query.from), "yyyy MMM dd")}
								{router.query.from !== router.query.to &&
									` - ${format(new Date(router.query.to), "yyyy MMM dd")}`}
							</>
						}
						canReset={false}
					/>
					<TotalTraffic data={displayData?.total} />
					<DataDisplay
						data={displayData?.preparedData}
						lineChartData={displayData?.lineChartData}
						barChartData={displayData?.barChartData}
						barAxisBottomRotation={
							displayData?.preparedData?.legnth > 15 ? 90 : 45
						}
						lineAxisBottomRotation={
							displayData?.preparedData?.legnth > 15 ? 90 : 45
						}
					/>{" "}
				</>
			)}
		</>
	);
}
