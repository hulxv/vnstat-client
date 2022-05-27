import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	useDisclosure,
	AlertDialogCloseButton,
	Button,
	Heading,
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	CloseButton,
	Link,
	Box,
} from "@chakra-ui/react";

import { css } from "@emotion/react";

import { ipcRenderer } from "electron";
import { format } from "date-fns";

import { MdDateRange, MdOutlineInsertDriveFile } from "react-icons/md";

import { useEffect, useState } from "react";
import { useConfig } from "@Context/configuration";

function AvailableUpdateAlert() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		ipcRenderer.on("error-database-not-found", () => {
			onOpen();
		});
	}, []);

	return (
		<>
			<>
				<AlertDialog motionPreset='slideInBottom' isOpen={isOpen} isCentered>
					<AlertDialogOverlay />

					<AlertDialogContent py={3}>
						<AlertDialogBody>
							<Alert
								status='error'
								flexDirection='column'
								alignItems='center'
								justifyContent='center'
								textAlign='center'
								py={10}>
								<AlertIcon boxSize='40px' />
								<AlertTitle fontSize='2xl' my={5}>
									Database isn't found!
								</AlertTitle>
								<AlertDescription maxWidth='sm'>
									<Box mb={4}>
										Please check from database filepath in your vnstat
										configuration file or read{" "}
										<Link
											textDecorationLine='underline'
											onClick={() =>
												ipcRenderer &&
												ipcRenderer.send(
													"open-url",
													"https://github.com/Hulxv/vnstat-client/issues/7",
												)
											}>
											#7
										</Link>{" "}
										to solve this problem.
									</Box>
								</AlertDescription>
							</Alert>
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button onClick={onClose}>Close</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</>
		</>
	);
}

export default AvailableUpdateAlert;
