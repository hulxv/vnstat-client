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

function Logs() {
	const [logs, setLogs] = useState({ path: "", lines: [] });
	const [isLoading, setIsLoading] = useState(false);
	const [search, setSearch] = useState({ bool: false, value: "" });

	const getLogs = useCallback(() => {
		setIsLoading(true);
		ipcRenderer.send("get-logs");
		ipcRenderer.on("send-logs", (e, res) => {
			setLogs({ ...res["0"], lines: [...res["0"].lines].reverse() });
			setIsLoading(false);
		});
		return () => ipcRenderer.removeAllListeners("send-logs");
	}, []);

	const clearLogs = useCallback(() => {
		setIsLoading(true);
		ipcRenderer.send("clear-logs");

		ipcRenderer.on("send-logs", (e, res) => {
			setLogs({ ...res[0] });
			setIsLoading(false);
		});
	}, []);

	useEffect(() => {
		getLogs();
	}, []);

	useEffect(() => console.log(search));

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
								value={search.value}
								onChange={(e) =>
									setSearch({ ...search, value: e.target.value })
								}
							/>
							<InputRightElement>
								<IconButton
									variant='ghost'
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

					<Button leftIcon={<HiRefresh />} onClick={() => getLogs()}>
						Refresh
					</Button>
					<Button
						leftIcon={<HiTrash />}
						colorScheme='red'
						onClick={() => clearLogs()}>
						Clear All
					</Button>
				</HStack>
			</Flex>
			<Stack spacing={1}>
				{isLoading ? (
					<Flex my={3} w='full' h='full' align='center' justify='center'>
						<Spinner size='xl' color='green' />
					</Flex>
				) : logs?.lines.filter((line) => line && line).length <= 0 ? (
					<div>No logs found</div>
				) : (
					logs?.lines.map((msg) => {
						if (!msg) return <></>;
						let matching = msg.match(/\[(.*?)\]/g);

						let status =
							matching !== null
								? matching[1].replace(/\[/g, "").replace(/\]/g, "")
								: "info";
						let date =
							matching !== null &&
							matching[0].replace(/\[/g, "").replace(/\]/g, "");

						if (search.bool) {
							if (
								!msg
									.replace(/\[(.*?)\]/gi, "")
									.toLowerCase()
									.startsWith(search.value.toLowerCase())
							)
								return;
						}

						return (
							<Alert status={status === "warn" ? "warning" : status}>
								<AlertIcon />
								<AlertTitle mr={2}>{date}</AlertTitle>

								<AlertDescription>
									{msg.replace(/\[(.*?)\]/g, "")}
								</AlertDescription>
							</Alert>
						);
					})
				)}
			</Stack>
		</>
	);
}

export default Logs;
