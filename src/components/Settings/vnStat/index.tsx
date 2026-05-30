import {
	Box,
	Flex,
	Heading,
	Stack,
	HStack,
	Button,
	Tooltip,
	Spinner,
	usePrefersReducedMotion,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState } from "react";

import {
	BsPlayFill,
	BsPauseFill,
	BsArrowCounterclockwise,
} from "react-icons/bs";

import { useVnStat } from "@Context/vnstat";

// Components
import Configs from "./Configs";

function vnStat() {
	const { configs, isConfigsLoading, daemonStatus, stopDaemon, startDaemon, restartDaemon } =
		useVnStat();

	const prefersReducedMotion = usePrefersReducedMotion();
	const animationFade = keyframes`
			from { opacity:100%;}
			to {opacity: 85%;}
		`;

	const animation = prefersReducedMotion
		? undefined
		: `${animationFade} infinite ${daemonStatus ? "2s" : ".5s"} alternate`;

	if (isConfigsLoading)
		return <Spinner size='xl' color='green' alignSelf='center' />;

	if (!configs || !(Object.keys(configs).length > 0))
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
					<Tooltip
						hasArrow
						placement='right'
						textTransform='capitalize'
						label={`Daemon is ${daemonStatus ? "active" : "inactive !"}`}>
						<Button
							animation={animation}
							size='xs'
							colorScheme={daemonStatus ? "green" : "red"}
						/>
					</Tooltip>
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
			<Configs />
		</Stack>
	);
}

export default vnStat;
