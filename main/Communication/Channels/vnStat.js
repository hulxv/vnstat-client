import { ipcMain } from "electron";
import log from "electron-log";
import vnStat from "../../vnStat";

export default class TrafficData extends vnStat {
	constructor() {
		super();
	}
	async Init() {
		this.sendTrafficData();
		await this.getVnStatInterfaces();
	}

	sendTrafficData() {
		return ipcMain.on("get-traffic", async (e) => {
			log.info("Getting data...");
			try {
				e.sender.send("send-traffic", await this.traffic().getData());
				log.info("Getting data is successfully");
			} catch (err) {
				log.error(err);
			}
		});
	}

	async getVnStatInterfaces() {
		ipcMain.on("get-vnstat-interfaces", async (e) => {
			try {
				e.sender.send("send-vnstat-interfaces", await this.interfaces());
			} catch (err) {
				log.error(err);
			}
		});
	}
}
