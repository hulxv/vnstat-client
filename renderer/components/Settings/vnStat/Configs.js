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
		HourlyDays: vnConfigs["DayFormat"],
		MonthFormat: vnConfigs["MonthFormat"],
		TopFormat: vnConfigs["TopFormat"],
	});
	// DayFormat    "%Y-%m-%d"
	// MonthFormat  "%Y-%m"
	// TopFormat    "%Y-%m-%d"
	return (
		<Stack>
			<Heading alignSelf='center' size='md'>
				Configrations
			</Heading>
			<Heading size='sm'>Data retention durations</Heading>

			<Stack>
				{Object.keys(durations).map((duration) => (
					<HStack justify='space-between'>
						<Box>{duration}</Box>
						<HStack>
							<NumberInput
								allowMouseWheel
								defaultValue={Number(durations[duration])}
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
										defaultChecked={Number(durations[duration]) === -1}
									/>
								</Box>
							</Tooltip>
						</HStack>
					</HStack>
				))}
				<HStack>
					<Heading size='sm'>Date Format</Heading>
					<Tooltip label='Pattern: "%Y-%m-%d"'>
						<IconButton
							cursor='default'
							icon={<HiInformationCircle />}
							variant='ghost'
						/>
					</Tooltip>
				</HStack>
				{Object.keys(dateFormat).map((date) => (
					<HStack justify='space-between'>
						<Box>{date}</Box>
						<Input
							w='300px'
							value={dateFormat[date]}
							onChange={(e) => {
								setDateFormat({ ...dateFormat, [date]: e.target.value });
								console.log(e.target.value);
							}}
						/>
					</HStack>
				))}
			</Stack>
		</Stack>
	);
}

export default Configs;
