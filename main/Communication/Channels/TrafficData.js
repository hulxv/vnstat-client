import { ipcMain } from "electron";
import log from "electron-log";
import vnStat from "../../vnStat";

export default class TrafficData extends vnStat {
	constructor() {
		super();
	}
	Init() {
		this.SendTrafficData();
	}

	SendTrafficData() {
		return ipcMain.on("get-data", async (e) => {
			log.info("Getting data...");
			try {
				e.sender.send("send-usage", await this.traffic().getData());
				log.info("Getting data is successfully");
			} catch (err) {
				log.error(err);
			}
		});
	}
}
