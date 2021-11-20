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

export default SwitchBar;
