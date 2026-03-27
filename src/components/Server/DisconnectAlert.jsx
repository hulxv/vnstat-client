import { ipcRenderer } from "electron";
import { useState, useEffect } from "react";
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

import { useConfig } from "@Context/configuration";
import { useVnStat } from "@Context/vnstat";
export default function DisconnectAlert({ isOpen, onOpen, onClose }) {
	const { config } = useConfig();
	const toast = useToast();
	const { reloading } = useVnStat();

	const [isVnstatDetect, setIsVnstatDetect] = useState(false);
	useEffect(() => {
		if (window && ipcRenderer) {
			ipcRenderer.send("req:is-vnstat-detect");
			ipcRenderer.on("res:is-vnstat-detect", (_, res) => {
				setIsVnstatDetect(res);
			});
		}
	}, [typeof window, typeof ipcRenderer]);
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
								if (ipcRenderer)
									ipcRenderer
										.invoke("server-disconnect")
										.then(res => {
											toast({
												position: "top",
												isClosable: true,
												...res,
											});
											onClose();
											if (isVnstatDetect) reloading();
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
