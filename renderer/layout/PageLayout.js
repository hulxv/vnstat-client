import MainBar from "../components/MainBar";
import MainUsage from "../components/MainUsage";

import { Flex, Spinner, Box } from "@chakra-ui/react";
export default function PageLayout({ children, isLoading }) {
	return (
		<>
			{isLoading ? (
				<Flex inset={0} alignItems='center' justify='center' h='100vh'>
					<Spinner size='xl' color='#38a169' />
				</Flex>
			) : (
				<Flex h='100vh' align='center' flexDir='column' overflow='auto'>
					<Flex flexDir='column' w='full' align='center' mb={8}>
						<MainUsage />
						<MainBar />
					</Flex>
					{children}
				</Flex>
			)}
		</>
	);
}
