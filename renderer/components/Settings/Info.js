import { Stack, Box, Heading } from "@chakra-ui/react";
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
		<Stack spacing={4}>
			{infos.map((info, index) => (
				<Stack spacing={0.5} key={index}>
					<Heading size='xs' opacity='50%'>
						{info?.name}
					</Heading>
					<Heading size='sm'>{info?.value}</Heading>
				</Stack>
			))}
		</Stack>
	);
}

export default Info;
