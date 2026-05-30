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
	IconButton,
	Tooltip,
} from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api/core";
import { useState, type FC } from "react";
import XMLViewerDefault from "react-xml-viewer";
import { BsArrowsCollapse, BsArrowsExpand } from "react-icons/bs";
import { useConfig } from "@Context/configuration";

// This version of react-xml-viewer doesn't declare collapsed/collapsible in
// its prop types, but supports them at runtime — widen the component's props.
const XMLViewer = XMLViewerDefault as unknown as FC<{
	xml: string;
	collapsed?: number;
	collapsible?: boolean;
}>;

export default function AsXML() {
	const { config } = useConfig();
	const [XML, setXML] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [collapse, setCollapse] = useState(false);
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	async function viewXML(limit: string) {
		setIsLoading(true);
		try {
			const result = await invoke<string>("export_db_view", {
				format: "xml",
				limit,
			});
			setXML(result);
		} catch (err) {
			toast({ description: String(err), status: "error", position: "top" });
		} finally {
			setIsLoading(false);
		}
	}

	async function exportXML() {
		if (!XML) {
			toast({ description: "You should choose a limit!", status: "error", isClosable: true, position: "top" });
			return;
		}
		try {
			await invoke("export_to_file", { data: XML, ext: "xml" });
		} catch (err) {
			toast({ description: String(err), status: "error", position: "top" });
		}
	}

	return (
		<>
			<Box onClick={onOpen} fontSize='xl' w='full'>XML</Box>
			<Modal scrollBehavior='inside' isOpen={isOpen} onClose={() => { setXML(null); onClose(); }} size='xl'>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Export as XML</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex flexDir='column'>
							<Select variant='filled' m='10px' placeholder='limit' textTransform='capitalize' alignSelf='center' onChange={e => viewXML(e.target.value)}>
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
							<Box alignSelf='end'>
								<Tooltip label={collapse ? "Expand" : "Collapse"}>
									<IconButton aria-label={collapse ? "Expand" : "Collapse"} icon={collapse ? <BsArrowsExpand size='1.4em' /> : <BsArrowsCollapse size='1.4em' />} onClick={() => setCollapse(!collapse)} variant='ghost' colorScheme='green' />
								</Tooltip>
							</Box>
							{isLoading ? (
								<Spinner size='xl' alignSelf='center' color='green.500' />
							) : XML !== null ? (
								<XMLViewer collapsed={2} xml={collapse ? "<vnstat></vnstat>" : XML} collapsible={true} />
							) : (
								<div></div>
							)}
						</Flex>
					</ModalBody>
					<ModalFooter>
						<Button variant='ghost' mr={3} onClick={() => { setXML(null); onClose(); }}>Close</Button>
						<Button colorScheme={config?.appearance?.globalTheme ?? "green"} onClick={exportXML} isDisabled={!XML}>Export</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
