// Chakra UI components
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
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	AlertDialogCloseButton,
} from "@chakra-ui/react";

// Tabs Components
import General from "./General";
import VnStat from "./vnStat";
import Logs from "./Logs";
import Info from "./Info";
import Credits from "./Credits";

// Hooks
import { useRef } from "react";
import { useConfig } from "@Context/configration";
import { useVnStat } from "@Context/vnStat";
import { useHotkeys } from "react-hotkeys-hook";

export default function Settings({ children }) {
	const cancelRef = useRef();

	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: isAlertDialogOpen,
		onOpen: onAlertDialogOpen,
		onClose: onAlertDialogClose,
	} = useDisclosure();

	const { isConfigChanged, resetVnConfigs, saveChanges } = useVnStat();
	const { config } = useConfig();

	useHotkeys("shift+s", onOpen);

	return (
		<>
			<div onClick={onOpen}>{children}</div>

			<Modal
				h='full'
				scrollBehavior='inside'
				isOpen={isOpen}
				size='3xl'
				onClose={() => {
					resetVnConfigs();
					onClose();
				}}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Settings {"&"} Configuration</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Tabs size='md' variant='enclosed'>
							<TabList>
								<Tab>General</Tab>
								<Tab>vnStat</Tab>
								<Tab>Logs</Tab>
								<Tab>Info</Tab>
								<Tab>Credits</Tab>
							</TabList>
							<TabPanels>
								<TabPanel>
									<General />
								</TabPanel>
								<TabPanel>
									<VnStat />
								</TabPanel>
								<TabPanel>
									<Logs />
								</TabPanel>
								<TabPanel>
									<Info />
								</TabPanel>

								<TabPanel>
									<Credits />
								</TabPanel>
							</TabPanels>
						</Tabs>
					</ModalBody>

					<ModalFooter>
						<Button
							variant='ghost'
							mx={1}
							onClick={() => {
								resetVnConfigs();
								onClose();
							}}>
							Close
						</Button>
						<Button
							isDisabled={!isConfigChanged} // * Enabled only when configs is changing
							onClick={onAlertDialogOpen}
							colorScheme={config?.apperance?.globalTheme}
							mr={3}>
							Save Changes
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<AlertDialog
				motionPreset='slideInBottom'
				onClose={onAlertDialogClose}
				isOpen={isAlertDialogOpen}
				isCentered>
				<AlertDialogOverlay />

				<AlertDialogContent>
					<AlertDialogHeader>Save Changes?</AlertDialogHeader>
					<AlertDialogCloseButton />
					<AlertDialogBody>
						Are you sure you want to changes for vnStat configrations ?
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button onClick={onAlertDialogClose}>Cancel</Button>
						<Button
							colorScheme={config?.apperance?.globalTheme}
							ml={3}
							onClick={() => {
								saveChanges();
								onAlertDialogClose();
							}}>
							Save
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
