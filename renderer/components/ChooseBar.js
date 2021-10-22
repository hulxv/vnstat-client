import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuItemOption,
	MenuGroup,
	MenuOptionGroup,
	MenuIcon,
	MenuCommand,
	MenuDivider,
	Button,
	IconButton,
	Tooltip,
	Flex,
} from "@chakra-ui/react";
import { HiArrowSmDown, HiAdjustments } from "react-icons/hi";
import { BiExport } from "react-icons/bi";
import { useEffect, useState } from "react";
import ExportMenu from "./ExportMenu";
import { useRouter } from "next/dist/client/router";
export default function ChooseBar() {
	const pages = [
		{
			title: "today",
			path: "/today",
		},

		{
			title: "month",
			path: "/",
		},
		{
			title: "year",
			path: "/year",
		},
	];
	const router = useRouter();
	const [Page, setPage] = useState({
		title: toCapitalize(pages.find((e) => e.path === router.asPath)?.title),
		path: "/",
	});

	return (
		<Flex
			bgColor='#111513'
			justifyContent='space-between'
			alignItems='center'
			alignSelf='self'
			padding={6}
			shadow='2xl'
			rounded='2xl'
			width='95%'>
			<Flex>
				<Tooltip label='Settings'>
					<IconButton
						variant='ghost'
						colorScheme='whiteAlpha'
						textColor='whiteAlpha.900'
						icon={<HiAdjustments size='1.4em' />}
					/>
				</Tooltip>
				<ExportMenu />
			</Flex>
			<Menu>
				<MenuButton
					as={Button}
					rightIcon={<HiArrowSmDown />}
					colorScheme='green'>
					{Page.title}
				</MenuButton>
				<MenuList>
					{pages.map((page, index) => (
						<MenuItem
							key={index}
							onClick={() => {
								setPage({
									title: toCapitalize(page.title),
									path: page.path,
								});
								router.push(page.path);
							}}
							href={page.path}>
							{toCapitalize(page.title)}
						</MenuItem>
					))}
				</MenuList>
			</Menu>
		</Flex>
	);
}

function toCapitalize(str) {
	if (typeof str === "string") {
		let string = str.split(" ");
		let result = [];

		for (let i = 0; i < string.length; i++) {
			let _s =
				string[i][0].toUpperCase() + string[i].substr(1, string[i].length);
			result.push(_s);
		}
		return result.join(" ");
	}
	return "";
}
