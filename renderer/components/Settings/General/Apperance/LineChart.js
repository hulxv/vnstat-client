import {
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
	Switch,
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
} from "@chakra-ui/react";

import { ipcRenderer } from "electron";

import { GrInfo } from "react-icons/gr";
import { BiLinkExternal } from "react-icons/bi";

import { useConfig } from "../../../../context/configration";
import { useState } from "react";

function LineChart() {
	// Check https://nivo.rocks/line/
	const Curves = [
		"basis",
		"linear",
		"catmullRom",
		"natural",
		"cardinal",
		"monotoneX",
		"monotoneY",
		"step",
		"stepAfter",
		"stepBefore",
	];

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
	const [areaOpacitySlider, setAreaOpacitySlider] = useState(
		config?.apperance?.lineChart?.areaOpacity ?? null,
	);
	console.log(config);
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
			{config && (
				<>
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

					<HStack>
						<Box>Area</Box>
						<Switch
							colorScheme={config.apperance.globalTheme}
							defaultChecked={config.apperance.lineChart.hasArea}
							onChange={(e) =>
								EditConfig("apperance.lineChart.hasArea", e.target.checked)
							}
						/>
					</HStack>
					<HStack spacing={5}>
						<Box>Area Opacity</Box>
						<Slider
							defaultValue={config.apperance.lineChart.areaOpacity}
							min={0.0}
							max={1}
							step={0.01}
							w='lg'
							onChange={(value) => setAreaOpacitySlider(value)}
							onChangeEnd={(value) =>
								EditConfig("apperance.lineChart.areaOpacity", value)
							}>
							<SliderTrack bg={`${config.apperance.globalTheme}.200`}>
								<SliderFilledTrack bg={`${config.apperance.globalTheme}.500`} />
							</SliderTrack>
							<SliderThumb boxSize={6} />
						</Slider>
						<Box>{areaOpacitySlider}</Box>
					</HStack>
				</>
			)}
		</Stack>
	);
}

export default LineChart;
