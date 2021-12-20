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
		durations: "data retention durations (-1 = unlimited, 0 = disabled)",
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
	// DayFormat    "%Y-%m-%d"
	// MonthFormat  "%Y-%m"
	// TopFormat    "%Y-%m-%d"
	return (
		<Stack>
			<Heading alignSelf='center' size='md'>
				Configrations
			</Heading>
			<HStack>
				<Heading size='sm'>Data retention durations </Heading>
				<Tooltip label={Notes.durations} hasArrow placement='right'>
					<IconButton icon={<HiInformationCircle />} variant='ghost' />
				</Tooltip>
			</HStack>

			<Stack>
				{Object.keys(defaultDurations).map((duration, index) => (
					<HStack justify='space-between' key={`${duration}-${index}`}>
						<Box>{duration}</Box>

						<HStack>
							{defaultDurations[duration] !== durations[duration] && (
								<Tooltip label='Reset'>
									<IconButton
										icon={<BiReset size='1.2em' />}
										variant='ghost'
										onClick={() => {
											setDurations({
												...durations,
												[duration]: defaultDurations[duration],
											});
										}}
									/>
								</Tooltip>
							)}
							<NumberInput
								allowMouseWheel
								value={Number(durations[duration])}
								onChange={(value) =>
									setDurations({ ...durations, [duration]: value })
								}
								min={-1}
								max={250}>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
							<Tooltip label='Unlimited'>
								<Box>
									<Switch
										colorScheme={config.apperance.globalTheme}
										isChecked={Number(durations[duration]) === -1}
										onChange={() => {
											setDurations({
												...durations,
												[duration]:
													Number(durations[duration]) === -1
														? defaultDurations[duration]
														: -1,
											});
										}}
									/>
								</Box>
							</Tooltip>
						</HStack>
					</HStack>
				))}
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
