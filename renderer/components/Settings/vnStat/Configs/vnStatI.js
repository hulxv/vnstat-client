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

// Hooks
import { useState, useEffect } from "react";

import { useConfig } from "@Context/configration";
import { useVnStat } from "@Context/vnStat";

function vnStatD({}) {
	const notes = {
		Colors: "data retention Colors (-1 = unlimited, 0 = disabled)",
	};

	const { configs: defaultConfigs, changeVnStatConfigs } = useVnStat();
	const { config } = useConfig();

	const [Colors, setColors] = useState({});

	const [defaultColors, setDefaultColors] = useState({});
	useEffect(() => {
		setDefaultColors({
			CBackground: defaultConfigs["CBackground"].replace(/[",']/gi, ""),
			CEdge: defaultConfigs["CEdge"].replace(/[",']/gi, ""),
			CHeader: defaultConfigs["CHeader"].replace(/[",']/gi, ""),
			CHeaderTitle: defaultConfigs["CHeaderTitle"].replace(/[",']/gi, ""),
			CHeaderDate: defaultConfigs["CHeaderDate"].replace(/[",']/gi, ""),
			CText: defaultConfigs["CText"].replace(/[",']/gi, ""),
			CLine: defaultConfigs["CLine"].replace(/[",']/gi, ""),
			CTx: defaultConfigs["CTx"].replace(/[",']/gi, ""),
			CRx: defaultConfigs["CRx"].replace(/[",']/gi, ""),
			CRxD: defaultConfigs["CRxD"].replace(/[",']/gi, ""),
			CTxD: defaultConfigs["CTxD"].replace(/[",']/gi, ""),
		});
	}, [defaultConfigs]);
	useEffect(() => {
		setColors(defaultColors);
	}, [defaultColors]);

	const [rates, setRates] = useState({});

	const [defaultRates, setDefaultRates] = useState({});
	useEffect(() => {
		setDefaultRates({
			HourlyRate: defaultConfigs["HourlyRate"],
			SummaryRate: defaultConfigs["SummaryRate"],
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
				{Object.keys(rates).map((rate) => (
					<HStack justify='space-between'>
						<Box>{rate}</Box>
						<HStack>
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
								colorScheme={config?.apperance?.globalTheme ?? "green"}
								isChecked={Boolean(Number(rates[rate]))}
								onChange={() => {
									let value = Number(!Boolean(rates[rate]));
									console.log(!Boolean(rates[rate]));
									console.log(rates[rate]);
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
				{Object.keys(Colors).map((color) => (
					<HStack justify='space-between'>
						<Box>{color}</Box>
						<HStack>
							{defaultColors[color].toUpperCase() !==
								Colors[color].toUpperCase() && (
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
