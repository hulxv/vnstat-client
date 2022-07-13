import { ipcRenderer } from "electron";

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
	Input,
	Heading,
	IconButton,
} from "@chakra-ui/react";

import { useState } from "react";
import { useConfig } from "@Context/configuration";

import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function CustomIntervalModal({
	children,
	isClosable = false,
	isOpen = false,
	onOpen,
	onClose,
}) {
	const { config } = useConfig();
	const [address, setAddress] = useState("");
	const [password, setPassword] = useState("");

	const [isPasswordVisiable, setIsPasswordVisiable] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	function connectHandler() {
		if (ipcRenderer) {
			setIsLoading(true);
			ipcRenderer.send("connect-to-vnstat-server", { address, password });

			ipcRenderer.on("connect-to-server-is-done", () => {
				setIsLoading(false);
			});
		}
	}

	return (
		<>
			<Modal
				isOpen={isOpen}
				isCentered
				onClose={() => {
					onClose();
				}}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Connect to vnStat Server</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack spacing={8}>
							<Stack spacing={0.3}>
								<Heading opacity={0.7} size="xs">
									IP Address
								</Heading>
								<Input
									onChange={e => setAddress(e.target.value)}
									value={address}
									variant="filled"
									type="text"
									placeholder="http://0.0.0.0:8888"
								/>
							</Stack>
							<Stack spacing={0.3}>
								<Heading opacity={0.7} size="xs">
									Passowrd
								</Heading>
								<Box position="relative">
									<IconButton
										onClick={() =>
											setIsPasswordVisiable(
												!isPasswordVisiable
											)
										}
										variant="ghost"
										zIndex={10}
										position="absolute"
										right={0}
										icon={
											isPasswordVisiable ? (
												<AiFillEyeInvisible size="1.4em" />
											) : (
												<AiFillEye size="1.4em" />
											)
										}
									/>
									<Input
										onChange={e =>
											setPassword(e.target.value)
										}
										value={password}
										variant="filled"
										type={
											isPasswordVisiable
												? "text"
												: "password"
										}
										placeholder="*******"
									/>
								</Box>
							</Stack>
						</Stack>
					</ModalBody>

					<ModalFooter>
						<Button
							variant="ghost"
							mr={3}
							onClick={() => {
								onClose();
							}}>
							Close
						</Button>
						<Button
							isDisabled={!address || !password}
							isLoading={isLoading}
							colorScheme={
								config?.appearance?.globalTheme ?? "green"
							}
							onClick={connectHandler}>
							Connect
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
