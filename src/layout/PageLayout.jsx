import NavigationBar from "@Components/NavigationBar";
import Header from "@Components/Header";

import { Stack } from "@chakra-ui/react";

import AvailableUpdateAlert from "@Components/Alerts/AvailableUpdateAlert";
import VnStatIsNotInstalledAlert from "@Components/Alerts/vnStatIsNotInstalledAlert";
import DatabaseNotFoundAlert from "@Components/Alerts/DatabaseNotfoundAlert";

export default function PageLayout({ children }) {
	return (
		<>
			<AvailableUpdateAlert />
			<VnStatIsNotInstalledAlert />
			<DatabaseNotFoundAlert />
			<Stack h='100vh' align='center' overflow='auto'>
				<Stack w='full' align='center' mb={8}>
					<Header />
					<NavigationBar />
				</Stack>
				{children}
			</Stack>
		</>
	);
}
