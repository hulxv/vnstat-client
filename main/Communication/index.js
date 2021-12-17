import { ipcMain, app, shell } from "electron";
import log from "electron-log";
import fs from "fs";
// Classes
import Config from "./Channels/Config";
import Exporting from "./Channels/Exporting";
import Logs from "./Channels/Logs";
import TrafficData from "./Channels/TrafficData";
import vnInfo from "../vnInfo";

const _Config = new Config();
const _Exporting = new Exporting();
const _Logs = new Logs();
const _TrafficData = new TrafficData();

export default class Communication {
	constructor() {}

	Init() {
		this.GetInfos();
		this.OpenURL();
		_Config.Init();
		_Exporting.Init();
		_Logs.Init();
		_TrafficData.Init();
	}

	GetInfos() {
		ipcMain.on("get-infos", async (e) => {
			try {
				const vnInfos = new vnInfo();
				await vnInfos.getInfo();
				e.sender.send("send-infos", [
					...vnInfos.info,
					{ name: "version", value: app.getVersion() },
				]);
			} catch (err) {
				log.error(err);
			}
		});
	}
	OpenURL() {
		// To opne URL in external browser
		ipcMain.on("open-url", (e, url) => {
			if (!url) return;
			e.preventDefault();
			shell.openExternal(url);
		});
	}

	// Configrations
}
