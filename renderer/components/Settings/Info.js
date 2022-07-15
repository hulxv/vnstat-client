import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

import {
	HStack,
	Tooltip,
	Stack,
	Button,
	Heading,
	IconButton,
	useToast,
} from "@chakra-ui/react";

import { useConfig } from "@Context/configuration";

import { HiArrowUp, HiArrowDown } from "react-icons/hi";

function Info() {
	const toast = useToast();
	const [showMoreInfo, setShowMoreInfo] = useState(false);

	const [informations, setInfos] = useState([]);
	const { config } = useConfig();
	useEffect(() => {
		if (ipcRenderer)
			ipcRenderer.invoke("get-infos").then(result => {
				setInfos(result);
			});
	}, []);
	// useEffect(() => {
	// 	console.debug(infos);
	// }, [infos]);
	return (
		<Stack spacing={4} alignSelf="center" align="center">
			<img
				src="/images/vnclient-icon.png"
				width="250"
				height="250"
				alt="vnStat Client Icon"
			/>
			<Heading size="md">
				{informations.find(info => info.name === "version")?.value}
			</Heading>
			<Button
				colorScheme={config?.appearance?.globalTheme ?? "green"}
				maxW={300}
				onClick={() => {
					if (ipcRenderer) ipcRenderer.send("check-for-updates");
				}}>
				Check for updates
			</Button>
			<Tooltip label="Open in Browser" hasArrow>
				<Button
					colorScheme={config?.appearance?.globalTheme ?? "green"}
					variant="link"
					onClick={() => {
						if (ipcRenderer)
							ipcRenderer.send(
								"open-url",
								"https://github.com/Hulxv/vnstat-client"
							);
					}}>
					Source Code
				</Button>
			</Tooltip>

			{informations.length > 0 && (
				<Tooltip
					hasArrow
					placement="top"
					label={`Show ${
						showMoreInfo ? "less" : "more"
					} information about vnStat`}>
					<IconButton
						variant="ghost"
						onClick={() => setShowMoreInfo(!showMoreInfo)}
						icon={showMoreInfo ? <HiArrowUp /> : <HiArrowDown />}
					/>
				</Tooltip>
			)}
			{showMoreInfo && (
				<HStack spacing={10} alignSelf="center">
					{informations
						.filter(info => info.name !== "version")
						.map((info, index) => (
							<Stack align="center" spacing={0.5} key={index}>
								<Heading size="xs" opacity="50%">
									{info?.name}
								</Heading>
								<Heading size="sm">{info?.value}</Heading>
							</Stack>
						))}
				</HStack>
			)}
		</Stack>
	);
}

export default Info;
