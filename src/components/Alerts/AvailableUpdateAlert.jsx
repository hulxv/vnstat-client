import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Text,
	useDisclosure,
	AlertDialogCloseButton,
	Button,
	Heading,
	Tag,
	TagLeftIcon,
	TagLabel,
	Stack,
	HStack,
	Tooltip,
	Alert,
	AlertIcon,
	Box,
	AlertTitle,
	AlertDescription,
	CloseButton,
} from "@chakra-ui/react";

import { css } from "@emotion/react";

import { ipcRenderer } from "electron";
import { format } from "date-fns";

import { MdDateRange, MdOutlineInsertDriveFile } from "react-icons/md";

import { useEffect, useState } from "react";
import { useConfig } from "@Context/configuration";

function AvailableUpdateAlert() {
	const { config } = useConfig();
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Booleans
	const [isUpdateStartDownload, setIsUpdateStartDownload] = useState(false);
	const [isThereUpdateError, setIsThereUpdateError] = useState(false);
	const [isUpdateDownloaded, setIsUpdateDownloaded] = useState(false);

	// States
	const [releaseData, setReleaseData] = useState(null);
	const [downloadProgress, setDownloadProgress] = useState(null);
	useEffect(() => {
		ipcRenderer.on("update-available", (e, data) => {
			onOpen();
			setReleaseData(data);
		});

		ipcRenderer.on("download-update-progress", (e, result) => {
			setDownloadProgress(result);
		});
		ipcRenderer.on("download-update-error", () => {
			setIsThereUpdateError(true);
			setIsUpdateStartDownload(false);
		});
		ipcRenderer.on("update-downloaded", () => {
			setIsUpdateDownloaded(true);
		});
	}, []);

	return (
		<>
			<AlertDialog
				motionPreset='slideInBottom'
				onClose={onClose}
				isOpen={isOpen}
				isCentered>
				<AlertDialogOverlay />

				<AlertDialogContent>
					<AlertDialogHeader>{releaseData?.tag} Released !</AlertDialogHeader>
					<AlertDialogCloseButton />
					<AlertDialogBody>
						<Stack>
							{isUpdateDownloaded && (
								<Alert status='success'>
									<Stack align='center' flex='1'>
										<HStack>
											<AlertTitle>Update Downloaded!</AlertTitle>
											<AlertIcon />
										</HStack>
										<AlertDescription display='block'>
											Do you want to restart app to install new update?
										</AlertDescription>
										<Button
											onClick={() => {
												ipcRenderer.send("quit-and-update");
											}}
											variant='ghost'>
											Restart
										</Button>
									</Stack>
								</Alert>
							)}
							<Heading size='md'>What's new ?</Heading>
							<Text
								css={css`
									${new Array(6)
										.fill(null)
										.map(
											(e, index) =>
												`h${index} {
												font-size: ${28 - index * 4}px
											}`,
										)
										.join("\n")}
									a {
										color: blue;
										&:hover {
											text-decoration: underline;
										}
									}
									ul {
										padding-left: 20px;
									}
								`}
								textDecoration
								pl={4}
								fontSize='small'
								onClick={(e) => {
									e.preventDefault();
									let url = e.target.getAttribute("href");
									if (url !== null) {
										// console.log("open-url", url);
										ipcRenderer.send("open-url", url);
									}
								}}
								dangerouslySetInnerHTML={{
									__html: releaseData?.releaseNotes,
								}}
							/>
							<HStack alignSelf='end' justify='revert' mt={4}>
								{releaseData !== null && (
									<>
										{releaseData?.files?.map((e, index) => (
											<Tooltip label={e?.url} hasArrow>
												<Tag
													size='md'
													variant='subtle'
													colorScheme={
														config?.appearance?.globalTheme ?? "green"
													}>
													<TagLeftIcon
														boxSize='12px'
														as={MdOutlineInsertDriveFile}
													/>
													<TagLabel>
														{Math.round(e.size / Math.pow(1024, 2))}MB
													</TagLabel>
												</Tag>
											</Tooltip>
										))}
										<Tag
											size='md'
											variant='subtle'
											colorScheme={config?.appearance?.globalTheme ?? "green"}>
											<TagLeftIcon boxSize='12px' as={MdDateRange} />
											<TagLabel>
												{format(new Date(releaseData?.releaseDate), "MMM d Y")}
											</TagLabel>
										</Tag>
									</>
								)}
							</HStack>
						</Stack>
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button variant='ghost' onClick={onClose}>
							Later
						</Button>
						<Button
							onClick={() => {
								if (isUpdateDownloaded || isUpdateStartDownload) return;
								setIsUpdateStartDownload(true);
								ipcRenderer.send("start-download-new-update");
							}}
							colorScheme={
								isThereUpdateError
									? "red"
									: config?.appearance?.globalTheme ?? "green"
							}
							ml={3}>
							{isThereUpdateError
								? "Retry"
								: isUpdateDownloaded
								? "Done"
								: `${
										downloadProgress !== null
											? `${Math.round(downloadProgress.percent)}%`
											: "Update Now"
								  }`}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export default AvailableUpdateAlert;
