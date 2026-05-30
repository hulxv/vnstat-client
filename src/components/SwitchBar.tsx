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
import {
	useEffect,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from "react";
// import { useHotkeys } from "react-hotkeys-hook";

interface SwitchBarProps {
	state?: number;
	setState?: Dispatch<SetStateAction<number>>;
	dateFormat?: string;
	interval?: "year" | "month" | "day";
	canGoToPrevious?: boolean;
	canGoToNext?: boolean;
	title?: ReactNode;
	canReset?: boolean;
	durationInDays?: number;
}

export default function SwitchBar({
	state = 0,
	setState,
	dateFormat,
	interval = "day",
	canGoToPrevious = false,
	canGoToNext = false,
	title,
	canReset = true,
	durationInDays,
}: SwitchBarProps) {
	const subs = {
		year: () => subYears(new Date(), state),
		month: () => subMonths(new Date(), state),
		day: () => subDays(new Date(), state),
	};

	function ArrowPressHandler(e: KeyboardEvent) {
		switch (e.key) {
			case "ArrowLeft":
				if (canGoToPrevious)
					setTimeout(() => setState?.(state + 1), 10);
				break;
			case "ArrowRight":
				if (canGoToNext) setTimeout(() => setState?.(state - 1), 10);
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
		<Flex align="center" justify="space-around" w="full" mb={4}>
			<Box w="30px">
				{canGoToPrevious && (
					<Tooltip label="Previous">
						<IconButton
							aria-label="Previous"
							variant="ghost"
							icon={<HiArrowLeft size="1.4em" />}
							onClick={() => setState?.(state + 1)}
						/>
					</Tooltip>
				)}
			</Box>
			<Flex flexDir="column" alignItems="center">
				<Heading>
					{title ||
						format(subs[interval](), dateFormat || "yyyy MM dd")}
				</Heading>
				{(durationInDays ?? 0) > 0 && (
					<Heading size="sm">
						{`${durationInDays} ${(durationInDays ?? 0) > 1 ? "Days" : "Day"}`}
					</Heading>
				)}
				{canReset && (
					<Button
						size="xs"
						variant="ghost"
						leftIcon={<GrPowerReset />}
						onClick={() => setState?.(0)}>
						Reset
					</Button>
				)}
			</Flex>
			<Box w="30px">
				{canGoToNext && (
					<Tooltip label="Next">
						<IconButton
							aria-label="Next"
							variant="ghost"
							icon={<HiArrowRight size="1.4em" />}
							onClick={() => setState?.(state - 1)}
						/>
					</Tooltip>
				)}
			</Box>
		</Flex>
	);
}
