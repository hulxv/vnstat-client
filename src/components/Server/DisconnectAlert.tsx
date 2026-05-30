import { invoke } from "@tauri-apps/api/core";
import { useState, useEffect, useRef } from "react";
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
	type UseToastOptions,
} from "@chakra-ui/react";


import { useConfig } from "@Context/configuration";
import { useVnStat } from "@Context/vnstat";
import type { ConnectResponse } from "@Types";
export default function DisconnectAlert({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const { config } = useConfig();
	const toast = useToast();
	const { reloading } = useVnStat();
	const cancelRef = useRef<HTMLButtonElement>(null);

	const [isVnstatDetect, setIsVnstatDetect] = useState(false);
	useEffect(() => {
		invoke<boolean>("is_vnstat_detect")
			.then(res => setIsVnstatDetect(res))
			.catch(console.error);
	}, []);

	return (
		<>
			<AlertDialog
				motionPreset="slideInBottom"
				leastDestructiveRef={cancelRef}
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
								invoke<ConnectResponse>("server_disconnect")
									.then(res => {
										toast({
											position: "top",
											isClosable: true,
											...res,
										} as UseToastOptions);
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
