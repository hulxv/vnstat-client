import dynamic from "next/dynamic";
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
} from "@chakra-ui/react";

import { useConfig } from "@Context/configuration";
import { useNetStats } from "@Context/network-stats";
import { ipcRenderer } from "electron";

const JsonViewer = dynamic(import("react-json-view"), { ssr: false });

export default function ExportAsJsonModal({ isOpen, onClose, onOpen }) {
	const { config } = useConfig();

	const { recordedNetworkStats } = useNetStats();

	function exportAsJSON() {
		ipcRenderer.send("export-to-file", {
			data: recordedNetworkStats,
			ext: "json",
		});
	}
	return (
		<>
			<Modal
				isOpen={isOpen}
				scrollBehavior='inside'
				onClose={() => {
					onClose();
					setJson({});
				}}
				size='xl'>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Export Network Statistics Records as JSON</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Stack>
							<JsonViewer collapsed={2} src={recordedNetworkStats} />
						</Stack>
					</ModalBody>

					<ModalFooter>
						<Button variant='ghost' mr={3} onClick={onClose}>
							Close
						</Button>
						<Button
							colorScheme={config?.appearance?.globalTheme ?? "green"}
							onClick={() => exportAsJSON()}>
							Export
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
