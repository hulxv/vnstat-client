import { ipcMain } from "electron";
import log from "electron-log";
import AppConfigClass from "../../cfg";
import vnStatClass from "../../vnStat";

// const vnConfig = new vnConfigClass();
const AppConfig = new AppConfigClass().init();
const vnConfig = new vnStatClass().configrations();
export default class Config {
	constructor() {}
	Init() {
		this.SetConfig();
		this.GetConfig();
		this.GetVnConfigs();
		this.SetVnConfigs();
	}
	SetConfig() {
		return ipcMain.on("set-config", async (e, key, value) => {
			(await AppConfig).set(key, value);
			log.info(`${key} was changed to ${(await AppConfig).get(key)}`);
			e.sender.send("send-config", (await AppConfig).get());
		});
	}
	GetConfig() {
		return ipcMain.on("get-config", async (e) => {
			e.sender.send("send-config", (await AppConfig).get());
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
