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
	durationInDays,
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

	return (
		<Flex align='center' justify='space-around' w='full' mb={4}>
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
				{durationInDays > 0 && (
					<Heading size='sm'>
						{`${durationInDays} ${durationInDays > 1 ? "Days" : "Day"}`}
					</Heading>
				)}
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
