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

function vnStat() {
	const [daemonStatus, setDaemonStatus] = useState(false);
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
		</Stack>
	);
}

export default vnStat;
