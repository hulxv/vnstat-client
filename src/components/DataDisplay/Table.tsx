import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

/** A prepared traffic row (MB). `interface` is present only for raw db rows. */
export interface TableRow {
	date: string;
	rx: number;
	tx: number;
	interface?: number;
}

function formatUsage(value: number): string {
	if (value === 0) return "-";
	return value > 1024
		? `${(value / 1024).toFixed(2)} GB`
		: `${value.toFixed(2)} MB`;
}

function TableComponent({ data }: { data: TableRow[] }) {
	return (
		<Table variant='striped'>
			<Thead>
				<Tr>
					<Th>Date / Time</Th>
					<Th>interface</Th>
					<Th isNumeric>Total</Th>
					<Th isNumeric>Download</Th>
					<Th isNumeric>Upload</Th>
				</Tr>
			</Thead>
			<Tbody>
				{data.map((traffic, index) => (
					<Tr key={index}>
						<Td>{traffic.date}</Td>
						<Td>{traffic.interface ?? "-"}</Td>
						<Td isNumeric>{formatUsage(traffic.rx + traffic.tx)}</Td>
						<Td isNumeric>{formatUsage(traffic.rx)}</Td>
						<Td isNumeric>{formatUsage(traffic.tx)}</Td>{" "}
					</Tr>
				))}
			</Tbody>
			<Tr>
				<Th>Date</Th>
				<Th>interface</Th>
				<Th>Total</Th>

				<Th>Download</Th>
				<Th>Upload</Th>
			</Tr>
		</Table>
	);
}

export default TableComponent;
