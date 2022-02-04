import VnStat from "./vnStat";
import ReceivedMessagesProvider from "./received-messages";
import Configuration from "./configuration";
import Logs from "./logs";

function Contexts({ children }) {
	return (
		<Configuration>
			<ReceivedMessagesProvider>
				<VnStat>{children}</VnStat>
			</ReceivedMessagesProvider>
		</Configuration>
	);
}

export default Contexts;
