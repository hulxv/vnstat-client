import { ipcMain } from "electron";
import log from "electron-log";
import { AppConfigs } from "../../configs";
import { vnStat } from "../../vnStat";

const vnConfig = vnStat.configurations();
export default class __Config__ {
	constructor() {}
	Init() {
		this.SetConfig();
		this.GetConfig();
		this.GetVnConfigs();
		this.SetVnConfigs();
	}
	SetConfig() {
		return ipcMain.on("set-config", async (e, key, value) => {
			(await AppConfigs).set(key, value);
			log.info(`${key} was changed to ${(await AppConfigs).get(key)}`);
			e.sender.send("send-config", (await AppConfigs).get());
		});
	}
	GetConfig() {
		return ipcMain.on("get-config", async (e) => {
			e.sender.send("send-config", (await AppConfigs).get());
		});
	}
	GetVnConfigs() {
		return ipcMain.on("get-vn-configs", (e) => {
			e.sender.send("send-vn-configs", vnConfig.read());
		});
	}
	SetVnConfigs() {
		return ipcMain.on("change-vn-configs", async (e, changes) => {
			await vnConfig.write(changes);
		});
	}
}

export const ConfigChannel = new __Config__();
