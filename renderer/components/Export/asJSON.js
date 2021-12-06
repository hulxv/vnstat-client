import dynamic from "next/dynamic";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Button,
	Box,
	Spinner,
	Flex,
	Select,
	useToast,
} from "@chakra-ui/react";
import { ipcRenderer } from "electron";
import { useState } from "react";

import { useConfig } from "../../context/configration";

const JsonViewer = dynamic(import("react-json-view"), { ssr: false });

export default function AsJSON() {
	const { config } = useConfig();

	const [json, setJson] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	function viewJSON(limit) {
		setIsLoading(true);
		ipcRenderer.send("export-db-view", { format: "json", limit });

		ipcRenderer.on("export-result", async (e, result) =>
			setJson(JSON.parse(result)),
		);
		setIsLoading(false);
	}

	function exportJSON() {
		if (Object.keys(json).length <= 0) {
			toast.closeAll();
			toast({
				description: "You should choose a limit !",
				status: "error",
				isClosable: true,
				position: "top",
			});
			return;
		}
		ipcRenderer.send("export-as-json", { jsonOBJ: json });
	}
	return (
		<>
			<Box onClick={onOpen} fontSize='xl' variant='ghost' w='full'>
				JSON
			</Box>

			<Modal
				isOpen={isOpen}
				onClose={() => {
					onClose();
					setJson({});
				}}
				size='xl'>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Export as JSON</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex flexDir='column'>
							<Select
								variant='filled'
								m='10px'
								placeholder='limit'
								textTransform='capitalize'
								alignSelf='center'
								onChange={(e) => viewJSON(e.target.value)}>
								{[
									{ limit: "a", label: "all" },
									{ limit: "f", label: "5 min" },
									{ limit: "h", label: "hours" },
									{ limit: "d", label: "days" },
									{ limit: "m", label: "months" },
									{ limit: "y", label: "years" },
									{ limit: "t", label: "top" },
								].map((e, index) => (
									<option
										key={index}
										value={e.limit}
										style={{ textTransform: "capitalize" }}>
										{e.label}
									</option>
								))}
							</Select>

							{isLoading ? (
								<Spinner size='xl' alignSelf='center' color='green.500' />
							) : (
								<JsonViewer collapsed={2} src={json} />
							)}
						</Flex>
					</ModalBody>

					<ModalFooter>
						<Button
							variant='ghost'
							mr={3}
							onClick={() => {
								setJson({});
								onClose();
							}}>
							Close
						</Button>
						<Button
							colorScheme={config?.apperance?.globalTheme ?? "green"}
							onClick={() => exportJSON()}
							isDisabled={Object.keys(json).length <= 0}>
							Export
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
