import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useUsage } from "../context/dataUsage";

export default function MainUsage() {
	const { main, dataIsReady } = useUsage();
	const [usage, setUsage] = useState([
		{
			interval: "today",
			data: [],
		},
		{
			interval: "yesterday",
			data: [],
		},
		{
			interval: "this month",
			data: [],
		},
	]);
	useEffect(() => {
		setUsage(main);
	}, [dataIsReady]);

	return (
		<Flex justify='space-evenly' width='95%' my={16}>
			{usage.map((e, index) => (
				<UsageBox
					key={index}
					interval={e.interval}
					total={e.data.rx + e.data.tx}
					rx={e.data.rx}
					tx={e.data.tx}
				/>
			))}
		</Flex>
	);
}

function UsageBox({ interval, tx = 0, rx = 0, total = 0 }) {
	return (
		<Flex
			bgColor='#111513'
			textColor='white'
			px={3}
			py={0}
			w='250px'
			h='150px'
			mx={1}
			rounded='3xl'
			flexDirection='column'
			justify='center'
			align='center'
			shadow='xl'
			border='4px'
			borderColor='#38A169'
			fontWeight='medium'
			pos='relative'>
			<Flex align='center' flexDirection='column' w='full'>
				<Flex mb={3}>
					<Heading as='h3' size='xl'>
						{(total > 1024 ? total / 1024 : total)?.toFixed(2)}
					</Heading>
					<Heading as='h6' alignSelf='start' size='sm'>
						{rx + tx > 1024 ? "GB" : "MB"}
					</Heading>
				</Flex>

				<Flex alignSelf='center' w='full' justify='space-around'>
					<Flex align='center'>
						<Box m='1px'>
							<BsArrowDownShort size='1.4em' />
						</Box>
						<Heading size='md' mr={0.5}>
							{(rx > 1024 ? rx / 1024 : rx)?.toFixed(2)}
						</Heading>
						<Heading size='xs' alignSelf='start'>
							{rx > 1024 ? "GB" : "MB"}
						</Heading>
					</Flex>
					<Flex align='center'>
						<Box m='2px'>
							<BsArrowUpShort size='1.4em' />
						</Box>
						<Heading size='md' mr={0.5}>
							{(tx > 1024 ? tx / 1024 : tx)?.toFixed(2)}
						</Heading>
						<Heading size='xs' alignSelf='start'>
							{tx > 1024 ? "GB" : "MB"}
						</Heading>
					</Flex>
				</Flex>
			</Flex>
			<Box
				pos='absolute'
				bottom={-9}
				bgColor='#38A169'
				minW='100px'
				textAlign='center'
				p='5px'
				px='10px'
				fontWeight='bold'
				textTransform='capitalize'
				roundedBottom='md'>
				{interval}
			</Box>
		</Flex>
	);
}
