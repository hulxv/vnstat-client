import {
	Flex,
	Stack,
	HStack,
	Box,
	Select,
	Heading,
	Switch,
	IconButton,
	Popover,
	PopoverTrigger,
	PopoverContent,
	PopoverBody,
	PopoverArrow,
	PopoverCloseButton,
	Link,
} from "@chakra-ui/react";

import { ipcRenderer } from "electron";

import { GrInfo } from "react-icons/gr";
import { BiLinkExternal } from "react-icons/bi";

import { useConfig } from "../../../../context/configration";

function BarChart() {
	// Check https://nivo.rocks/bar/

	const Colors = [
		"nivo",
		"accent",
		"set1",
		"set2",
		"set3",
		"dark2",
		"paired",
		"spectral",
	];

	const { config, EditConfig } = useConfig();

	return (
		<Stack spacing={2} flexDir='column' w='full'>
			<HStack>
				<Heading size='sm'>Bar Chart</Heading>
				<Popover>
					<PopoverTrigger>
						<IconButton
							size='sm'
							variant='ghost'
							icon={<GrInfo size='1.3em' />}
						/>
					</PopoverTrigger>
					<PopoverContent>
						<PopoverArrow />
						<PopoverCloseButton />
						<PopoverBody>
							<HStack>
								<span>Go to</span>
								<Link
									color='green'
									onClick={() =>
										ipcRenderer &&
										ipcRenderer.send("open-url", "https://nivo.rocks/bar/")
									}>
									Nivo Charts Docs
								</Link>
								<BiLinkExternal />
							</HStack>
						</PopoverBody>
					</PopoverContent>
				</Popover>
			</HStack>
			<Stack>
				<HStack alignSelf='start'>
					<Box>Grouped mode</Box>
					<Switch
						colorScheme={config.apperance.globalTheme}
						defaultChecked={config.apperance.barChart.isGrouped}
						onChange={(e) =>
							EditConfig("apperance.barChart.isGrouped", e.target.checked)
						}
					/>
				</HStack>
				<HStack alignSelf='start' spacing={2.5}>
					<Box>Colors</Box>
					<Select
						value={config.apperance.barChart.colors}
						onChange={(e) =>
							EditConfig("apperance.barChart.colors", e.target.value)
						}>
						{Colors.map((color) => (
							<option>{color}</option>
						))}
					</Select>
				</HStack>
				<HStack alignSelf='start'>
					<Box>Layout</Box>
					<Select
						value={config.apperance.barChart.layout}
						onChange={(e) =>
							EditConfig("apperance.barChart.layout", e.target.value)
						}>
						<option>horizontal</option>
						<option>vertical</option>
					</Select>
				</HStack>
			</Stack>
		</Stack>
	);
}

export default BarChart;
