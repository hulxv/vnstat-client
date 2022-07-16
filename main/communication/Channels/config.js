import { ipcMain } from "electron";
import log from "electron-log";
import { AppConfigs } from "../../configs";
import { vnStat } from "../../vnStat";

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
			(await AppConfigs).set(key, value);
			log.info(`${key} was changed to ${(await AppConfigs).get(key)}`);
			e.sender.send("send-config", (await AppConfigs).get());
		});
	}
	getConfig() {
		return ipcMain.on("get-config", async e => {
			e.sender.send("send-config", (await AppConfigs).get());
		});
	}
	getVnConfigs() {
		return ipcMain.on("get-vn-configs", async e => {
			e.sender.send(
				"send-vn-configs",
				await vnStat.configurations().read()
			);
		});
	}
	setVnConfigs() {
		return ipcMain.on("change-vn-configs", async (e, changes) => {
			try {
				await vnStat.configurations().write(changes);
			} catch (err) {
				log.error("Cannot write vnStat confiugration:", err);
				e.sender.send("message", {
					title: "Writing failed",
					description: err.toString(),
				});
			}
		});
	}
}

export const ConfigChannel = new __Config__();
