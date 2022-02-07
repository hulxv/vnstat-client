import sysInfo from "systeminformation";
import Communication from "../index";
import Config from "../../AppConfigs";
export default class __Network__ {
	constructor() {}
	init() {
		this.sendNetworkStats();
	}

	sendNetworkStats() {
		sysInfo.networkInterfaceDefault().then(async (data) => {
			let refreshTime = Number(
				(await new Config().init()).get("netStatsRefreshTime"),
			);
			let timeoutCallback = async () => {
				refreshTime = Number(
					(await new Config().init()).get("netStatsRefreshTime"),
				);
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
				setTimeout(timeoutCallback, refreshTime);
			};
			setTimeout(timeoutCallback, refreshTime);
		});
	}
}

function recreateInterval(oldInterval, callback, time) {
	clearInterval(oldInterval);
	return setInterval(callback, time);
}

export const NetworkChannel = new __Network__();
