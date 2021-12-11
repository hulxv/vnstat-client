import UsageProvider from "./dataUsage";
import ReceviedMessagesProvider from "./recevied-messages";
import Configration from "./configration";
import Logs from "./logs";
import Shortcuts from "./shortcuts";

function Contexts({ children }) {
	return (
		<Configration>
			<Shortcuts>
				<ReceviedMessagesProvider>
					<UsageProvider>
						<Logs>{children}</Logs>
					</UsageProvider>
				</ReceviedMessagesProvider>
			</Shortcuts>
		</Configration>
	);
}

export default Contexts;
