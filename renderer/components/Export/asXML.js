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
} from "@chakra-ui/react";

export default function BasicUsage() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<Box onClick={onOpen} fontSize='xl' variant='ghost' w='full'>
				XML
			</Box>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Export as XML</ModalHeader>
					<ModalCloseButton />
					<ModalBody></ModalBody>

					<ModalFooter>
						<Button variant='ghost' mr={3} onClick={onClose}>
							Close
						</Button>
						<Button colorScheme='blue'>Export</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
