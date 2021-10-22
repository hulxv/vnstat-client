import ChooseBar from "../components/ChooseBar";
import MainUsage from "../components/MainUsage";

import { Flex } from "@chakra-ui/react";
export default function PageLayout({ children }) {
	return (
		<Flex h='100vh' align='center' flexDir='column'>
			<Flex flexDir='column' w='full' align='center' mb={8}>
				<MainUsage />
				<ChooseBar />
			</Flex>
			{children}
		</Flex>
	);
}
