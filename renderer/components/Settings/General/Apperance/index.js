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

import BarChart from "./BarChart";
import LineChart from "./LineChart";
export default function Apperance() {
	const GlobalThemes = ["green", "pink", "blue", "yellow", "orange"];

	return (
		<Stack flexDir='column' w='full' spacing={5}>
			<Heading size='md' alignSelf='center'>
				Apperance
			</Heading>
			<Stack>
				<HStack w='full' spacing={7}>
					<Box>Dark mode</Box>
					<Switch colorScheme='green' />
				</HStack>
				<HStack>
					<Box>Global Theme</Box>
					{GlobalThemes.map((theme) => (
						<Tooltip label={theme} textTransform='capitalize'>
							<Button colorScheme={theme} size='xs' d></Button>
						</Tooltip>
					))}
				</HStack>
			</Stack>

			<Stack>
				<LineChart />
				<BarChart />
			</Stack>
		</Stack>
	);
}
