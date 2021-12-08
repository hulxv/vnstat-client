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
} from "@chakra-ui/react";

// Tabs Components
import General from "./General";
import VnStat from "./vnStat";
import Logs from "./Logs";
import Info from "./Info";
import Credits from "./Credits";

import { useConfig } from "../../context/configration";

export default function Settings({ children }) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const { config } = useConfig();

	return (
		<>
			<div onClick={onOpen}>{children}</div>

			<Modal
				h='full'
				scrollBehavior='inside'
				isOpen={isOpen}
				size='3xl'
				onClose={onClose}>
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
						<Button variant='ghost' mx={1} onClick={onClose}>
							Close
						</Button>
						<Button colorScheme={config?.apperance?.globalTheme} mr={3}>
							Save Changes
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
