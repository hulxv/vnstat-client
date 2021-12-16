import { useEffect, useState } from "react";
import router from "next/router";
import { useUsage } from "../../context/dataUsage";
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
	IconButton,
	Tooltip,
	Flex,
	Kbd,
	Box,
} from "@chakra-ui/react";
import { HiArrowSmDown, HiAdjustments, HiRefresh } from "react-icons/hi";

import Export from "../Export";
import Settings from "../Settings";

import CustomIntervalModal from "./CustomIntervalModal";

import { useConfig } from "@Context/configration";

export default function ChooseBar() {
	const { config } = useConfig();
	const [Page, setPage] = useState({
		title: "",
		path: "",
	});
	const [ModalIsOpen, setModalIsOpen] = useState(false);
	const { reloading } = useUsage();
	const pages = [
		{
			title: "day",
			path: "/day",
		},

		{
			title: "month",
			path: "/",
		},
		{
			title: "year",
			path: "/year",
		},
		{
			title: "Custom",
			path: "/custom/[from]/[to]",
			onClick: () => setModalIsOpen(!ModalIsOpen),
		},
	];

	useEffect(() => {
		setPage({
			title: toCapitalize(pages.find((e) => e.path === router.pathname)?.title),
			path: router.asPath || "/",
		});
	}, []);

	function PressKeyHandler(e) {
		if (e.key === "R" || e.key === "r") {
			console.log("Reloading...");
			reloading();
			router.replace(router.asPath);
		}
	}

	useEffect(() => {
		window.addEventListener("keydown", PressKeyHandler);

		return () => window.removeEventListener("keydown", PressKeyHandler); // Cleanup
	}, [PressKeyHandler]);

	// For debugging
	// useEffect(() => {
	// 	console.log(Page);
	// 	console.log(router.pathname, router.asPath);
	// }, [Page]);
	return (
		<>
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
						<Settings>
							<IconButton
								variant='ghost'
								colorScheme='whiteAlpha'
								textColor='whiteAlpha.900'
								icon={<HiAdjustments size='1.4em' />}
							/>
						</Settings>
					</Tooltip>
					<Export />
				</Flex>
				<Flex>
					<Box>
						<Kbd>R</Kbd>
						<Tooltip label='Refresh'>
							<IconButton
								icon={<HiRefresh size='1.4em' />}
								variant='ghost'
								colorScheme='whiteAlpha'
								textColor='whiteAlpha.900'
								mr={1}
								onClick={() => {
									reloading();
									router.replace(router.asPath);
								}}
							/>
						</Tooltip>
					</Box>

					<Menu>
						<Tooltip label='Interval'>
							<MenuButton
								as={Button}
								rightIcon={<HiArrowSmDown />}
								colorScheme={config?.apperance?.globalTheme}>
								{Page.title}
							</MenuButton>
						</Tooltip>
						<MenuList>
							{pages.map((page, index) => (
								<MenuItem
									key={index}
									onClick={() => {
										if (typeof page?.onClick !== "undefined") {
											page.onClick();
											return;
										}
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
			</Flex>
			<CustomIntervalModal
				ModalState={ModalIsOpen}
				setModalState={setModalIsOpen}
			/>
		</>
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
