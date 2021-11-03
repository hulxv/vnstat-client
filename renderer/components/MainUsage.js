import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs";
import { Box, Flex } from "@chakra-ui/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
export default function MainUsage({ rx, tx }) {
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
		ipcRenderer.send("getMainData", 2);
		ipcRenderer.on("sendMainData", (e, result) => setUsage(result));
	}, []);

	return (
		<Flex justify='space-evenly' width='95%' my={16}>
			{usage.map((e, index) => (
				<Usage
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

function Usage({ interval, tx, rx, total }) {
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
					{(total > 1024 ? total / 1024 : total)?.toFixed(2) ?? 0}{" "}
					<Box alignSelf='start' fontSize='15px'>
						{rx + tx > 1024 ? "GB" : "MB"}
					</Box>
				</Flex>

				<Flex alignSelf='center' w='full' fontSize='17' justify='space-around'>
					<Flex align='center'>
						<Box border='white 2px solid' borderRadius='full' m='2px'>
							<BsArrowDownShort size='1.1em' />
						</Box>
						{(rx > 1024 ? rx / 1024 : rx)?.toFixed(2) ?? 0}{" "}
						<Box fontSize={10} alignSelf='start'>
							{rx > 1024 ? "GB" : "MB"}
						</Box>
					</Flex>
					<Flex align='center'>
						<Box border='white 2px solid' borderRadius='full' m='2px'>
							<BsArrowUpShort size='1.1em' />
						</Box>
						{(tx > 1024 ? tx / 1024 : tx)?.toFixed(2) ?? 0}{" "}
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
				width='100px'
				textAlign='center'
				p='5px'
				px='10px'
				textTransform='capitalize'
				roundedBottom='md'>
				{interval}
			</Box>
		</Flex>
	);
}

export async function getStaticProps() {
	const Days = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/day`);
	const Month = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/month`);
}
