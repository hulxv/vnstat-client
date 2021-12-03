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
import { useEffect, useRef } from "react";

function SwitchBar({
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
	const refNEXT_BTN = useRef(null);
	const refPREV_BTN = useRef(null);

	function ArrowPressHandler(e) {
		console.log("keydown", e.keyCode, e.key);
		console.log(state);
		switch (e.key) {
			case "ArrowLeft":
				if (canGoToPrevious) setState(state + 1);
				break;
			case "ArrowRight":
				if (canGoToNext) setState(state - 1);
				break;
			default:
				break;
		}
	}
	useEffect(() => {
		window.addEventListener("keydown", ArrowPressHandler);

		return () => window.removeEventListener("keydown", ArrowPressHandler); // Cleanup
	});

	return (
		<Flex justify='space-around' w='full' mb={4}>
			<Box w='30px'>
				{canGoToPrevious && (
					<Tooltip label='Previous'>
						<IconButton
							ref={refPREV_BTN}
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
							ref={refNEXT_BTN}
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

export default SwitchBar;
