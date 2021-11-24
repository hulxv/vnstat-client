import { Flex, Box } from "@chakra-ui/react";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

function Info() {
	const [infos, setInfos] = useState([
		{ name: "client-version", value: process.env.npm_package_version },
		{ name: "License", value: process.env.npm_package_license },
		{ name: "Author", value: `${process.env.npm_package_author_name}` },
	]);
	useEffect(() => {
		console.log("getting infos...");
		ipcRenderer.send("get-vnstat-infos");
		ipcRenderer.on("send-vnstat-infos", (e, result) => {
			setInfos([...infos, ...result]);
			console.log(result);
			console.log(infos);
		});
		console.log(process.env);
	}, []);
	return (
		<Flex flexDir='column'>
			{infos.map((info, index) => (
				<div key={index}>
					{info?.name} : {info?.value}
				</div>
			))}
		</Flex>
	);
}

export default Info;
