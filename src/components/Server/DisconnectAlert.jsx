import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect } from "react";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	AlertDialogCloseButton,
	Button,
	useToast,
} from "@chakra-ui/react";


import { useConfig } from "@Context/configuration";
import { useVnStat } from "@Context/vnstat";
export default function DisconnectAlert({ isOpen, onClose }) {
	const { config } = useConfig();
	const toast = useToast();
	const { reloading } = useVnStat();

	const [isVnstatDetect, setIsVnstatDetect] = useState(false);
	useEffect(() => {
		invoke("is_vnstat_detect")
			.then(res => setIsVnstatDetect(res))
			.catch(console.error);
	}, []);

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
								invoke("server_disconnect")
									.then(res => {
										toast({
											position: "top",
											isClosable: true,
											...res,
										});
										onClose();
										if (isVnstatDetect) reloading();
									})
									.catch(err =>
										toast({ position: "top", status: "error", description: String(err) })
									);
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
