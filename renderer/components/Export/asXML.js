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
import { ipcRenderer } from "electron";
import { useState } from "react";
import XMLViewer from "react-xml-viewer";

import { BsArrowsCollapse, BsArrowsExpand } from "react-icons/bs";

import { useConfig } from "../../context/configuration";

export default function AsXML() {
	const { config } = useConfig();

	const [XML, setXML] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [collapse, setCollapse] = useState(false);

	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	function viewXML(limit) {
		setIsLoading(true);
		ipcRenderer.send("export-db-view", { format: "xml", limit });

		ipcRenderer.on("export-result", async (e, result) => {
			setXML(result);
		});
		setIsLoading(false);
	}

	function exportXML() {
		if (Object.keys(XML).length <= 0) {
			toast.closeAll();
			toast({
				description: "You should choose a limit !",
				status: "error",
				isClosable: true,
				position: "top",
			});
			return;
		}
		ipcRenderer.send("export-as-xml", { xmlOBJ: XML });
	}
	return (
		<>
			<Box onClick={onOpen} fontSize='xl' w='full'>
				XML
			</Box>

			<Modal
				scrollBehavior='inside'
				isOpen={isOpen}
				onClose={() => {
					setXML(null);
					onClose();
				}}
				size='xl'>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Export as XML</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex flexDir='column'>
							<Select
								variant='filled'
								m='10px'
								placeholder='limit'
								textTransform='capitalize'
								alignSelf='center'
								onChange={(e) => viewXML(e.target.value)}>
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
							<Box alignSelf='end'>
								<Tooltip label={collapse ? "Expand" : "Collapse"}>
									<IconButton
										icon={
											collapse ? (
												<BsArrowsExpand size='1.4em' />
											) : (
												<BsArrowsCollapse size='1.4em' />
											)
										}
										onClick={() => setCollapse(!collapse)}
										variant='ghost'
										colorScheme='green'
									/>
								</Tooltip>
							</Box>
							{isLoading ? (
								<Spinner size='xl' alignSelf='center' color='green.500' />
							) : XML !== null ? (
								<XMLViewer
									collapsed={2}
									xml={collapse ? "<vnstat></vnstat>" : XML}
									collapsible={true}
								/>
							) : (
								<div></div>
							)}
						</Flex>
					</ModalBody>

					<ModalFooter>
						<Button
							variant='ghost'
							mr={3}
							onClick={() => {
								setXML(null);
								onClose();
							}}>
							Close
						</Button>
						<Button
							colorScheme={config?.appearance?.globalTheme ?? "green"}
							onClick={() => exportXML()}
							isDisabled={!XML}>
							Export
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
