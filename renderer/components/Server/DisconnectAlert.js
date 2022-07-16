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
	useToast,
} from "@chakra-ui/react";

import electron from "electron";

import { useConfig } from "@Context/configuration";
import { useVnStat } from "@Context/vnStat";
export default function DisconnectAlert({ isOpen, onOpen, onClose }) {
	const { config } = useConfig();
	const toast = useToast();
	const { reloading } = useVnStat();

	return (
		<>
			<AlertDialog
				motionPreset="slideInBottom"
				onClose={onClose}
				isOpen={isOpen}
				isCentered>
				<AlertDialogOverlay />

				<AlertDialogContent>
					<AlertDialogHeader>Disconnect Server</AlertDialogHeader>
					<AlertDialogCloseButton />
					<AlertDialogBody>
						Are you really sure disconnect with the server?
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button variant="ghost" onClick={onClose}>
							Cancel
						</Button>
						<Button
							onClick={() => {
								if (electron && window)
									electron.ipcRenderer
										.invoke("server-disconnect")
										.then(res => {
											toast({
												position: "top",
												isClosable: true,
												...res,
											});
											reloading();
											onClose();
										});
							}}
							colorScheme={
								config?.appearance?.globalTheme ?? "green"
							}
							ml={3}>
							Disconnect
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
