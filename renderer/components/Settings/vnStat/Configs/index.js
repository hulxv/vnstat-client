import {
	Heading,
	HStack,
	Stack,
	Input,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Switch,
	Box,
	Tooltip,
	IconButton,
} from "@chakra-ui/react";
import { useState } from "react";

import { HiInformationCircle } from "react-icons/hi";
import { BiReset } from "react-icons/bi";
import { useConfig } from "@Context/configration";
import VnStatD from "./vnStatD";
function Configs({ vnConfigs }) {
	const { config } = useConfig();

	const [durations, setDurations] = useState({
		"5MinuteHours": vnConfigs["5MinuteHours"],
		HourlyDays: vnConfigs["HourlyDays"],
		DailyDays: vnConfigs["DailyDays"],
		MonthlyMonths: vnConfigs["MonthlyMonths"],
		YearlyYears: vnConfigs["YearlyYears"],
		TopDayEntries: vnConfigs["TopDayEntries"],
	});

	const [dateFormat, setDateFormat] = useState({
		HourlyDays: vnConfigs["DayFormat"].replace(/["]/gi, ""),
		MonthFormat: vnConfigs["MonthFormat"].replace(/["]/gi, ""),
		TopFormat: vnConfigs["TopFormat"].replace(/["]/gi, ""),
	});

	// Read only without changing

	const Notes = {
		dateFormat: 'Pattern: "%Y-%m-%d"',
	};

	const defaultDurations = {
		"5MinuteHours": vnConfigs["5MinuteHours"],
		HourlyDays: vnConfigs["HourlyDays"],
		DailyDays: vnConfigs["DailyDays"],
		MonthlyMonths: vnConfigs["MonthlyMonths"],
		YearlyYears: vnConfigs["YearlyYears"],
		TopDayEntries: vnConfigs["TopDayEntries"],
	};

	const defaultDateFormat = {
		HourlyDays: vnConfigs["DayFormat"].replace(/["]/gi, ""),
		MonthFormat: vnConfigs["MonthFormat"].replace(/["]/gi, ""),
		TopFormat: vnConfigs["TopFormat"].replace(/["]/gi, ""),
	};

	return (
		<Stack>
			<Heading alignSelf='center' size='md'>
				Configrations
			</Heading>

			<VnStatD vnConfigs={vnConfigs} />

			<Stack>
				<HStack>
					<Heading size='sm'>Date Format</Heading>
					<Tooltip label={Notes.dateFormat} hasArrow placement='right'>
						<IconButton
							cursor='default'
							icon={<HiInformationCircle />}
							variant='ghost'
						/>
					</Tooltip>
				</HStack>
				{Object.keys(defaultDateFormat).map((date, index) => (
					<HStack justify='space-between' key={`${date}-${index}`}>
						<Box>{date}</Box>
						<HStack>
							{defaultDateFormat[date] !== dateFormat[date] && (
								<Tooltip label='Reset'>
									<IconButton
										icon={<BiReset size='1.2em' />}
										variant='ghost'
										onClick={() => {
											setDateFormat({
												...dateFormat,
												[date]: defaultDateFormat[date],
											});
										}}
									/>
								</Tooltip>
							)}
							<Input
								w='300px'
								value={dateFormat[date]}
								onChange={(e) => {
									setDateFormat({ ...dateFormat, [date]: e.target.value });
									console.log(e.target.value);
								}}
							/>
						</HStack>
					</HStack>
				))}
			</Stack>
		</Stack>
	);
}

export default Configs;
