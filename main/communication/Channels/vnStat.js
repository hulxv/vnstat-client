import { ipcMain } from "electron";
import log from "electron-log";
import vnStat from "../../vnStat";

import { Configs } from "../../configs";
import { Server } from "../../server";
export default class __vnStatChannel__ extends vnStat {
	constructor() {
		super();
	}
	async Init() {
		this.sendTrafficData();
		this.isDetect();
		this.getVnStatInterfaces();
		this.getDatabaseTablesList();
		this.getDatabaseTableData();
	}

	sendTrafficData() {
		return ipcMain.on("get-traffic", async e => {
			log.info("Getting data...");
			try {
				if (!(await this.isDetect()) && !new Server().isConnected()) {
					throw new Error(
						"vnStat isn't detected or client connected with vnstat-server."
					);
				}
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

	isDetect() {
		let reqChannel = "req:is-vnstat-detect";
		let resChannel = "req:is-vnstat-detect";
		return ipcMain.on(reqChannel, async e => {
			try {
				if (!(await this.isDetect())) {
					error(
						"vnStat isn't installed, You should download and setup it before using this client."
					);
					e.sender.send(resChannel, false);
				}
			} catch (err) {
				log.error(err);
			}

			e.sender.send(resChannel, true);
		});
	}

	getVnStatInterfaces() {
		ipcMain.on("get-vnstat-interfaces", async e => {
			try {
				if (!(await this.isDetect()) && !new Server().isConnected()) {
					throw new Error(
						"vnStat isn't detected or client connected with vnstat-server."
					);
				}
				e.sender.send("send-vnstat-interfaces", await this.interface());
			} catch (err) {
				log.error(err);
			}
		});
	}

	getDatabaseTablesList() {
		ipcMain.handle("get-vnstat-database-tables-list", async e => {
			try {
				if (!(await this.isDetect()) && !new Server().isConnected()) {
					throw new Error(
						"vnStat isn't detected or client connected with vnstat-server."
					);
				}
				return await this.db().getTablesList();
			} catch (err) {
				log.error(err);
				e.sender.send("message", {
					description: err.toString(),
					status: "error",
					title: "Cannot get vnStat database table list",
				});
			}
			return [];
		});
	}

	getDatabaseTableData() {
		ipcMain.handle("get-vnstat-database-table-data", async (e, table) => {
			try {
				if (!(await this.isDetect()) && !new Server().isConnected()) {
					throw new Error(
						"vnStat isn't detected or client connected with vnstat-server."
					);
				}
				return await this.db().get(table);
			} catch (err) {
				log.error(err);
				e.sender.send("message", {
					description: err.toString(),
					status: "error",
					title: `Cannot get vnStat database table that called '${table}' data`,
				});
			}
			return [];
		});
	}
}

export const vnStatChannel = new __vnStatChannel__();
