import { format, subDays, subMonths, subYears } from "date-fns";

import { Box, Flex, Button, Heading, IconButton } from "@chakra-ui/react";

import { GrPowerReset } from "react-icons/gr";

import { HiArrowLeft, HiArrowRight } from "react-icons/hi";

function SwitchBar({ state, setState, dateFormat, interval }) {
	const subs = {
		month: () => subYears(new Date(), state),
		day: () => subMonths(new Date(), state),
		hour: () => subDays(new Date(), state),
	};
	return (
		<Flex justify='space-around' w='full' mb={4}>
			<Box w='30px'>
				<IconButton
					variant='ghost'
					icon={<HiArrowLeft size='1.4em' />}
					onClick={() => setState(state + 1)}
				/>
			</Box>
			<Flex flexDir='column' alignItems='center'>
				<Heading>
					{format(subs[interval](), dateFormat || "yyyy MM dd")}
				</Heading>
				<Button
					size='xs'
					variant='ghost'
					leftIcon={<GrPowerReset />}
					onClick={() => setState(0)}>
					Reset
				</Button>
			</Flex>
			<Box w='30px'>
				{state > 0 && (
					<IconButton
						variant='ghost'
						icon={<HiArrowRight size='1.4em' />}
						onClick={() => setState(state - 1)}
					/>
				)}
			</Box>
		</Flex>
	);
}

export default SwitchBar;
