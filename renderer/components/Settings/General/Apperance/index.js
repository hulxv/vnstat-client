import {
	Box,
	Flex,
	Button,
	IconButton,
	Tooltip,
	Heading,
	Stack,
	Switch,
	HStack,
	Select,
} from "@chakra-ui/react";

import { useConfig } from "@Context/configration";

import BarChart from "./BarChart";
import LineChart from "./LineChart";
export default function Apperance() {
	const { config, EditConfig } = useConfig();

	const GlobalThemes = [
		"green",
		"pink",
		"blue",
		"yellow",
		"orange",
		"cyan",
		"purple",
		"teal",
		"red",
	];
	if (!config)
		return (
			<Stack align='center'>
				<Heading>Something went wrong</Heading>
				<p>Please Check logs</p>
			</Stack>
		);
	return (
		<Stack flexDir='column' w='full' spacing={5}>
			<Heading size='md' alignSelf='center'>
				Apperance
			</Heading>
			{config && (
				<Stack>
					<HStack>
						<Box>Global Theme</Box>
						<HStack>
							{GlobalThemes.map((theme) => (
								<Tooltip label={theme} textTransform='capitalize'>
									<Box
										rounded='md'
										w={6}
										h={6}
										cursor='pointer'
										bgColor={`${theme}.500`}
										size='xs'
										boxShadow={
											config?.apperance?.globalTheme === theme && "outline"
										}
										_hover={{ opacity: "90%" }}
										borderColor='blackAlpha.800'
										onClick={(e) =>
											EditConfig("apperance.globalTheme", theme)
										}></Box>
								</Tooltip>
							))}
						</HStack>
					</HStack>
				</Stack>
			)}

			<Stack>
				<LineChart />
				<BarChart />
			</Stack>
		</Stack>
	);
}
