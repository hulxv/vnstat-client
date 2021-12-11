import { ipcRenderer } from "electron";
import { useState, useEffect, useCallback } from "react";

import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Button,
	IconButton,
	Box,
	Tooltip,
	Flex,
	Spinner,
	HStack,
	Stack,
	Input,
	InputRightElement,
	InputGroup,
} from "@chakra-ui/react";

import {
	HiTrash,
	HiRefresh,
	HiOutlineInformationCircle,
	HiSearch,
} from "react-icons/hi";
import { useLogs } from "../../context/logs";

function Logs() {
	const { logs, GetLogs, ClearLogs, isLoading } = useLogs();

	const [search, setSearch] = useState({ bool: false, value: "" });

	useEffect(() => GetLogs(), []);

	useEffect(() => console.log("search update to", search), [search]); // For Debugging
	// useEffect(() => console.log("logs update to", logs), [logs]); // For Debugging

	return (
		<>
			<Flex w='full' justify='space-between' my={3}>
				<Tooltip
					hasArrow
					placement='right'
					label={`Logs stored in ${logs.path}`}>
					<IconButton
						variant='ghost'
						cursor='default'
						icon={<HiOutlineInformationCircle size='1.3em' />}
					/>
				</Tooltip>

				<HStack justify='end' spacing={3}>
					{search.bool ? (
						<InputGroup w='300px'>
							<Input
								placeholder='Search'
								variant='filled'
								onChange={(e) =>
									setSearch({ ...search, value: e.target.value })
								}
							/>
							<InputRightElement>
								<IconButton
									variant='none'
									icon={<HiSearch size='1.4em' />}
									onClick={() => setSearch({ ...search, bool: !search.bool })}
								/>
							</InputRightElement>
						</InputGroup>
					) : (
						<Tooltip label='Search in logs'>
							<IconButton
								variant='ghost'
								icon={<HiSearch size='1.4em' />}
								onClick={() => setSearch({ ...search, bool: !search.bool })}
							/>
						</Tooltip>
					)}

					<Button leftIcon={<HiRefresh />} onClick={() => GetLogs()}>
						Refresh
					</Button>
					<Button
						leftIcon={<HiTrash />}
						colorScheme='red'
						onClick={() => ClearLogs()}>
						Clear All
					</Button>
				</HStack>
			</Flex>
			<Stack spacing={1}>
				{isLoading ? (
					<Flex my={3} w='full' h='full' align='center' justify='center'>
						<Spinner size='xl' color='green' />
					</Flex>
				) : logs?.lines.length <= 0 ? (
					<div>No logs found</div>
				) : (
					logs?.lines.map((msg) => {
						if (
							search.bool &&
							msg.content.toLowerCase().search(search.value.toLowerCase()) ===
								-1
						)
							return;
						return (
							<Alert status={msg.status === "warn" ? "warning" : msg.status}>
								<AlertIcon />
								<AlertTitle mr={2}>{msg.date}</AlertTitle>

								<AlertDescription>{msg.content}</AlertDescription>
							</Alert>
						);
					})
				)}
			</Stack>
		</>
	);
}

export default Logs;
