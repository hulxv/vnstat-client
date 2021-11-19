import { ipcRenderer } from "electron";
import { useState, useEffect, useCallback } from "react";

import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Button,
	Flex,
	Spinner,
} from "@chakra-ui/react";

import { HiTrash, HiRefresh } from "react-icons/hi";

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
	}, []);

	const clearLogs = () => {
		setIsLoading(true);
		ipcRenderer.send("clear-logs");
		ipcRenderer.on("send-logs", (e, res) => {
			setLogs({ ...res[0] });
			setIsLoading(false);
		});
	};

	useEffect(() => {
		getLogs();
	}, []);

	return (
		<>
			<div>
				Logs stored in <span style={{ fontWeight: "bold" }}>{logs.path}</span>
			</div>
			<Flex w='full' justify='end' my={3}>
				<Button leftIcon={<HiRefresh />} onClick={() => getLogs()} mx={2}>
					Refresh
				</Button>
				<Button
					leftIcon={<HiTrash />}
					colorScheme='red'
					onClick={() => clearLogs()}>
					Clear All
				</Button>
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
