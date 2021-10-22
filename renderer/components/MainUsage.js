import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs";

import { Box, Flex } from "@chakra-ui/react";

export default function MainUsage({ data }) {
	const usage = [
		{
			title: "today",
			download: 1.23,
			upload: 124,
		},
		{
			title: "yesterday",
			download: 1.23,
			upload: 124,
		},
		{
			title: "this month",
			download: 1.23,
			upload: 14,
		},
	];
	return (
		<Flex justify='space-between' width='85%' my={16}>
			{usage.map((e, index) => (
				<Usage
					key={index}
					title={e.title}
					download={e.download}
					upload={e.upload}
				/>
			))}
		</Flex>
	);
}

function Usage({ title, upload, download, total }) {
	return (
		<Flex
			bgColor='#111513'
			textColor='white'
			p={3}
			pb={0}
			w='150px'
			h='150px'
			rounded='3xl'
			flexDirection='column'
			justify='center'
			align='center'
			shadow='xl'
			border='4px'
			borderColor='#38A169'
			pos='relative'>
			<Flex align='center' flexDirection='column'>
				<Flex align='center' fontSize='30px' mb={3}>
					{upload}{" "}
					<Box alignSelf='start' fontSize='15px'>
						mb
					</Box>
				</Flex>

				<Flex flexDir='column' fontSize='17'>
					<Flex align='center'>
						<BsArrowDownShort />
						{download}{" "}
						<Box fontSize={10} alignSelf='start'>
							gb
						</Box>
					</Flex>
					<Flex align='center'>
						<BsArrowUpShort />
						{upload}{" "}
						<Box fontSize={10} alignSelf='start'>
							mb
						</Box>
					</Flex>
				</Flex>
			</Flex>
			<Box
				pos='absolute'
				bottom={-9}
				bgColor='#38A169'
				p='5px'
				px='10px'
				textTransform='capitalize'
				roundedBottom='md'>
				{title}
			</Box>
		</Flex>
	);
}

// #111513
