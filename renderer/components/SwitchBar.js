import { format, subDays, subMonths, subYears } from "date-fns";

import {
	Box,
	Flex,
	Button,
	Heading,
	IconButton,
	Tooltip,
} from "@chakra-ui/react";

import { GrPowerReset } from "react-icons/gr";

import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { useEffect } from "react";
// import { useHotkeys } from "react-hotkeys-hook";

export default function SwitchBar({
	state,
	setState,
	dateFormat,
	interval,
	canGoToPrevious = false,
	canGoToNext = false,
	title,
	canReset = true,
}) {
	const subs = {
		year: () => subYears(new Date(), state),
		month: () => subMonths(new Date(), state),
		day: () => subDays(new Date(), state),
	};

	function ArrowPressHandler(e) {
		switch (e.key) {
			case "ArrowLeft":
				if (canGoToPrevious) setTimeout(() => setState(state + 1), 10);
				break;
			case "ArrowRight":
				if (canGoToNext) setTimeout(() => setState(state - 1), 10);
				break;
			default:
				break;
		}
	}
	useEffect(() => {
		window.addEventListener("keydown", ArrowPressHandler);

		return () => window.removeEventListener("keydown", ArrowPressHandler); // Cleanup
	}, [ArrowPressHandler]);

	/*
	function GoToPrevious() {
		console.log(`(${state}) Prev ${canGoToPrevious}`);

		if (canGoToPrevious) setTimeout(() => setState(state + 1), 10);
	}
	function GoToNext() {
		console.log(`(${state}) Next ${canGoToNext}`);
		if (canGoToNext) setTimeout(() => setState(state - 1), 10);
	}
	useHotkeys("left", GoToPrevious);
	useHotkeys("right", GoToNext);
	*/

	return (
		<Flex justify='space-around' w='full' mb={4}>
			<Box w='30px'>
				{canGoToPrevious && (
					<Tooltip label='Previous'>
						<IconButton
							variant='ghost'
							icon={<HiArrowLeft size='1.4em' />}
							onClick={() => setState(state + 1)}
						/>
					</Tooltip>
				)}
			</Box>
			<Flex flexDir='column' alignItems='center'>
				<Heading>
					{title || format(subs[interval](), dateFormat || "yyyy MM dd")}
				</Heading>
				{canReset && (
					<Button
						size='xs'
						variant='ghost'
						leftIcon={<GrPowerReset />}
						onClick={() => setState(0)}>
						Reset
					</Button>
				)}
			</Flex>
			<Box w='30px'>
				{canGoToNext && (
					<Tooltip label='Next'>
						<IconButton
							variant='ghost'
							icon={<HiArrowRight size='1.4em' />}
							onClick={() => setState(state - 1)}
						/>
					</Tooltip>
				)}
			</Box>
		</Flex>
	);
}
