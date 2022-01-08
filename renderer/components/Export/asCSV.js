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
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableCaption,
	Tfoot,
} from "@chakra-ui/react";
import { ipcRenderer } from "electron";

// Hooks
import { useState, useEffect } from "react";
import { useConfig } from "@Context/configuration";
import { useVnStat } from "@Context/vnStat";

export default function AsCSV() {
	const { config } = useConfig();
	const { databaseTablesList } = useVnStat();

	const [selectedTable, setSelectedTable] = useState("");
	const [data, setData] = useState([]);

	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		ipcRenderer.on("send-vnstat-database-table-data", (e, data) => {
			setData(data);
		});
		return () => {
			ipcRenderer.removeAllListeners("send-vnstat-database-table-data");
		};
	}, []);

	function exportAsCSV() {
		if (selectedTable) {
			ipcRenderer.send("export-as-csv", selectedTable);
			return;
		}
		toast({
			description: "You should choose a table !",
			status: "error",
			isClosable: true,
			position: "top",
		});
	}

	function getTableData(table) {
		ipcRenderer.send("get-vnstat-database-table-data", table);
	}
	return (
		<>
			<Box onClick={onOpen} fontSize='xl' variant='ghost' w='full'>
				CSV
			</Box>

			<Modal
				isOpen={isOpen}
				scrollBehavior='inside'
				onClose={() => {
					onClose();
				}}
				size='5xl'>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Export as CSV</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex flexDir='column'>
							<Select
								variant='filled'
								m='10px'
								placeholder='table'
								textTransform='capitalize'
								alignSelf='center'
								value={selectedTable}
								onChange={(e) => {
									setSelectedTable(e.target.value);

									getTableData(e.target.value);
								}}>
								{databaseTablesList.map((table, index) => (
									<option key={index} style={{ textTransform: "capitalize" }}>
										{table}
									</option>
								))}
							</Select>
							{!(data.length > 0) ? (
								<Box>Choose a table</Box>
							) : (
								<Table variant='simple'>
									<TableCaption>Export Output</TableCaption>
									<Thead>
										<Tr>
											{Object.keys(data[0]).map((e) => (
												<Th>{e}</Th>
											))}
										</Tr>
									</Thead>
									<Tbody>
										{data.map((row) => (
											<Tr>
												{Object.keys(row).map((e) => (
													<Td>{row[e]}</Td>
												))}
											</Tr>
										))}
									</Tbody>
									<Tfoot>
										<Tr>
											{Object.keys(data[0]).map((e) => (
												<Th>{e}</Th>
											))}
										</Tr>
									</Tfoot>
								</Table>
							)}
						</Flex>
					</ModalBody>

					<ModalFooter>
						<Button
							variant='ghost'
							mr={3}
							onClick={() => {
								onClose();
							}}>
							Close
						</Button>
						<Button
							colorScheme={config?.appearance?.globalTheme ?? "green"}
							onClick={() => exportAsCSV()}
							isDisabled={!selectedTable}>
							Export
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
