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
} from "@chakra-ui/react";

import { HiTrash, HiRefresh, HiOutlineInformationCircle } from "react-icons/hi";

function Logs() {
	const [logs, setLogs] = useState({ path: "", lines: [] });
	const [isLoading, setIsLoading] = useState(false);

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

	return (
		<>
			<Flex w='full' justify='space-between' my={3}>
				<Box>
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
				</Box>

				<Box>
					<Button leftIcon={<HiRefresh />} onClick={() => getLogs()} mx={2}>
						Refresh
					</Button>
					<Button
						leftIcon={<HiTrash />}
						colorScheme='red'
						onClick={() => clearLogs()}>
						Clear All
					</Button>
				</Box>
			</Flex>
			<div>
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
						return (
							<Alert my={1} status={status === "warn" ? "warning" : status}>
								<AlertIcon />
								<AlertTitle mr={2}>{date}</AlertTitle>

								<AlertDescription>
									{msg.replace(/\[(.*?)\]/g, "")}
								</AlertDescription>
							</Alert>
						);
					})
				)}
			</div>
		</>
	);
}

export default Logs;
