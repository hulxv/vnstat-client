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
import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import { useConfig } from "@Context/configuration";
import type { TrafficData, TrafficEntry } from "@Types";

export default function AsCSV() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const { config } = useConfig();

	const [selectedTable, setSelectedTable] = useState("");
	const [tableList] = useState(["day", "hour", "month"]);
	const [data, setData] = useState<TrafficEntry[]>([]);

	async function exportAsCSV() {
		if (!selectedTable) {
			toast({
				description: "You should choose a table!",
				status: "error",
				isClosable: true,
				position: "top",
			});
			return;
		}
		try {
			await invoke("export_as_csv", { table: selectedTable });
		} catch (err) {
			toast({
				description: String(err),
				status: "error",
				position: "top",
			});
		}
	}

	async function getTableData(table: string) {
		try {
			const result = await invoke<TrafficData>("get_traffic");
			const map: Record<string, TrafficEntry[]> = {
				day: result.month,
				hour: result.day,
				month: result.year,
			};
			setData(map[table] ?? []);
		} catch (err) {
			console.error("get_traffic failed:", err);
		}
	}

	return (
		<>
			<Box onClick={onOpen} fontSize="xl" w="full">
				CSV
			</Box>

			<Modal
				isOpen={isOpen}
				scrollBehavior="inside"
				onClose={onClose}
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
							{data.length === 0 ? (
								<Box>Choose a table</Box>
							) : (
								<Table variant="simple">
									<TableCaption>Export Output</TableCaption>
									<Thead>
										<Tr>
											{Object.keys(data[0]).map(
												(e, i) => (
													<Th key={i}>{e}</Th>
												)
											)}
										</Tr>
									</Thead>
									<Tbody>
										{data.map((row, i) => (
											<Tr key={i}>
												{Object.values(row).map(
													(v, j) => (
														<Td key={j}>
															{String(v)}
														</Td>
													)
												)}
											</Tr>
										))}
									</Tbody>
									<Tfoot>
										<Tr>
											{Object.keys(data[0]).map(
												(e, i) => (
													<Th key={i}>{e}</Th>
												)
											)}
										</Tr>
									</Tfoot>
								</Table>
							)}
						</Flex>
					</ModalBody>
					<ModalFooter>
						<Button variant="ghost" mr={3} onClick={onClose}>
							Close
						</Button>
						<Button
							colorScheme={
								config?.appearance?.globalTheme ?? "green"
							}
							onClick={exportAsCSV}
							isDisabled={!selectedTable}>
							Export
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
