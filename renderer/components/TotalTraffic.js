import { Flex, Heading, Tooltip } from "@chakra-ui/react";
import { BsArrowDownShort, BsArrowUpShort, BsWifi2 } from "react-icons/bs";

function TotalTraffic({ data = { down: 0, up: 0 } }) {
	const { down, up } = data;
	return (
		<Flex justify='space-around' w='full' align='end' my={2}>
			<Tooltip label='Download'>
				<Heading display='flex' alignItems='center' fontWeight='thin' size='lg'>
					<BsArrowDownShort size='1.4em' />
					{`${(down < 1024 ? down : down / 1024).toFixed(2)} ${
						down > 1024 ? "GB" : "MB"
					}`}
				</Heading>
			</Tooltip>

			<Tooltip label='Total' alignSelf='start'>
				<Heading fontWeight='thin' display='flex' alignItems='end'>
					<BsWifi2 size='1.5em' />

					{`${(down + up < 1024 ? down + up : (down + up) / 1024).toFixed(2)} ${
						down + up > 1024 ? "GB" : "MB"
					}`}
				</Heading>
			</Tooltip>
			<Tooltip label='Upload'>
				<Heading display='flex' alignItems='center' fontWeight='thin' size='lg'>
					<BsArrowUpShort size='1.4em' />

					{`${(up < 1024 ? up : up / 1024).toFixed(2)} ${
						up > 1024 ? "GB" : "MB"
					}`}
				</Heading>
			</Tooltip>
		</Flex>
	);
}

export default TotalTraffic;
