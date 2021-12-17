import { ipcMain } from "electron";
import log from "electron-log";
import Cfg from "../../cfg";

export default class Config {
	constructor() {
		this.cfg = new Cfg();
	}
	Init() {
		this.SetConfig();
		this.GetConfig();
	}
	SetConfig() {
		return ipcMain.on("set-config", (e, key, value) => {
			this.cfg.set(key, value);
			log.info(`${key} was changed to ${this.cfg.get(key)}`);
			e.sender.send("send-config", this.cfg.get());
		});
	}
	GetConfig() {
		return ipcMain.on("get-config", (e) => {
			e.sender.send("send-config", this.cfg.get());
		});
	}
}
