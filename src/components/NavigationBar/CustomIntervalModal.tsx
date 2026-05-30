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

import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useConfig } from "@Context/configuration";

import {
	Calendar,
	utils,
	type DayRange,
} from "@amir04lm26/react-modern-calendar-date-picker";

import "@amir04lm26/react-modern-calendar-date-picker/lib/DatePicker.css";

interface CustomIntervalModalProps {
	children?: ReactNode;
	ModalState: boolean;
	setModalState: (open: boolean) => void;
}

export default function CustomIntervalModal({
	children,
	ModalState,
	setModalState,
}: CustomIntervalModalProps) {
	const navigate = useNavigate();
	const { config } = useConfig();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [selectedDayRange, setSelectedDayRange] = useState<DayRange>({
		from: null,
		to: null,
	});

	return (
		<>
			<Box onClick={onOpen} w="full">
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
						<Flex w="full" align="center" justify="center">
							<Calendar
								value={selectedDayRange}
								onChange={setSelectedDayRange}
								maximumDate={utils("en").getToday()}
							/>
						</Flex>
					</ModalBody>

					<ModalFooter>
						<Button
							variant="ghost"
							mr={3}
							onClick={() => {
								setModalState(false);
								onClose();
							}}>
							Close
						</Button>
						<Button
							colorScheme={
								config?.appearance?.globalTheme ?? "green"
							}
							isDisabled={
								selectedDayRange.to === null ||
								selectedDayRange.from === null
							}
							onClick={() => {
								const { to, from } = selectedDayRange;
								if (from && to) {
									const path = `/custom/${from.year}-${from.month}-${from.day}/${to.year}-${to.month}-${to.day}`;
									navigate(path);
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
