import { Stack, Button, Heading } from "@chakra-ui/react";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import { useConfig } from "@Context/configuration";
function Info() {
	const [infos, setInfos] = useState([]);
	const { config } = useConfig();
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
			<Button
				colorScheme={config?.appearance?.globalTheme ?? "green"}
				maxW={300}
				alignSelf='center'
				onClick={() => {
					console.log("h");
					if (ipcRenderer) ipcRenderer.send("check-for-updates");
				}}>
				Check for updates
			</Button>
		</Stack>
	);
}

export default Info;
