import { format, getWeekYear } from "date-fns";

import NotFound from "./404";

import { useState, useEffect } from "react";
import { prepareWeekData } from "@Util/PrepareDataToDisplay";

// Components
import DataDisplay from "@Components/DataDisplay";
import SwitchBar from "@Components/SwitchBar";
import TotalTraffic from "@Components/TotalTraffic";
import { Stack, Heading } from "@chakra-ui/react";

import { useVnStat } from "@Context/vnStat";

export default function Month() {
	const [PreviousWeeks, setPreviousWeeks] = useState(0);
	const [displayData, setDisplayData] = useState([]);

	const { traffic } = useVnStat();

	useEffect(() => {
		let { preparedData, lineChartData, barChartData, total } = prepareWeekData(
			traffic?.week,
			PreviousWeeks,
		);
		setDisplayData({ preparedData, lineChartData, barChartData, total });
		// console.log(displayData?.preparedData);
	}, [PreviousWeeks, traffic]);

	return (
		<>
			{traffic?.week?.length <= 0 ||
			!displayData ||
			displayData?.preparedData <= 0 ? (
				<NotFound />
			) : (
				<>
					{" "}
					<SwitchBar
						title={
							<Stack align='center'>
								<Heading textTransform='capitalize'>
									{format(
										new Date(
											displayData?.preparedData?.at(0)?.date ?? new Date(),
										),
										"wo",
									)}{" "}
									week in{" "}
									{getWeekYear(
										new Date(
											displayData?.preparedData?.at(0)?.date ?? new Date(),
										),
									)}
								</Heading>
								<Heading size='sm'>
									{format(
										new Date(
											displayData?.preparedData?.at(0)?.date ?? new Date(),
										),
										"yyyy MMM dd",
									)}
									{` - ${format(
										new Date(
											displayData?.preparedData?.at(
												displayData?.preparedData?.length - 1,
											)?.date ?? new Date(),
										),

										"yyyy MMM dd",
									)}`}
								</Heading>
							</Stack>
						}
						state={PreviousWeeks}
						setState={setPreviousWeeks}
						dateFormat='yyyy MMMM dd'
						interval='month'
						canGoToNext={PreviousWeeks > 0}
						canGoToPrevious={true}
					/>
					<TotalTraffic data={displayData?.total} />
					<DataDisplay
						lineChartData={displayData?.lineChartData}
						barChartData={displayData?.barChartData}
						data={displayData?.preparedData?.map((e) => ({
							...e,
							date: format(new Date(e.date), "EEEE"),
						}))}
					/>
				</>
			)}
		</>
	);
}
