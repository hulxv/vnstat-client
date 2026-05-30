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
	AlertTitle,
	AlertDescription,
} from "@chakra-ui/react";

import { css } from "@emotion/react";
import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { format } from "date-fns";

import { MdDateRange, MdOutlineInsertDriveFile } from "react-icons/md";

import { useEffect, useRef, useState } from "react";
import { useConfig } from "@Context/configuration";

interface UpdateFile {
	url?: string;
	size: number;
}

interface UpdateInfo {
	tag?: string;
	releaseNotes?: string;
	releaseDate?: string;
	files?: UpdateFile[];
}

interface DownloadProgress {
	percent: number;
}

function AvailableUpdateAlert() {
	const { config } = useConfig();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<HTMLButtonElement>(null);

	// Booleans
	const [isUpdateStartDownload, setIsUpdateStartDownload] = useState(false);
	const [isThereUpdateError, setIsThereUpdateError] = useState(false);
	const [isUpdateDownloaded, setIsUpdateDownloaded] = useState(false);

	// States
	const [releaseData, setReleaseData] = useState<UpdateInfo | null>(null);
	const [downloadProgress, setDownloadProgress] =
		useState<DownloadProgress | null>(null);

	useEffect(() => {
		const unlisten: UnlistenFn[] = [];

		listen<UpdateInfo>("update-available", (e) => {
			onOpen();
			setReleaseData(e.payload);
		}).then(u => unlisten.push(u));

		listen<DownloadProgress>("download-update-progress", (e) => {
			setDownloadProgress(e.payload);
		}).then(u => unlisten.push(u));

		listen("download-update-error", () => {
			setIsThereUpdateError(true);
			setIsUpdateStartDownload(false);
		}).then(u => unlisten.push(u));

		listen("update-downloaded", () => {
			setIsUpdateDownloaded(true);
		}).then(u => unlisten.push(u));

		return () => unlisten.forEach(u => u());
	}, []);

	return (
		<>
			<AlertDialog
				motionPreset='slideInBottom'
				leastDestructiveRef={cancelRef}
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
											onClick={() => invoke("quit_and_update").catch(console.error)}
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
								textDecoration={true as unknown as undefined}
								pl={4}
								fontSize='small'
								onClick={(e) => {
									e.preventDefault();
									const url = (e.target as HTMLElement).getAttribute("href");
									if (url !== null) {
										invoke("open_url", { url }).catch(console.error);
									}
								}}
								dangerouslySetInnerHTML={{
									__html: releaseData?.releaseNotes ?? "",
								}}
							/>
							<HStack alignSelf='end' justify='revert' mt={4}>
								{releaseData !== null && (
									<>
										{releaseData?.files?.map((e, index) => (
											<Tooltip key={index} label={e?.url} hasArrow>
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
												{format(new Date(releaseData?.releaseDate ?? ""), "MMM d Y")}
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
								invoke("start_download_new_update").catch(console.error);
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
