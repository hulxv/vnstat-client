import sysInfo from "systeminformation";
import Communication from "../index";
export default class Network {
	constructor() {}
	init() {
		this.sendNetworkStats();
	}

	sendNetworkStats() {
		sysInfo.networkInterfaceDefault().then((data) => {
			setInterval(async () => {
				let stats = (await sysInfo.networkStats(data)).at(0);
				let result = {
					[stats.iface]: {
						speed: {
							rx: stats.rx_sec,
							tx: stats.tx_sec,
						},
						bytes: {
							rx: stats.rx_bytes,
							tx: stats.tx_bytes,
						},
						errors: {
							rx: stats.rx_errors,
							tx: stats.tx_errors,
						},
						dropped: {
							rx: stats.rx_dropped,
							tx: stats.tx_dropped,
						},
						ms: stats.ms,
						operstate: stats.operstate,
					},
				};

				new Communication().send("send-network-stats", result);
			}, 1000);
		});
	}
}
