import { Flex, Box, Tooltip, Heading, List, ListItem } from "@chakra-ui/react";
import { ipcRenderer } from "electron";
import {
	AiFillFacebook,
	AiFillGithub,
	AiOutlineLink,
	AiOutlineMail,
	AiOutlineInfoCircle,
} from "react-icons/ai";

function Credits() {
	const __credits = [
		{
			username: process.env.npm_package_author_email,
			icon: <AiOutlineMail size='1.6em' />,
			link: "",
			site: "email",
			openInBrowser: false,
		},
		{
			username: "Mohamed Emad",
			icon: <AiFillFacebook size='1.6em' />,
			link: "https://www.facebook.com/hulxv/",
			site: "facebook",
			openInBrowser: true,
		},
		{
			username: "Hulxv",
			icon: <AiFillGithub size='1.6em' />,
			link: "https://github.com/Hulxv",
			site: "github",
			openInBrowser: true,
		},
		{
			username: "vergoh (vnstat's Developer)",
			icon: <AiFillGithub size='1.6em' />,
			link: "https://github.com/vergoh",
			site: "github",
			openInBrowser: true,
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
						{acc.username}
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
