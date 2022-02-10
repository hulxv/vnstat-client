import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Box,
	Link,
	useDisclosure,
	Alert,
	AlertIcon,
	AlertDescription,
	AlertTitle,
} from "@chakra-ui/react";

import { ipcRenderer } from "electron";
import { useEffect } from "react";

function VnStatIsNotInstalledAlert() {
	const { isOpen, onOpen } = useDisclosure();
	useEffect(() => {
		ipcRenderer.on("vnstat-is-not-installed", () => {
			onOpen();
		});
	}, []);

	return (
		<>
			<AlertDialog motionPreset='slideInBottom' isOpen={isOpen} isCentered>
				<AlertDialogOverlay />

				<AlertDialogContent py={3}>
					<AlertDialogBody>
						<Alert
							status='error'
							variant='subtle'
							flexDirection='column'
							alignItems='center'
							justifyContent='center'
							textAlign='center'
							py={10}>
							<AlertIcon boxSize='40px' />
							<AlertTitle fontSize='2xl' my={5}>
								vnStat isn't installed!
							</AlertTitle>
							<AlertDescription maxWidth='sm'>
								<Box mb={4}>
									vnStat isn't installed, You should download and setup it
									before using this client.
								</Box>
								<Box>
									Check{" "}
									<Link
										textDecorationLine='underline'
										onClick={() =>
											ipcRenderer &&
											ipcRenderer.send(
												"open-url",
												"https://github.com/vergoh/vnstat/blob/master/INSTALL.md",
											)
										}>
										here
									</Link>{" "}
									to know how to install and setup it.
								</Box>
							</AlertDescription>
						</Alert>
					</AlertDialogBody>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export default VnStatIsNotInstalledAlert;
