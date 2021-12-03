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
function LineChart() {
	const Curves = ["basis", "linear", "catmullRom", "natural", "cardinal"];

	const Colors = ["nivo", "accent", "set1", "set2", "set3", "dark2", "paired"];

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
				<Select placeholder='select'>
					{" "}
					{Curves.map((curve) => (
						<option>{curve}</option>
					))}
				</Select>{" "}
			</HStack>
			<HStack alignSelf='start' spacing={3}>
				<Box>Colors</Box>{" "}
				<Select placeholder='select'>
					{Colors.map((color) => (
						<option>{color}</option>
					))}
				</Select>
			</HStack>
		</Stack>
	);
}

export default LineChart;
