import { lazy, Suspense } from "react";
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
import { invoke } from "@tauri-apps/api/core";
import { useConfig } from "@Context/configuration";
import { useNetStats } from "@Context/network-stats";

const JsonViewer = lazy(() => import("react-json-view"));

export default function ExportAsJsonModal({ isOpen, onClose }) {
	const { config } = useConfig();
	const { recordedNetworkStats } = useNetStats();

	async function exportAsJSON() {
		try {
			await invoke("export_to_file", {
				data: JSON.stringify(recordedNetworkStats),
				ext: "json",
			});
		} catch (err) {
			console.error("export_to_file failed:", err);
		}
	}

	return (
		<Modal isOpen={isOpen} scrollBehavior='inside' onClose={onClose} size='xl'>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Export Network Statistics Records as JSON</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Stack>
						<Suspense fallback={null}>
							<JsonViewer collapsed={2} src={recordedNetworkStats} />
						</Suspense>
					</Stack>
				</ModalBody>
				<ModalFooter>
					<Button variant='ghost' mr={3} onClick={onClose}>Close</Button>
					<Button colorScheme={config?.appearance?.globalTheme ?? "green"} onClick={exportAsJSON}>Export</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
