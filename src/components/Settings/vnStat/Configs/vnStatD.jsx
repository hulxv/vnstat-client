import {
	Heading,
	HStack,
	Stack,
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

// Icons
import { HiInformationCircle } from "react-icons/hi";
import { BiReset } from "react-icons/bi";
import { RiErrorWarningLine } from "react-icons/ri";

// Hooks
import { useState, useEffect } from "react";

import { useConfig } from "@Context/configuration";
import { useVnStat } from "@Context/vnstat";

function vnStatD({}) {
	const notes = {
		durations: "data retention durations (-1 = unlimited, 0 = disabled)",
	};

	const {
		visualVnConfigs: vnConfigs,
		configs: defaultConfigs,
		changeVnStatConfigs,
	} = useVnStat();
	const { config } = useConfig();

	const [durations, setDurations] = useState({});

	const [defaultDurations, setDefaultDurations] = useState({});
	useEffect(() => {
		setDefaultDurations({
			"5MinuteHours": defaultConfigs["5MinuteHours"] ?? null,
			HourlyDays: defaultConfigs["HourlyDays"] ?? null,
			DailyDays: defaultConfigs["DailyDays"] ?? null,
			MonthlyMonths: defaultConfigs["MonthlyMonths"] ?? null,
			YearlyYears: defaultConfigs["YearlyYears"] ?? null,
			TopDayEntries: defaultConfigs["TopDayEntries"] ?? null,
		});
	}, [defaultConfigs]);
	useEffect(() => {
		setDurations(defaultDurations);
	}, [defaultDurations]);
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
						{durations[duration] === null && (
							<Tooltip
								hasArrow
								placement='right'
								label="This attribute is disabled, You should change the value and save to enable it. But if wasn't enabled, You should add it for config file manually">
								<IconButton
									size='sm'
									icon={<RiErrorWarningLine size='1.2em' />}
									variant='ghost'
								/>
							</Tooltip>
						)}
						{defaultDurations[duration] !== durations[duration] && (
							<Tooltip label='Reset'>
								<IconButton
									icon={<BiReset size='1.2em' />}
									variant='ghost'
									onClick={() => {
										changeVnStatConfigs(duration, defaultDurations[duration]);
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
							onChange={(value) => {
								// console.log(duration, value);
								changeVnStatConfigs(duration, value);
								setDurations({ ...durations, [duration]: value });
							}}
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
									colorScheme={config?.appearance?.globalTheme ?? "green"}
									isChecked={Number(durations[duration]) === -1}
									onChange={() => {
										let value =
											Number(durations[duration]) === -1
												? defaultDurations[duration]
												: -1;

										changeVnStatConfigs(duration, value);
										setDurations({
											...durations,
											[duration]: value,
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
