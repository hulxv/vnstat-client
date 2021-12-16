import NavigationBar from "@Components/NavigationBar";
import Header from "@Components/Header";

import { Flex, Spinner } from "@chakra-ui/react";

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
						<Header />
						<NavigationBar />
					</Flex>
					{children}
				</Flex>
			)}
		</>
	);
}
