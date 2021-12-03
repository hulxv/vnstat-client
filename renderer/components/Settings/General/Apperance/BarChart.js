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

function BarChart() {
	const Colors = ["nivo", "accent", "set1", "set2", "set3", "dark2", "paired"];

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
								<span>Go to</span>{" "}
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
					<Switch colorScheme='green' />
				</HStack>
				<HStack alignSelf='start'>
					<Box>Colors</Box>{" "}
					<Select placeholder='select'>
						{Colors.map((color) => (
							<option>{color}</option>
						))}
					</Select>{" "}
				</HStack>
			</Stack>
		</Stack>
	);
}

export default BarChart;
