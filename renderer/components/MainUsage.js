import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs";
import { Box, Flex } from "@chakra-ui/react";
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
				<Flex fontSize='30px' mb={3}>
					{(total > 1024 ? total / 1024 : total)?.toFixed(2)}
					<Box alignSelf='start' fontSize='15px'>
						{rx + tx > 1024 ? "GB" : "MB"}
					</Box>
				</Flex>

				<Flex alignSelf='center' w='full' fontSize='17' justify='space-around'>
					<Flex align='center'>
						<Box m='2px'>
							<BsArrowDownShort size='1.3em' />
						</Box>
						{(rx > 1024 ? rx / 1024 : rx)?.toFixed(2)}
						<Box fontSize={10} alignSelf='start'>
							{rx > 1024 ? "GB" : "MB"}
						</Box>
					</Flex>
					<Flex align='center'>
						<Box m='2px'>
							<BsArrowUpShort size='1.3em' />
						</Box>
						{(tx > 1024 ? tx / 1024 : tx)?.toFixed(2)}
						<Box fontSize={10} alignSelf='start'>
							{tx > 1024 ? "GB" : "MB"}
						</Box>
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
