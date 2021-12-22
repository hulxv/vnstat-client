import {
	Box,
	Flex,
	Heading,
	Stack,
	HStack,
	Button,
	Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";

import {
	BsPlayFill,
	BsPauseFill,
	BsArrowCounterclockwise,
} from "react-icons/bs";

import { useConfig } from "@Context/configration";

// Components
import Configs from "./Configs";

function vnStat() {
	const [daemonStatus, setDaemonStatus] = useState(false);
	const { vnConfigs } = useConfig();

	if (!vnConfigs || !Object.keys(vnConfigs))
		return (
			<Stack align='center'>
				<Heading>Something went wrong</Heading>
				<p>Please Check logs</p>
			</Stack>
		);
	return (
		<Stack w='full'>
			<Stack w='full'>
				<Heading size='md' alignSelf='center'>
					Daemon
				</Heading>
				<Flex w='full' justify='space-between'>
					<Box>Status: {daemonStatus ? "Acitve " : "Idle"}</Box>
					<HStack>
						<Button
							leftIcon={<BsArrowCounterclockwise size='1.4em' />}
							variant='ghost'>
							Restart
						</Button>
						<Button
							colorScheme={`${daemonStatus ? "red" : "green"}`}
							leftIcon={
								daemonStatus ? (
									<BsPauseFill size='1.4em' />
								) : (
									<BsPlayFill size='1.4em' />
								)
							}
							onClick={() => setDaemonStatus(!daemonStatus)}>
							{daemonStatus ? "Stop" : "Start"}
						</Button>
					</HStack>
				</Flex>
			</Stack>
			<Configs vnConfigs={vnConfigs} />
		</Stack>
	);
}

export default vnStat;
