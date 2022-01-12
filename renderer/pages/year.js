import NotFound from "@Pages/404";

import { useVnStat } from "@Context/vnStat";

import { useState, useEffect } from "react";
import { prepareYearData } from "@Util/PrepareDataToDisplay";

// Components
import DataDisplay from "@Components/DataDisplay";
import SwitchBar from "@Components/SwitchBar";
import TotalTraffic from "@Components/TotalTraffic";
import { format } from "date-fns";

export default function Year() {
	const { traffic } = useVnStat();

	const [previousYears, setPreviousYears] = useState(0);
	const [displayData, setDisplayData] = useState(null);

	useEffect(() => {
		let { preparedData, lineChartData, barChartData, total } = prepareYearData(
			traffic?.year,
			previousYears,
		);
		setDisplayData({ preparedData, lineChartData, barChartData, total });
	}, [previousYears, traffic]);

	return (
		<>
			{traffic?.year?.length <= 0 ||
			!displayData ||
			displayData?.preparedData <= 0 ? (
				<NotFound />
			) : (
				<>
					{" "}
					<SwitchBar
						state={previousYears}
						setState={setPreviousYears}
						dateFormat='yyyy'
						interval='year'
						canGoToNext={previousYears > 0}
						canGoToPrevious={previousYears < 30}
					/>
					<TotalTraffic data={displayData?.total} />
					<DataDisplay
						data={displayData?.preparedData?.map((e) => ({
							...e,
							date: format(new Date(e.date), "MMM"),
						}))}
						lineChartData={displayData?.lineChartData}
						barChartData={displayData?.barChartData}
					/>{" "}
				</>
			)}
		</>
	);
}
