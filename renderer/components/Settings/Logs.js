import ViewportList from "react-viewport-list";
import { useState, useEffect, useRef } from "react";

import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Button,
	IconButton,
	Box,
	Tooltip,
	Flex,
	Spinner,
	HStack,
	Stack,
	Input,
	InputRightElement,
	InputGroup,
	Heading,
} from "@chakra-ui/react";

import {
	HiTrash,
	HiRefresh,
	HiOutlineInformationCircle,
	HiSearch,
	HiX,
} from "react-icons/hi";
import { useLogs } from "../../context/logs";

function Logs() {
	const { logs, GetLogs, ClearLogs, isLoading } = useLogs();

	const [search, setSearch] = useState({ bool: false, value: "" });
	useEffect(() => GetLogs(), []);

	// useEffect(() => console.log("search update to", search), [search]); // ! For Debugging
	// useEffect(() => console.log("logs update to", logs), [logs]); // ! For Debugging

	return (
		<>
			<Flex w='full' justify='space-between' my={3}>
				<HStack>
					<Tooltip
						hasArrow
						placement='right'
						label={`Logs stored in ${logs.path}`}>
						<IconButton
							variant='ghost'
							cursor='default'
							icon={<HiOutlineInformationCircle size='1.3em' />}
						/>
					</Tooltip>
					<Box>{logs?.lines.length}</Box>
				</HStack>

				<HStack justify='end' spacing={3}>
					{search.bool ? (
						<InputGroup w='300px'>
							<Input
								placeholder='Search'
								variant='filled'
								value={search.value}
								onChange={(e) =>
									setSearch({ ...search, value: e.target.value })
								}
							/>
							<InputRightElement>
								{search.value ? (
									<IconButton
										variant='none'
										icon={<HiX size='1.4em' />}
										onClick={() => setSearch({ ...search, value: "" })}
									/>
								) : (
									<IconButton
										variant='none'
										icon={<HiSearch size='1.4em' />}
										onClick={() => setSearch({ ...search, bool: !search.bool })}
									/>
								)}
							</InputRightElement>
						</InputGroup>
					) : (
						<Tooltip label='Search in logs'>
							<IconButton
								variant='ghost'
								icon={<HiSearch size='1.4em' />}
								onClick={() => setSearch({ ...search, bool: !search.bool })}
							/>
						</Tooltip>
					)}

					<Button leftIcon={<HiRefresh />} onClick={() => GetLogs()}>
						Refresh
					</Button>
					<Button
						leftIcon={<HiTrash />}
						colorScheme='red'
						onClick={() => ClearLogs()}>
						Clear All
					</Button>
				</HStack>
			</Flex>
			<Stack spacing={1}>
				{isLoading ? (
					<Spinner
						size='xl'
						color='green'
						alignSelf='center'
						justifySelf='center'
					/>
				) : !logs?.lines ? (
					<Heading size='md' alignSelf='center'>
						No logs found
					</Heading>
				) : (
					<LogRows
						data={
							search.bool
								? logs?.lines.filter((line) =>
										line.content
											.toLowerCase()
											.includes(search.value.toLowerCase()),
								  )
								: logs?.lines
						}
					/>
				)}
			</Stack>
		</>
	);
}

function LogAlert({ status, date, content }) {
	return (
		<Alert status={status}>
			<AlertIcon />
			<Box flex={1}>
				<AlertTitle mr={2}>{date}</AlertTitle>{" "}
				<AlertDescription>{content}</AlertDescription>
			</Box>
		</Alert>
	);
}

const LogRows = ({ data }) => {
	const listRef = useRef(null);
	const ref = useRef(null);

	return (
		<Box ref={ref}>
			<ViewportList
				ref={listRef}
				viewportRef={ref}
				itemMinSize={75}
				items={data}>
				{(item, index) => {
					// console.log(index, item);
					return (
						<div key={index} className='item' style={{ marginBottom: 4 }}>
							<LogAlert
								status={item?.status}
								content={item?.content}
								date={item?.date}
							/>
						</div>
					);
				}}
			</ViewportList>
		</Box>
	);
};

export default Logs;
