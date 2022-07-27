import { ipcMain } from "electron";
import log from "electron-log";
import { Configs } from "../../configs";
import { vnStat } from "../../vnStat";
import { Server } from "../../server";

// const vnConfig = vnStat.configurations();
export default class __Config__ {
	constructor() {}
	Init() {
		this.setConfig();
		this.getConfig();
		this.getVnConfigs();
		this.setVnConfigs();
	}
	setConfig() {
		return ipcMain.on("set-config", async (e, key, value) => {
			Configs.set(key, value);
			log.info(`${key} was changed to ${Configs.get(key)}`);
			e.sender.send("send-config", Configs.get());
		});
	}
	getConfig() {
		return ipcMain.on("get-config", async e => {
			e.sender.send("send-config", Configs.get());
		});
	}
	getVnConfigs() {
		return ipcMain.on("get-vn-configs", async e => {
			try {
				if (!(await vnStat.isDetect()) && !new Server().isConnected()) {
					throw new Error(
						"vnStat isn't detected or client connected with vnstat-server."
					);
				}
				e.sender.send(
					"send-vn-configs",
					await vnStat.configurations().read()
				);
			} catch (err) {
				log.error("Cannot read vnStat confiugration:", err);
				e.sender.send("message", {
					title: "Reading vnStat configuration failed",
					description: err.toString(),
					status: "error",
				});
			}
		});
	}
	setVnConfigs() {
		return ipcMain.on("change-vn-configs", async (e, changes) => {
			try {
				if (!(await vnStat.isDetect()) && !new Server().isConnected()) {
					throw new Error(
						"vnStat isn't detected or client connected with vnstat-server."
					);
				}
				await vnStat.configurations().write(changes);
			} catch (err) {
				log.error("Cannot write vnStat confiugration:", err);
				e.sender.send("message", {
					title: "Writing vnStat Configuration failed",
					description: err.toString(),
					status: "error",
				});
			}
		});
	}
}

export const ConfigChannel = new __Config__();
