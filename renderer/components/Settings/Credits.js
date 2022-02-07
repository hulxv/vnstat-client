import { Flex, Box, Tooltip, Heading, List, ListItem } from "@chakra-ui/react";
import { ipcRenderer } from "electron";
import { AiFillGithub, AiOutlineLink } from "react-icons/ai";

function Credits() {
	const __credits = [
		{
			username: "Hulxv",
			icon: <AiFillGithub size='1.6em' />,
			link: "https://github.com/Hulxv",
			site: "github",
			openInBrowser: true,
			tip: "Client's Developer",
		},
		{
			username: "vergoh",
			icon: <AiFillGithub size='1.6em' />,
			link: "https://github.com/vergoh",
			site: "github",
			openInBrowser: true,
			tip: "vnStat's Developer",
		},
	];

	return (
		<Flex flexDir='column'>
			{__credits.map((acc, index) => (
				<Flex
					key={index}
					align='center'
					cursor={acc.openInBrowser ? "pointer" : ""}
					mb={2}
					w='max-content'
					onClick={() => {
						ipcRenderer && ipcRenderer.send("open-url", acc.link);
					}}>
					<Tooltip label={acc.site} textTransform='capitalize'>
						<Box>{acc.icon}</Box>
					</Tooltip>
					<Box
						_hover={{ textDecoration: acc.openInBrowser ? "underline" : "" }}
						mx={1}>
						<Tooltip placement='right' hasArrow label={acc?.tip}>
							{acc.username}
						</Tooltip>
					</Box>
					{acc.openInBrowser && (
						<Tooltip placement='right' hasArrow label='Open in browser'>
							<Box cursor='pointer'>
								<AiOutlineLink />
							</Box>
						</Tooltip>
					)}
				</Flex>
			))}
		</Flex>
	);
}

export default Credits;
