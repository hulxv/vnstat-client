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

import Apperance from "./Apperance";
import { useVnStat } from "@Context/vnStat";
import { useConfig } from "@Context/configration";

function General() {
	const { interfaces, changeInterface } = useVnStat();
	const { EditConfig, config } = useConfig();
	return (
		<Stack>
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
					{interfaces?.map((__interface__) => (
						<option value={__interface__?.id}>{__interface__.name}</option>
					))}
				</Select>
			</HStack>
			<Apperance />
		</Stack>
	);
}

export default General;
