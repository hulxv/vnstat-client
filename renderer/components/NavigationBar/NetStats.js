import { useNetStats } from "@Context/network-stats";
import { useConfig } from "@Context/configuration";
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
import { BsPlayFill, BsPauseFill, BsSpeedometer2 } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { RiSignalWifiErrorFill } from "react-icons/ri";
import { BiTimer } from "react-icons/bi";
export default function NetStats() {
	const { EditConfig, config } = useConfig();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		networkStats,
		seconds,
		recordedNetworkStats,
		reset,
		startRecording,
		stopRecording,
		isRecording,
		iface,
	} = useNetStats();

	const [lineChartData, setLineChartData] = useState([
		{
			id: "Upload",
			data: recordedNetworkStats.map((e, index) => ({
				x: index,
				y: ((e[Object.keys(e).at(0)]?.speed?.tx ?? 0) / 1024).toFixed(2),
			})),
		},
		{
			id: "Download",
			data: recordedNetworkStats.map((e, index) => ({
				x: index,
				y: ((e[Object.keys(e).at(0)]?.speed?.rx ?? 0) / 1024).toFixed(2),
			})),
		},
	]);

	useEffect(() => {
		setLineChartData([
			{
				id: "Upload",
				data: recordedNetworkStats.map((e, index) => ({
					x: index,
					y: ((e[Object.keys(e).at(0)]?.speed?.tx ?? 0) / 1024).toFixed(2),
				})),
			},
			{
				id: "Download",
				data: recordedNetworkStats.map((e, index) => ({
					x: index,
					y: ((e[Object.keys(e).at(0)]?.speed?.rx ?? 0) / 1024).toFixed(2),
				})),
			},
		]);

		console.log(networkStats);
	}, [recordedNetworkStats]);

	const { speed, bytes, errors, dropped, ms, ...otherStats } = networkStats ?? {
		speed: { rx: 0, tx: 0 },
		dropped: { rx: 0, tx: 0 },
		bytes: { rx: 0, tx: 0 },
		errors: { rx: 0, tx: 0 },
		ms: null,
	};
	return (
		<>
			<Tooltip
				label='show more network statistics'
				textTransform='capitalize'
				hasArrow>
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
							<Box style={{ fontVariantNumeric: "tabular-nums" }}>
								{(speed?.rx / 1024)?.toFixed(2)} KB/s {"  "}
							</Box>
						</HStack>

						<HStack>
							<HiArrowUp />
							<Box style={{ fontVariantNumeric: "tabular-nums" }}>
								{(speed?.tx / 1024)?.toFixed(2)} KB/s
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
					<ModalHeader textTransform='capitalize'>
						Networw Statistics {`(${iface})`}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack w='full' align='center' spacing={5}>
							<Stack w='full' align='center'>
								<HStack
									w='full'
									flexWrap='wrap'
									justify='space-around'
									align='start'>
									<Stack spacing={2} align='center'>
										<Box>
											<Tooltip label='Speed'>
												<Box opacity='80%'>
													<BsSpeedometer2 size='1.6em' />
												</Box>
											</Tooltip>
										</Box>
										<Stack align='start'>
											<HStack>
												<HiArrowDown />
												<Box>
													{(speed?.rx / 1024)?.toFixed(2)} KB/s {"  "}
												</Box>
											</HStack>

											<HStack>
												<HiArrowUp />
												<Box>{(speed?.tx / 1024)?.toFixed(2)} KB/s</Box>
											</HStack>
										</Stack>
									</Stack>
									<Stack align='center'>
										<Tooltip label='Errors'>
											<Box opacity='80%'>
												<RiSignalWifiErrorFill size='1.6em' />
											</Box>
										</Tooltip>
										<Stack align='start'>
											{Object.entries(errors).map((e, index) => (
												<HStack key={index}>
													<Tooltip label={e[0]} textTransform='capitalize'>
														<Box>
															{e[0] === "rx" ? (
																<HiArrowDown />
															) : e[0] === "tx" ? (
																<HiArrowUp />
															) : (
																e[0]
															)}
														</Box>
													</Tooltip>
													<div style={{ fontVariantNumeric: "tabular-nums" }}>
														{e[1]}
													</div>
												</HStack>
											))}
										</Stack>
									</Stack>

									<Stack align='center'>
										<Tooltip label='Drops'>
											<Box opacity='80%'>
												<IoMdArrowDropdown size='1.6em' />
											</Box>
										</Tooltip>
										<Stack align='start'>
											{Object.entries(errors).map((e, index) => (
												<HStack key={index}>
													<Tooltip label={e[0]} textTransform='capitalize'>
														<Box>
															{e[0] === "rx" ? (
																<HiArrowDown />
															) : e[0] === "tx" ? (
																<HiArrowUp />
															) : (
																e[0]
															)}
														</Box>
													</Tooltip>
													<div style={{ fontVariantNumeric: "tabular-nums" }}>
														{e[1]}
													</div>
												</HStack>
											))}
										</Stack>
									</Stack>
									<Stack>
										<Tooltip label='MS'>
											<Box opacity='80%'>
												<BiTimer size='1.6em' />
											</Box>
										</Tooltip>
										<Box>{ms}</Box>
									</Stack>

									{Object.entries(otherStats).map((e, index) => (
										<Stack key={index} align='center'>
											<Box opacity='80%'>{e[0]}</Box>
											<Box>{e[1]}</Box>
										</Stack>
									))}
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
						<Button
							colorScheme={config?.appearance?.globalTheme ?? "green"}
							mr={3}
							onClick={() => {
								onClose();
							}}>
							Export Records As JSON
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
