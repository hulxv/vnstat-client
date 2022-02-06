import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

function TableComponent({ data }) {
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
						<Td isNumeric>
							{traffic.rx + traffic.tx === 0
								? "-"
								: (traffic.rx + traffic.tx)?.toFixed(2) > 1024
								? ((traffic.rx + traffic.tx) / 1024)?.toFixed(2) + " GB"
								: (traffic.rx + traffic.tx)?.toFixed(2) + " MB"}
						</Td>
						<Td isNumeric>
							{traffic.rx + traffic.tx === 0
								? "-"
								: traffic.rx?.toFixed(2) > 1024
								? (traffic.rx / 1024)?.toFixed(2) + " GB"
								: traffic.rx?.toFixed(2) + " MB"}
						</Td>
						<Td isNumeric>
							{traffic.tx === 0
								? "-"
								: traffic.tx?.toFixed(2) > 1024
								? (traffic.tx / 1024)?.toFixed(2) + " GB"
								: traffic.tx?.toFixed(2) + " MB"}
						</Td>{" "}
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
