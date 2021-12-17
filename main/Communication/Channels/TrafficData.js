import { ipcMain } from "electron";
import log from "electron-log";
import Traffic from "../../traffic";

export default class TrafficData {
	constructor() {
		this.traffic = new Traffic();
	}
	Init() {
		this.SendTrafficData();
		this.__SendTrafficData();
	}

	SendTrafficData() {
		return ipcMain.on("get-data", async (e) => {
			log.info("Getting data...");
			try {
				await this.traffic.getData();

				e.sender.send("send-usage", this.traffic);
				log.info("Getting data is successfully");
			} catch (err) {
				log.error(err);
			}
		});
	}

	__SendTrafficData() {
		return ipcMain.handle("get-data", async (e) => {
			// log.info("Getting data...");
			try {
				await this.traffic.getData();

				return this.traffic;
				log.info("Getting data is successfully");
			} catch (err) {
				log.error(err);
			}
		});
	}
}
