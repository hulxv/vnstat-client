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

import { useVnStat } from "@Context/vnStat";

// Components
import Configs from "./Configs";

function vnStat() {
	const { configs, daemonStatus, stopDaemon, startDaemon, restartDaemon } =
		useVnStat();

	if (!configs || !Object.keys(configs))
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
					<Box>Status: {daemonStatus ? "active" : "inactive"}</Box>
					<HStack>
						<Button
							leftIcon={<BsArrowCounterclockwise size='1.4em' />}
							variant='ghost'
							onClick={() => restartDaemon()}>
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
							onClick={() => {
								// console.log(daemonStatus.split(""));
								if (daemonStatus) {
									stopDaemon();
								} else {
									startDaemon();
								}
							}}>
							{daemonStatus ? "Stop" : "Start"}
						</Button>
					</HStack>
				</Flex>
			</Stack>
			<Configs vnConfigs={configs} />
		</Stack>
	);
}

export default vnStat;
