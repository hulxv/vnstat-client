import UsageProvider from "./dataUsage";
import ReceviedMessagesProvider from "./recevied-messages";
import Configration from "./configration";
import Logs from "./logs";

function Contexts({ children }) {
	return (
		<Configration>
			<ReceviedMessagesProvider>
				<UsageProvider>
					<Logs>{children}</Logs>
				</UsageProvider>
			</ReceviedMessagesProvider>
		</Configration>
	);
}

export default Contexts;
