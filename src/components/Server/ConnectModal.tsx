import { invoke } from "@tauri-apps/api/core";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Stack,
	Input,
	Heading,
	IconButton,
	useToast,
	Box,
	type UseToastOptions,
} from "@chakra-ui/react";
import { useState } from "react";
import { useConfig } from "@Context/configuration";
import { useVnStat } from "@Context/vnstat";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import type { ConnectResponse } from "@Types";

export default function ConnectModal({
	isOpen,
	onClose,
}: {
	isOpen: boolean;
	onClose: () => void;
}) {
	const toast = useToast();
	const { config } = useConfig();
	const { reloading } = useVnStat();
	const [address, setAddress] = useState("");
	const [password, setPassword] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	async function connectHandler() {
		setIsLoading(true);
		try {
			const res = await invoke<ConnectResponse>("server_connect", {
				address,
				password,
			});
			toast({
				position: "top",
				isClosable: true,
				...res,
			} as UseToastOptions);
			if (res.status === "success") {
				onClose();
				reloading();
			}
		} catch (err) {
			toast({
				position: "top",
				status: "error",
				description: String(err),
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Modal isOpen={isOpen} isCentered onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Connect to vnStat Server</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack spacing={8}>
						<Stack spacing={0.3}>
							<Heading opacity={0.7} size="xs">
								Address
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
								Password
							</Heading>
							<Box position="relative">
								<IconButton
									aria-label={
										isPasswordVisible
											? "Hide password"
											: "Show password"
									}
									onClick={() =>
										setIsPasswordVisible(!isPasswordVisible)
									}
									variant="ghost"
									zIndex={10}
									position="absolute"
									right={0}
									icon={
										isPasswordVisible ? (
											<AiFillEyeInvisible size="1.4em" />
										) : (
											<AiFillEye size="1.4em" />
										)
									}
								/>
								<Input
									onChange={e => setPassword(e.target.value)}
									value={password}
									variant="filled"
									type={
										isPasswordVisible ? "text" : "password"
									}
									placeholder="*******"
								/>
							</Box>
						</Stack>
					</Stack>
				</ModalBody>
				<ModalFooter>
					<Button variant="ghost" mr={3} onClick={onClose}>
						Close
					</Button>
					<Button
						isDisabled={!address || !password}
						isLoading={isLoading}
						colorScheme={config?.appearance?.globalTheme ?? "green"}
						onClick={connectHandler}>
						Connect
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
