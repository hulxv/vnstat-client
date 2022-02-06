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

import Appearance from "./Appearance";
import { useVnStat } from "@Context/vnStat";
import { useConfig } from "@Context/configuration";

function General() {
	const { interfaces, changeInterface } = useVnStat();
	const { EditConfig, config } = useConfig();

	return (
		<Stack>
			<HStack justify='space-between'>
				<Box>Check updates on startup</Box>
				<Switch
					colorScheme={config?.appearance?.globalTheme ?? "green"}
					isChecked={config?.checkUpdatesOnStartup}
					onChange={() => {
						EditConfig("checkUpdatesOnStartup", !config?.checkUpdatesOnStartup);
					}}
				/>
			</HStack>
			<HStack justify='space-between'>
				<Box>Interface</Box>
				<Select
					maxW={200}
					value={config?.interface}
					onChange={(e) => {
						EditConfig("interface", e.target.value);
						changeInterface(e.target.value);
						// console.log(e.target.value);
					}}>
					{interfaces?.map((__interface__, index) => (
						<option key={index} value={__interface__?.id}>
							{__interface__.name}
						</option>
					))}
				</Select>
			</HStack>

			<Appearance />
		</Stack>
	);
}

export default General;
