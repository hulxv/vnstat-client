import NotFound from "./404";

import { useState, useEffect } from "react";
import { prepareMonthData } from "@Util/PrepareDataToDisplay";

// Components
import DataDisplay from "@Components/DataDisplay";
import SwitchBar from "@Components/SwitchBar";
import TotalTraffic from "@Components/TotalTraffic";

import { useVnStat } from "@Context/vnStat";

export default function Month() {
	const [previousMonths, setPreviousMonths] = useState(0);
	const [displayData, setDisplayData] = useState(null);

	const { traffic } = useVnStat();

	useEffect(() => {
		let { preparedData, lineChartData, barChartData, total } = prepareMonthData(
			traffic?.month,
			previousMonths,
		);
		setDisplayData({ preparedData, lineChartData, barChartData, total });
	}, [previousMonths, traffic]);

	return (
		<>
			{traffic?.month?.length <= 0 ||
			!displayData ||
			displayData?.preparedData <= 0 ? (
				<NotFound />
			) : (
				<>
					{" "}
					<SwitchBar
						state={previousMonths}
						setState={setPreviousMonths}
						dateFormat='yyyy MMMM'
						interval='month'
						canGoToNext={previousMonths > 0}
						canGoToPrevious={true}
					/>
					<TotalTraffic data={displayData?.total} />
					<DataDisplay
						lineChartData={displayData?.lineChartData}
						barChartData={displayData?.barChartData}
						data={displayData?.preparedData}
					/>{" "}
				</>
			)}
		</>
	);
}
