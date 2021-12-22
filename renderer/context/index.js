import VnStat from "./vnStat";
import ReceviedMessagesProvider from "./recevied-messages";
import Configration from "./configration";
import Logs from "./logs";

function Contexts({ children }) {
	return (
		<Configration>
			<ReceviedMessagesProvider>
				<VnStat>
					<Logs>{children}</Logs>
				</VnStat>
			</ReceviedMessagesProvider>
		</Configration>
	);
}

export default Contexts;
