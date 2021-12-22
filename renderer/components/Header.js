import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs";
import { Box, Flex, Heading, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useVnStat } from "@Context/vnStat";
import { useConfig } from "@Context/configration";

export default function Header() {
	const { traffic, dataIsReady } = useVnStat();

	const [data, setData] = useState([
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
		setData(traffic.main);
	}, [dataIsReady]);

	return (
		<Flex justify='space-evenly' width='95%' my={16}>
			{data.map((e, index) => (
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
	const { config } = useConfig();

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
			borderColor={`${config?.apperance?.globalTheme ?? "green"}.500`}
			pos='relative'>
			<Flex align='center' flexDirection='column' w='full'>
				<Flex mb={3}>
					<Heading as='h3' size='xl' fontWeight='thin'>
						{(total > 1024 ? total / 1024 : total)?.toFixed(2)}
					</Heading>
					<Heading as='h6' alignSelf='start' size='sm' fontWeight='thin'>
						{rx + tx > 1024 ? "GB" : "MB"}
					</Heading>
				</Flex>

				<Flex alignSelf='center' w='full' justify='space-around'>
					<Flex align='center'>
						<Box m='1px'>
							<BsArrowDownShort size='1.4em' />
						</Box>
						<Heading size='md' mr={0.5} fontWeight='thin'>
							{(rx > 1024 ? rx / 1024 : rx)?.toFixed(2)}
						</Heading>
						<Heading fontWeight='thin' size='xs' alignSelf='start'>
							{rx > 1024 ? "GB" : "MB"}
						</Heading>
					</Flex>
					<Flex align='center'>
						<Box m='2px'>
							<BsArrowUpShort size='1.4em' />
						</Box>
						<Heading fontWeight='thin' size='md' mr={0.5}>
							{(tx > 1024 ? tx / 1024 : tx)?.toFixed(2)}
						</Heading>
						<Heading fontWeight='thin' size='xs' alignSelf='start'>
							{tx > 1024 ? "GB" : "MB"}
						</Heading>
					</Flex>
				</Flex>
			</Flex>
			<Button
				pos='absolute'
				bottom={-10}
				colorScheme={`${config?.apperance?.globalTheme ?? "green"}`}
				cursor='default'
				textTransform='capitalize'
				roundedBottom='md'>
				{interval}
			</Button>
		</Flex>
	);
}
