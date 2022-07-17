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
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const { config } = useConfig();

	const [selectedTable, setSelectedTable] = useState("");

	const [tableList, setTableList] = useState([]);
	const [data, setData] = useState([]);

	useEffect(() => {
		isOpen &&
			ipcRenderer &&
			ipcRenderer
				.invoke("get-vnstat-database-tables-list")
				.then(list => setTableList(list));
	}, [isOpen]);

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
		ipcRenderer
			.invoke("get-vnstat-database-table-data", table)
			.then(res => setData(res));
	}
	return (
		<>
			<Box onClick={onOpen} fontSize="xl" w="full">
				CSV
			</Box>

			<Modal
				isOpen={isOpen}
				scrollBehavior="inside"
				onClose={() => {
					onClose();
				}}
				size="5xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Export as CSV</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex flexDir="column">
							<Select
								variant="filled"
								m="10px"
								placeholder="table"
								textTransform="capitalize"
								alignSelf="center"
								value={selectedTable}
								onChange={e => {
									setSelectedTable(e.target.value);

									getTableData(e.target.value);
								}}>
								{tableList.map((table, index) => (
									<option
										key={index}
										style={{ textTransform: "capitalize" }}>
										{table}
									</option>
								))}
							</Select>
							{!(data.length > 0) ? (
								<Box>Choose a table</Box>
							) : (
								<Table variant="simple">
									<TableCaption>Export Output</TableCaption>
									<Thead>
										<Tr>
											{Object.keys(data[0]).map(
												(e, index) => (
													<Th key={index}>{e}</Th>
												)
											)}
										</Tr>
									</Thead>
									<Tbody>
										{data.map((row, index) => (
											<Tr key={index}>
												{Object.keys(row).map(
													(e, index) => (
														<Td key={index}>
															{row[e]}
														</Td>
													)
												)}
											</Tr>
										))}
									</Tbody>
									<Tfoot>
										<Tr>
											{Object.keys(data[0]).map(
												(e, index) => (
													<Th key={index}>{e}</Th>
												)
											)}
										</Tr>
									</Tfoot>
								</Table>
							)}
						</Flex>
					</ModalBody>

					<ModalFooter>
						<Button
							variant="ghost"
							mr={3}
							onClick={() => {
								onClose();
							}}>
							Close
						</Button>
						<Button
							colorScheme={
								config?.appearance?.globalTheme ?? "green"
							}
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
