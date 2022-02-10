import {
	Heading,
	HStack,
	Stack,
	Input,
	Switch,
	Box,
	Tooltip,
	IconButton,
} from "@chakra-ui/react";

// Icons
import { BiReset } from "react-icons/bi";
import { RiErrorWarningLine } from "react-icons/ri";

// Hooks
import { useState, useEffect } from "react";

import { useConfig } from "@Context/configuration";
import { useVnStat } from "@Context/vnStat";

function vnStatD({}) {
	const notes = {
		Colors: "data retention Color(-1 = unlimited, 0 = disabled)",
	};

	const { configs: defaultConfigs, changeVnStatConfigs } = useVnStat();
	const { config } = useConfig();

	const [Colors, setColors] = useState({});

	const [defaultColors, setDefaultColors] = useState({});
	useEffect(() => {
		setDefaultColors({
			CBackground:
				defaultConfigs["CBackground"]?.replace(/[",']/gi, "") ?? null,
			CEdge: defaultConfigs["CEdge"]?.replace(/[",']/gi, "") ?? null,
			CHeader: defaultConfigs["CHeader"]?.replace(/[",']/gi, "") ?? null,
			CHeaderTitle:
				defaultConfigs["CHeaderTitle"]?.replace(/[",']/gi, "") ?? null,
			CHeaderDate:
				defaultConfigs["CHeaderDate"]?.replace(/[",']/gi, "") ?? null,
			CText: defaultConfigs["CText"]?.replace(/[",']/gi, "") ?? null,
			CLine: defaultConfigs["CLine"]?.replace(/[",']/gi, "") ?? null,
			CLineL: defaultConfigs["CLineL"]?.replace(/[",']/gi, "") ?? null,
			CTx: defaultConfigs["CTx"]?.replace(/[",']/gi, "") ?? null,
			CRx: defaultConfigs["CRx"]?.replace(/[",']/gi, "") ?? null,
			CRxD: defaultConfigs["CRxD"]?.replace(/[",']/gi, "") ?? null,
			CTxD: defaultConfigs["CTxD"]?.replace(/[",']/gi, "") ?? null,
		});
	}, [defaultConfigs]);
	useEffect(() => {
		setColors(defaultColors);
	}, [defaultColors]);

	const [rates, setRates] = useState({});

	const [defaultRates, setDefaultRates] = useState({});
	useEffect(() => {
		setDefaultRates({
			HourlyRate: defaultConfigs["HourlyRate"] ?? null,
			SummaryRate: defaultConfigs["SummaryRate"] ?? null,
		});
	}, [defaultConfigs]);

	useEffect(() => {
		setRates(defaultRates);
	}, [defaultRates]);

	/*
    # show hours with rate (1 = enabled, 0 = disabled)
    HourlyRate 1

    # show rate in summary (1 = enabled, 0 = disabled)
    SummaryRate 1

    */
	return (
		<Stack spacing={6}>
			<Heading alignSelf='center' size='sm'>
				vnStatI
			</Heading>

			<Stack spacing={4}>
				<Heading size='xs'>Rates</Heading>
				{Object.keys(rates).map((rate, index) => (
					<HStack justify='space-between' key={index}>
						<Box>{rate}</Box>
						<HStack>
							{rates[rate] === null && (
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

							{defaultRates[rate] != rates[rate] && (
								<Tooltip label='Reset'>
									<IconButton
										size='sm'
										icon={<BiReset size='1.2em' />}
										variant='ghost'
										onClick={() => {
											changeVnStatConfigs(rate, defaultRates[rate]);
											setRates({
												...rates,
												[rate]: defaultRates[rate],
											});
										}}
									/>
								</Tooltip>
							)}
							<Switch
								colorScheme={config?.appearance?.globalTheme ?? "green"}
								isChecked={Boolean(Number(rates[rate]))}
								onChange={() => {
									let value = Number(!Boolean(rates[rate]));
									changeVnStatConfigs(rate, `${value}`);
									setRates({
										...rates,
										[rate]: value,
									});
								}}
							/>
						</HStack>
					</HStack>
				))}
			</Stack>
			<Stack spacing={4}>
				<Heading size='xs'>Image Colors</Heading>
				{Object.keys(Colors).map((color, index) => (
					<HStack justify='space-between' key={index}>
						<Box>{color}</Box>
						<HStack>
							{Colors[color] === null && (
								<Tooltip
									hasArrow
									placement='left'
									label="This attribute is disabled, You should change the value and save to enable it. But if wasn't enabled, You should add it for config file manually">
									<IconButton
										size='sm'
										icon={<RiErrorWarningLine size='1.2em' />}
										variant='ghost'
									/>
								</Tooltip>
							)}
							{String(defaultColors[color]).toUpperCase() !==
								String(Colors[color]).toUpperCase() && (
								<Tooltip label='Reset'>
									<IconButton
										icon={<BiReset size='1.2em' />}
										variant='ghost'
										onClick={() => {
											changeVnStatConfigs(color, `"${defaultColors[color]}"`);
											setColors({
												...Colors,
												[color]: defaultColors[color],
											});
										}}
									/>
								</Tooltip>
							)}
							<input
								style={{ width: "50px", height: "50px" }}
								type='color'
								value={`#${Colors[color] === "-" ? "000000" : Colors[color]}`}
								onChange={(e) => {
									changeVnStatConfigs(
										color,
										`"${e.target.value.replace(/#/gi, "")}"`,
									);
									setColors({
										...Colors,
										[color]: e.target.value.replace(/#/gi, ""),
									});
								}}
							/>
						</HStack>
					</HStack>
				))}
			</Stack>
		</Stack>
	);
}

export default vnStatD;
