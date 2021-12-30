import {
	Heading,
	HStack,
	Stack,
	Input,
	Box,
	Tooltip,
	IconButton,
	Alert,
	AlertDescription,
	AlertIcon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { HiInformationCircle } from "react-icons/hi";
import { BiReset } from "react-icons/bi";

// Sections
import VnStatD from "./vnStatD";
import VnStatI from "./vnStatI";

// Hooks
import { useConfig } from "@Context/configration";
import { useVnStat } from "@Context/vnStat";
function Configs({}) {
	const { config } = useConfig();
	const {
		visualVnConfigs: vnConfigs,
		configs: defaultConfigs,
		changeVnStatConfigs,
	} = useVnStat();

	const Notes = {
		dateFormat:
			'Pattern: "%Y-%m-%d", \nDon\'t delete double quotation (") mark !',
	};

	const [defaultDateFormat, setDefaultDateFormat] = useState({});
	const [dateFormat, setDateFormat] = useState({});
	useEffect(() => {
		setDefaultDateFormat({
			DayFormat: defaultConfigs["DayFormat"],
			MonthFormat: defaultConfigs["MonthFormat"],
			TopFormat: defaultConfigs["TopFormat"],
		});
	}, [defaultConfigs]);
	useEffect(() => {
		setDateFormat(defaultDateFormat);
	}, [defaultDateFormat]);

	return (
		<Stack>
			<Heading alignSelf='center' size='md'>
				Configrations
			</Heading>

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
				{Object.keys(defaultDateFormat) &&
					Object.keys(defaultDateFormat).map((date, index) => (
						<Stack>
							{!dateFormat[date]?.startsWith('"') ||
								(!dateFormat[date]?.endsWith('"') && (
									<Alert status='warning'>
										<AlertIcon />

										<AlertDescription>
											Format must be between double quotations mark like this
											"%Y-%m-%d" !
										</AlertDescription>
									</Alert>
								))}
							<HStack justify='space-between' key={`${date}-${index}`}>
								<Box>{date}</Box>
								<HStack>
									{defaultDateFormat[date] !== dateFormat[date] && (
										<Tooltip label='Reset'>
											<IconButton
												icon={<BiReset size='1.2em' />}
												variant='ghost'
												onClick={() => {
													changeVnStatConfigs(date, defaultDateFormat[date]);

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
											changeVnStatConfigs(date, e.target.value);
											console.log(e.target.value);
										}}
									/>
								</HStack>
							</HStack>
						</Stack>
					))}
			</Stack>
			<VnStatD />
			<VnStatI />
		</Stack>
	);
}

export default Configs;
