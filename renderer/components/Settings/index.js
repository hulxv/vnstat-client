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

export default function Settings({ children }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<div onClick={onOpen}>{children}</div>

			<Modal isOpen={isOpen} size='xl' onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Settings {"&"} Configuration</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Tabs size='md' variant='enclosed'>
							<TabList>
								<Tab>Apperance</Tab>
								<Tab>Configuration</Tab>
								<Tab>Logs</Tab>
								<Tab>About</Tab>
							</TabList>
							<TabPanels>
								<TabPanel>Apperance</TabPanel>
								<TabPanel>Configuration</TabPanel>
								<TabPanel>Logs</TabPanel>
								<TabPanel>About</TabPanel>
							</TabPanels>
						</Tabs>
					</ModalBody>

					<ModalFooter>
						<Button variant='ghost' mx={1} onClick={onClose}>
							Close
						</Button>
						<Button colorScheme='blue' mr={3}>
							Save Changes
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
