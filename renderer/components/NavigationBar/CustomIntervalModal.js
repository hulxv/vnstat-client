import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	useDisclosure,
	Box,
	Flex,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getDate } from "date-fns";

import "@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css";
import { Calendar, utils } from "@amir04lm26/react-modern-calendar-date-picker";

export default function CustomIntervalModal({
	children,
	ModalState,
	setModalState,
}) {
	const router = useRouter();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedDayRange, setSelectedDayRange] = useState({
		from: null,
		to: null,
	});

	return (
		<>
			<Box onClick={onOpen} w='full'>
				{children}
			</Box>

			<Modal
				isOpen={ModalState || isOpen}
				onClose={() => {
					setModalState(false);
					onClose();
				}}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Custom Interval</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex w='full' align='center' justify='center'>
							<Calendar
								value={selectedDayRange}
								onChange={setSelectedDayRange}
								maximumDate={utils().getToday()}
							/>
						</Flex>
					</ModalBody>

					<ModalFooter>
						<Button
							variant='ghost'
							mr={3}
							onClick={() => {
								setModalState(false);
								onClose();
							}}>
							Close
						</Button>
						<Button
							colorScheme='green'
							isDisabled={
								selectedDayRange.to === null || selectedDayRange.from === null
							}
							onClick={() => {
								const { to, from } = selectedDayRange;
								if (to !== null && from !== null) {
									const path = `/custom/${from.year}-${from.month}-${from.day}/${to.year}-${to.month}-${to.day}`;
									router.push(path);
								}
							}}>
							Go
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
