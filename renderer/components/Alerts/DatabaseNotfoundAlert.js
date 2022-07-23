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
	Text,
	Button,
	Divider,
	Stack,
	Heading,
	List,
	ListItem,
	UnorderedList,
} from "@chakra-ui/react";
import { ConnectModal } from "@Components/Server";

import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import { useConfig } from "@Context/configuration";

import { TiWarningOutline } from "react-icons/ti";

function DatabaseNotFoundAlert() {
	const { config } = useConfig();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const connectModalDisclosure = useDisclosure();

	const [isServerConnected, setIsServerConnected] = useState(false);
	const [isDatabaseNotFound, setIsDatabaseNotFound] = useState(false);

	useEffect(() => {
		ipcRenderer.on("error-database-not-found", () => {
			setIsDatabaseNotFound(true);
		});
	}, []);

	useEffect(() => {
		if (ipcRenderer && window) {
			ipcRenderer
				.invoke("server-is-connected")
				.then(({ is_connected }) => setIsServerConnected(is_connected));

			ipcRenderer.on("server-was-disconnected", () => {
				setIsServerConnected(false);
			});
			ipcRenderer.on("server-was-connected", () => {
				setIsServerConnected(true);
			});
		}
	}, []);

	return (
		<>
			<AlertDialog
				motionPreset="slideInBottom"
				closeOnOverlayClick={false}
				closeOnEsc={false}
				isOpen={!isServerConnected && isDatabaseNotFound}
				onClose={onClose}
				isCentered>
				<AlertDialogOverlay />

				<AlertDialogContent py={1}>
					<AlertDialogHeader>
						vnStat database isn't found
					</AlertDialogHeader>
					<AlertDialogBody>
						<Stack spacing={6}>
							<span style={{ alignSelf: "center" }}>
								<TiWarningOutline size="5em" />
							</span>
							<Stack spacing={0.1}>
								<Text align={"center"} mb={4}>
									vnStat database path is not file or
									directory
								</Text>
								<Text align="center">
									Please check from database filepath in your
									vnstat configuration file or read to solve
									this problem.
								</Text>
							</Stack>
							<Stack>
								<Heading size="sm">Maybe useful</Heading>
								<Box pl={6}>
									<UnorderedList>
										<ListItem>
											Issue{" "}
											<Link
												color="teal.500"
												textDecorationLine="underline"
												onClick={() =>
													ipcRenderer &&
													ipcRenderer.send(
														"open-url",
														"https://github.com/Hulxv/vnstat-client/issues/7"
													)
												}>
												#7
											</Link>
										</ListItem>
									</UnorderedList>
								</Box>
							</Stack>
							<Stack
								position={"relative"}
								justify="center"
								align="center">
								<Divider />
								<Heading
									bgColor="white"
									px={3}
									top={-4}
									position={"absolute"}
									size="xs">
									OR
								</Heading>
							</Stack>
						</Stack>
					</AlertDialogBody>
					<AlertDialogFooter display="flex" justifyContent={"center"}>
						<Button
							onClick={connectModalDisclosure.onOpen}
							colorScheme={
								config?.appearance?.globalTheme ?? "green"
							}>
							Connect to server
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<ConnectModal {...connectModalDisclosure} />
		</>
	);
}

export default DatabaseNotFoundAlert;
