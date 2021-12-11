import { Flex, Box } from "@chakra-ui/react";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

function Info() {
	const [infos, setInfos] = useState([]);
	useEffect(() => {
		ipcRenderer.send("get-infos");
		ipcRenderer.on("send-infos", (e, result) => {
			setInfos([...result]);
		});
	}, []);
	return (
		<Flex flexDir='column'>
			{infos.map((info, index) => (
				<div key={index}>
					{info?.name}: {info?.value}
				</div>
			))}
		</Flex>
	);
}

export default Info;
