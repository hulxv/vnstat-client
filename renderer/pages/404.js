import router from "next/router";

import { Flex, Heading, Button } from "@chakra-ui/react";
import { useVnStat } from "@Context/vnStat";
import { useConfig } from "@Context/configuration";
import { HiRefresh } from "react-icons/hi";

function _404() {
	const { reloading: reloadConfigs } = useConfig();
	const { reloading: reloadingTrafficData } = useVnStat();
	return (
		<Flex flexDir='column'>
			<Heading m='4'>No Data is Found</Heading>
			<Button
				leftIcon={<HiRefresh size='1.4em' />}
				mr={1}
				onClick={() => {
					reloadConfigs();
					reloadingTrafficData();
					router.replace(router.asPath);
				}}>
				Refresh
			</Button>
		</Flex>
	);
}

export default _404;
