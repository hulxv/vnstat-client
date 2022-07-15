import { ipcMain } from "electron";
import log from "electron-log";
import vnStat from "../../vnStat";

export default class __vnStatChannel__ extends vnStat {
	constructor() {
		super();
	}
	async Init() {
		this.sendTrafficData();
		await this.getVnStatInterfaces();
		await this.getDatabaseTablesList();
		await this.getDatabaseTableData();
	}

	sendTrafficData() {
		return ipcMain.on("get-traffic", async e => {
			log.info("Getting data...");
			try {
				e.sender.send("send-traffic", await this.traffic().getData());
				log.info("Getting data is successfully");
			} catch (err) {
				log.error(err);
				e.sender.send("message", {
					title: "Cannot get traffic data",
					description: err.toString(),
					status: "error",
				});
			}
		});
	}

	async getVnStatInterfaces() {
		ipcMain.on("get-vnstat-interfaces", async e => {
			try {
				e.sender.send(
					"send-vnstat-interfaces",
					await this.interfaces()
				);
			} catch (err) {
				log.error(err);
			}
		});
	}

	async getDatabaseTablesList() {
		ipcMain.on("get-vnstat-database-tables-list", async e => {
			try {
				e.sender.send(
					"send-vnstat-database-tables-list",
					await this.db().getTablesList()
				);
			} catch (err) {
				log.error(err);
			}
		});
	}

	async getDatabaseTableData() {
		ipcMain.on("get-vnstat-database-table-data", async (e, table) => {
			try {
				e.sender.send(
					"send-vnstat-database-table-data",
					await this.db().get(table)
				);
			} catch (err) {
				log.error(err);
			}
		});
	}
}

export const vnStatChannel = new __vnStatChannel__();
