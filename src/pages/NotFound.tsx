import { Flex, Heading, Button } from "@chakra-ui/react";
import { useVnStat } from "@Context/vnstat";
import { useConfig } from "@Context/configuration";
import { HiRefresh } from "react-icons/hi";

function NotFound() {
	const { reloading: reloadConfigs } = useConfig();
	const { reloading: reloadingTrafficData } = useVnStat();
	return (
		<Flex flexDir="column">
			<Heading m="4">No Data is Found</Heading>
			<Button
				leftIcon={<HiRefresh size="1.4em" />}
				mr={1}
				onClick={() => {
					reloadConfigs();
					reloadingTrafficData();
				}}>
				Refresh
			</Button>
		</Flex>
	);
}

export default NotFound;
