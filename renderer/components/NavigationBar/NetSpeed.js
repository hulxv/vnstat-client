import { useNetStats } from "@Context/network-stats";
import { useEffect, useState } from "react";
import { toCapitalize } from "@Util";
import LineChart from "@Components/DataDisplay/LineChart";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	useDisclosure,
	Box,
	Stack,
	Heading,
	HStack,
	Tooltip,
} from "@chakra-ui/react";

import { HiArrowDown, HiArrowUp } from "react-icons/hi";
import { GrPowerReset } from "react-icons/gr";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";

export default function NetStats() {
	// return <div></div>;
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		networkStats,
		seconds,
		recordedSpeedStats,
		reset,
		startRecording,
		stopRecording,
		isRecording,
	} = useNetStats();
	const [lineChartData, setLineChartData] = useState([
		{
			id: "Upload",
			data: recordedSpeedStats.map((e, index) => ({
				x: index,
				y: e.tx / 1024,
			})),
		},
		{
			id: "Download",
			data: recordedSpeedStats.map((e, index) => ({
				x: index,
				y: e.rx / 1024,
			})),
		},
	]);

	useEffect(() => {
		setLineChartData([
			{
				id: "Upload",
				data: recordedSpeedStats.map((e, index) => ({
					x: index,
					y: (e.tx / 1024).toFixed(2),
				})),
			},
			{
				id: "Download",
				data: recordedSpeedStats.map((e, index) => ({
					x: index,
					y: (e.rx / 1024).toFixed(2),
				})),
			},
		]);
	}, [recordedSpeedStats]);
	return (
		<>
			<Tooltip label='Show network speed statistics' hasArrow>
				<Button
					variant='ghost'
					colorScheme='whiteAlpha'
					fontSize='sm'
					textColor='whiteAlpha.900'
					onClick={() => {
						onOpen();
					}}
					h={14}
					cursor='pointer'>
					<Stack>
						<HStack>
							<HiArrowDown />
							<Box>
								{(Object.values(networkStats)[0]?.speed?.rx / 1024)?.toFixed(2)}{" "}
								KB/s {"  "}
							</Box>
						</HStack>

						<HStack>
							<HiArrowUp />
							<Box>
								{(Object.values(networkStats)[0]?.speed?.tx / 1024)?.toFixed(2)}{" "}
								KB/s
							</Box>
						</HStack>
					</Stack>
				</Button>
			</Tooltip>

			<Modal
				scrollBehavior='inside'
				isOpen={isOpen}
				onClose={() => {
					stopRecording();
					onClose();
				}}
				size='4xl'>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						Network Speed Statistics for{" "}
						{toCapitalize(Object.keys(networkStats)[0] ?? "")}{" "}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack w='full' align='center' spacing={5}>
							<Stack align='center'>
								<HStack spacing={2}>
									<HStack>
										<HiArrowDown />
										<Box>
											{(
												Object.values(networkStats)[0]?.speed?.rx / 1024
											)?.toFixed(2)}{" "}
											KB/s {"  "}
										</Box>
									</HStack>

									<HStack>
										<HiArrowUp />
										<Box>
											{(
												Object.values(networkStats)[0]?.speed?.tx / 1024
											)?.toFixed(2)}{" "}
											KB/s
										</Box>
									</HStack>
								</HStack>
							</Stack>
							<Stack align='center' h={500} w='full'>
								<Heading size='sm'>Speed Chart</Heading>
								<LineChart
									data={lineChartData}
									disableAxisBottom
									LeftLegend='Speed (KB/S)'
									disableAnimate
								/>
								<Tooltip label='Recording time'>
									<Heading size='xs'>
										{Math.floor(seconds / 3600 < 10 && "0")}
										{Math.floor(seconds / 3600)}:
										{Math.floor((seconds / 60) % 60 < 10 && "0")}
										{Math.floor(seconds / 60)}:{seconds % 60 < 10 ? "0" : ""}
										{seconds % 60}
									</Heading>
								</Tooltip>
							</Stack>
							<Button leftIcon={<GrPowerReset />} onClick={() => reset()}>
								Reset Statistics
							</Button>
							<Button
								colorScheme={isRecording ? "red" : "green"}
								leftIcon={isRecording ? <BsPauseFill /> : <BsPlayFill />}
								onClick={() =>
									isRecording ? stopRecording() : startRecording()
								}>
								{isRecording ? "Stop" : "Start"}
							</Button>
						</Stack>
					</ModalBody>

					<ModalFooter>
						<Button variant='ghost' mr={3} onClick={onClose}>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
