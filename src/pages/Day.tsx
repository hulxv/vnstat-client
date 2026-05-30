import NotFound from "./NotFound";

// Hooks
import { useVnStat } from "@Context/vnstat";
import { useEffect, useState } from "react";

// Utils
import { prepareDayData, type PreparedResult } from "@Util/PrepareDataToDisplay";

// Components
import DataDisplay from "@Components/DataDisplay";

import SwitchBar from "@Components/SwitchBar";
import TotalTraffic from "@Components/TotalTraffic";

export default function Hour() {
	const { traffic } = useVnStat();
	const [previousDays, setPreviousDays] = useState(0);
	const [displayData, setDisplayData] = useState<PreparedResult | null>(null);

	useEffect(() => {
		let { preparedData, lineChartData, barChartData, total } = prepareDayData(
			traffic?.day,
			previousDays,
		);
		setDisplayData({ preparedData, lineChartData, barChartData, total });
	}, [previousDays, traffic]);

	return (
		<>
			{traffic?.day?.length <= 0 ||
			!displayData ||
			(displayData?.preparedData as unknown as number) <= 0 ? (
				<NotFound />
			) : (
				<>
					<SwitchBar
						state={previousDays}
						setState={setPreviousDays}
						dateFormat='MMM dd'
						interval='day'
						canGoToNext={previousDays > 0}
						canGoToPrevious={true}
					/>
					<TotalTraffic data={displayData?.total} />

					<DataDisplay
						data={displayData?.preparedData}
						lineChartData={displayData?.lineChartData}
						barChartData={displayData?.barChartData}
						barAxisBottomRotation={45}
						lineAxisBottomRotation={45}
					/>
				</>
			)}
		</>
	);
}
