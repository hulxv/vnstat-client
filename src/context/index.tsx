import type { ReactNode } from "react";
import VnStat from "./vnstat";
import ReceivedMessagesProvider from "./received-messages";
import Configuration from "./configuration";
import Server from "./server";

function Contexts({ children }: { children: ReactNode }) {
	return (
		<Configuration>
			<ReceivedMessagesProvider>
				<Server>
					<VnStat>{children}</VnStat>
				</Server>
			</ReceivedMessagesProvider>
		</Configuration>
	);
}

export default Contexts;
