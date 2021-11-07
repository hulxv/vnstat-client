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
} from "@chakra-ui/react";
import { ipcRenderer } from "electron";
import { useState } from "react";
const JsonViewer = dynamic(import("react-json-view"), { ssr: false });

export default function AsJSON() {
	const [json, setJson] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	function viewJSON(limit) {
		console.log(limit);
		setIsLoading(true);
		ipcRenderer.send("export-db", { format: "json", limit });

		ipcRenderer.on("export-result", async (e, result) =>
			setJson(JSON.parse(result)),
		);
		setIsLoading(false);
	}

	return (
		<>
			<Box onClick={onOpen} fontSize='xl' variant='ghost' w='full'>
				JSON
			</Box>

			<Modal isOpen={isOpen} onClose={onClose}>
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
						<Button variant='ghost' mr={3} onClick={onClose}>
							Close
						</Button>
						<Button colorScheme='green'>Export</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
