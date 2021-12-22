import { useState } from "react";
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

import { HiInformationCircle } from "react-icons/hi";
import { BiReset } from "react-icons/bi";
import { useConfig } from "@Context/configration";
function vnStatD({ vnConfigs }) {
	const { config } = useConfig();
	const defaultDurations = {
		"5MinuteHours": vnConfigs["5MinuteHours"],
		HourlyDays: vnConfigs["HourlyDays"],
		DailyDays: vnConfigs["DailyDays"],
		MonthlyMonths: vnConfigs["MonthlyMonths"],
		YearlyYears: vnConfigs["YearlyYears"],
		TopDayEntries: vnConfigs["TopDayEntries"],
	};
	const [durations, setDurations] = useState({
		...defaultDurations,
	});
	const notes = {
		durations: "data retention durations (-1 = unlimited, 0 = disabled)",
	};
	return (
		<Stack>
			<Heading alignSelf='center' size='sm'>
				vnStatD
			</Heading>
			<HStack>
				<Heading size='xs'>Data retention durations </Heading>
				<Tooltip label={notes.durations} hasArrow placement='right'>
					<IconButton
						icon={<HiInformationCircle />}
						variant='ghost'
						cursor='default'
					/>
				</Tooltip>
			</HStack>
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
		</Stack>
	);
}

export default vnStatD;
