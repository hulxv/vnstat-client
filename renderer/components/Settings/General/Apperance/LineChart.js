import {
	Flex,
	Stack,
	HStack,
	Box,
	Select,
	Heading,
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

function LineChart() {
	const Curves = ["basis", "linear", "catmullRom", "natural", "cardinal"];

	const Colors = ["nivo", "accent", "set1", "set2", "set3", "dark2", "paired"];

	const { config, EditConfig } = useConfig();

	return (
		<Stack spacing={2}>
			<HStack>
				<Heading size='sm'>Line Chart</Heading>
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
								<span>Go to</span>{" "}
								<Link
									color='green'
									onClick={() =>
										ipcRenderer &&
										ipcRenderer.send("open-url", "https://nivo.rocks/line/")
									}>
									Nivo Charts Docs
								</Link>
								<BiLinkExternal />
							</HStack>
						</PopoverBody>
					</PopoverContent>
				</Popover>
			</HStack>
			<HStack alignSelf='start' spacing={4}>
				<Box>Curve</Box>{" "}
				<Select
					value={config.apperance.lineChart.curve}
					onChange={(e) =>
						EditConfig("apperance.lineChart.curve", e.target.value)
					}>
					{" "}
					{Curves.map((curve) => (
						<option>{curve}</option>
					))}
				</Select>{" "}
			</HStack>
			<HStack alignSelf='start' spacing={3}>
				<Box>Colors</Box>{" "}
				<Select
					value={config.apperance.lineChart.colors}
					onChange={(e) =>
						EditConfig("apperance.lineChart.colors", e.target.value)
					}>
					{Colors.map((color) => (
						<option>{color}</option>
					))}
				</Select>
			</HStack>
		</Stack>
	);
}

export default LineChart;
