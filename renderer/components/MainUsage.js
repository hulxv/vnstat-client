import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs";
import { Box, Flex } from "@chakra-ui/react";
import { format } from "date-fns";
export default function MainUsage({ download, upload }) {
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
		<Flex justify='space-evenly' width='95%' my={16}>
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
			pos='relative'>
			<Flex align='center' flexDirection='column' w='full'>
				<Flex fontSize='30px' mb={3}>
					{upload}{" "}
					<Box alignSelf='start' fontSize='15px'>
						mb
					</Box>
				</Flex>

				<Flex alignSelf='center' w='full' fontSize='17' justify='space-around'>
					<Flex align='center'>
						<Box border='white 2px solid' borderRadius='full' m='2px'>
							<BsArrowDownShort />
						</Box>
						{download}{" "}
						<Box fontSize={10} alignSelf='start'>
							gb
						</Box>
					</Flex>
					<Flex align='center'>
						<Box border='white 2px solid' borderRadius='full' m='2px'>
							<BsArrowUpShort />
						</Box>
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
				width='100px'
				textAlign='center'
				p='5px'
				px='10px'
				textTransform='capitalize'
				roundedBottom='md'>
				{title}
			</Box>
		</Flex>
	);
}

export async function getStaticProps() {
	const Days = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/day`);
	const Month = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/month`);
}
