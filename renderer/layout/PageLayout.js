import NavigationBar from "@Components/NavigationBar";
import Header from "@Components/Header";

import { Flex, Spinner, Stack } from "@chakra-ui/react";

export default function PageLayout({ children, isLoading }) {
	return (
		<>
			{isLoading ? (
				<Flex inset={0} alignItems='center' justify='center' h='100vh'>
					<Spinner size='xl' color='#38a169' />
				</Flex>
			) : (
				<Stack h='100vh' align='center' overflow='auto'>
					<Stack w='full' align='center' mb={8}>
						<Header />
						<NavigationBar />
					</Stack>
					{children}
				</Stack>
			)}
		</>
	);
}
