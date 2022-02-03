import { useEffect, useState } from "react";
import router from "next/router";
import { toCapitalize } from "@Util";

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
	HStack,
} from "@chakra-ui/react";
import { HiArrowSmDown, HiAdjustments, HiRefresh } from "react-icons/hi";

import Export from "../Export";
import Settings from "../Settings";

import CustomIntervalModal from "./CustomIntervalModal";

import { useHotkeys } from "react-hotkeys-hook";
import { useVnStat } from "@Context/vnStat";
import { useConfig } from "@Context/configuration";

import NetworkStats from "@Context/network-stats";
import NetStats from "./NetStats";

export default function NavigationBar() {
	const { config, reloading: reloadConfigs } = useConfig();
	const { reloading: reloadingTrafficData } = useVnStat();

	const [Page, setPage] = useState({
		title: "",
		path: "",
	});
	const [ModalIsOpen, setModalIsOpen] = useState(false);
	const pages = [
		{
			title: "day",
			path: "/day",
		},
		{
			title: "week",
			path: "/week",
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

	useHotkeys("alt+r", () => {
		reloadConfigs();
		reloadingTrafficData();
		router.replace(router.asPath);
	});

	// ! For debugging
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
				<HStack spacing={1}>
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
					<NetworkStats>
						<NetStats />
					</NetworkStats>
				</HStack>
				<Flex>
					<HStack mr={1}>
						<Kbd>ALT</Kbd>
						<span style={{ color: "white" }}>+</span>
						<Kbd>R</Kbd>
						<Tooltip label='Refresh'>
							<IconButton
								icon={<HiRefresh size='1.4em' />}
								variant='ghost'
								colorScheme='whiteAlpha'
								textColor='whiteAlpha.900'
								mr={1}
								onClick={() => {
									reloadConfigs();
									reloadingTrafficData();

									router.replace(router.asPath);
								}}
							/>
						</Tooltip>
					</HStack>

					<Menu>
						<Tooltip label='Interval'>
							<MenuButton
								as={Button}
								rightIcon={<HiArrowSmDown />}
								colorScheme={config?.appearance?.globalTheme ?? "green"}>
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
