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

import { useConfig } from "../../../../context/configuration";

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

			{config && (
				<Stack>
					<HStack alignSelf='start'>
						<Box>Grouped mode</Box>
						<Switch
							colorScheme={config?.appearance?.globalTheme ?? "green"}
							defaultChecked={config.appearance.barChart.isGrouped}
							onChange={(e) =>
								EditConfig("appearance.barChart.isGrouped", e.target.checked)
							}
						/>
					</HStack>
					<HStack alignSelf='start' spacing={2.5}>
						<Box>Colors</Box>
						<Select
							value={config.appearance.barChart.colors}
							onChange={(e) =>
								EditConfig("appearance.barChart.colors", e.target.value)
							}>
							{Colors.map((color) => (
								<option>{color}</option>
							))}
						</Select>
					</HStack>
					<HStack alignSelf='start'>
						<Box>Layout</Box>
						<Select
							value={config.appearance.barChart.layout}
							onChange={(e) =>
								EditConfig("appearance.barChart.layout", e.target.value)
							}>
							<option>horizontal</option>
							<option>vertical</option>
						</Select>
					</HStack>
				</Stack>
			)}
		</Stack>
	);
}

export default BarChart;
