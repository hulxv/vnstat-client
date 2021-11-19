import { ipcRenderer } from "electron";
import { useState, useEffect } from "react";

import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
} from "@chakra-ui/react";
function Logs() {
	const [logs, setLogs] = useState([]);
	useEffect(() => {
		ipcRenderer.send("get-logs");
		ipcRenderer.on("send-logs", (e, res) => {
			setLogs({ ...res });
		});
	}, []);

	return (
		<div>
			<div>
				Logs stored in{" "}
				<span style={{ fontWeight: "bold" }}>{logs[0]?.path}</span>
			</div>
			<div>
				{logs[0]?.lines.reverse().map((msg) => {
					if (!msg) return <></>;
					let matching = msg.match(/\[(.*?)\]/g);

					let status =
						matching !== null
							? matching[1].replace(/\[/g, "").replace(/\]/g, "")
							: "info";
					return (
						<Alert my={1} status={status === "warn" ? "warning" : status}>
							<AlertIcon />

							<AlertDescription>
								{msg.replace(matching !== null && matching[1], "")}
							</AlertDescription>
						</Alert>
					);
				})}
			</div>
		</div>
	);
}

export default Logs;
