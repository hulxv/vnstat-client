import { ipcMain } from "electron";
import log from "electron-log";
import AppConfigClass from "../../cfg";
import vnConfig from "../../vnStat/config";

// const vnConfig = new vnConfigClass();
const AppConfig = new AppConfigClass();
export default class Config {
	constructor() {}
	Init() {
		this.SetConfig();
		this.GetConfig();
		this.GetVnConfigs();
		this.SetVnConfigs();
	}
	SetConfig() {
		return ipcMain.on("set-config", (e, key, value) => {
			AppConfig.set(key, value);
			log.info(`${key} was changed to ${AppConfig.get(key)}`);
			e.sender.send("send-config", AppConfig.get());
		});
	}
	GetConfig() {
		return ipcMain.on("get-config", (e) => {
			e.sender.send("send-config", AppConfig.get());
		});
	}
	GetVnConfigs() {
		return ipcMain.on("get-vn-configs", (e) => {
			e.sender.send("send-vn-configs", new vnConfig().read());
		});
	}
	SetVnConfigs() {}
}
