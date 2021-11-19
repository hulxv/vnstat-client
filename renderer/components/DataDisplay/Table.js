import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
} from "@chakra-ui/react";
import { isYesterday } from "date-fns";

function TableComponent({ data }) {
	console.log(data);
	return (
		<Table variant='striped'>
			<Thead>
				<Tr>
					<Th>Date</Th>
					<Th>interface</Th>
					<Th>Download{"(MB)"}</Th>
					<Th>Upload{"(MB)"}</Th>
				</Tr>
			</Thead>
			<Tbody>
				{data.map((traffic) => (
					<Tr>
						<Td>{traffic.date}</Td>
						<Td>{traffic.interface ?? "-"}</Td>
						<Td>{traffic.rx?.toFixed(2)}</Td>
						<Td>{traffic.tx?.toFixed(2)}</Td>
					</Tr>
				))}
			</Tbody>
			<Tr>
				<Th>Date</Th>
				<Th>interface</Th>
				<Th>Download{"(MB)"}</Th>
				<Th>Upload{"(MB)"}</Th>
			</Tr>
		</Table>
	);
}

export default TableComponent;
