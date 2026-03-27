import VnStat from "./vnstat";
import ReceivedMessagesProvider from "./received-messages";
import Configuration from "./configuration";
import Logs from "./logs";
import Server from "./server";
function Contexts({ children }) {
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
