import { lazy, Suspense } from "react";
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
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useConfig } from "@Context/configuration";

const JsonViewer = lazy(() => import("react-json-view"));

export default function AsJSON() {
	const { config } = useConfig();
	const [json, setJson] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	async function viewJSON(limit) {
		setIsLoading(true);
		try {
			const raw = await invoke("export_db_view", { format: "json", limit });
			setJson(JSON.parse(raw));
		} catch (err) {
			toast({ description: String(err), status: "error", position: "top" });
		} finally {
			setIsLoading(false);
		}
	}

	async function exportJSON() {
		if (Object.keys(json).length <= 0) {
			toast({ description: "You should choose a limit!", status: "error", isClosable: true, position: "top" });
			return;
		}
		try {
			await invoke("export_to_file", { data: JSON.stringify(json), ext: "json" });
		} catch (err) {
			toast({ description: String(err), status: "error", position: "top" });
		}
	}

	return (
		<>
			<Box onClick={onOpen} fontSize='xl' w='full'>JSON</Box>
			<Modal isOpen={isOpen} scrollBehavior='inside' onClose={() => { onClose(); setJson({}); }} size='xl'>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Export as JSON</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex flexDir='column'>
							<Select variant='filled' m='10px' placeholder='limit' textTransform='capitalize' alignSelf='center' onChange={e => viewJSON(e.target.value)}>
								{[
									{ limit: "a", label: "all" },
									{ limit: "f", label: "5 min" },
									{ limit: "h", label: "hours" },
									{ limit: "d", label: "days" },
									{ limit: "m", label: "months" },
									{ limit: "y", label: "years" },
									{ limit: "t", label: "top" },
								].map((e, index) => (
									<option key={index} value={e.limit} style={{ textTransform: "capitalize" }}>{e.label}</option>
								))}
							</Select>
							{isLoading ? (
								<Spinner size='xl' alignSelf='center' color='green.500' />
							) : (
								<Suspense fallback={null}>
									<JsonViewer collapsed={2} src={json} />
								</Suspense>
							)}
						</Flex>
					</ModalBody>
					<ModalFooter>
						<Button variant='ghost' mr={3} onClick={() => { setJson({}); onClose(); }}>Close</Button>
						<Button colorScheme={config?.appearance?.globalTheme ?? "green"} onClick={exportJSON} isDisabled={Object.keys(json).length <= 0}>Export</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
