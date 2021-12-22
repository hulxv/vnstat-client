import { ipcMain, app, shell } from "electron";
import log from "electron-log";

// Channels
import ConfigChannelClass from "./Channels/Config";
import ExportingChannelClass from "./Channels/Exporting";
import LogsChannelClass from "./Channels/Logs";
import TrafficDataChannelClass from "./Channels/TrafficData";
import vnStat from "../vnStat";

const ConfigChannel = new ConfigChannelClass();
const ExportingChannel = new ExportingChannelClass();
const LogsChannel = new LogsChannelClass();
const TrafficChannel = new TrafficDataChannelClass();

export default class Communication {
	constructor() {}

	Init() {
		this.GetInfos();
		this.OpenURL();
		ConfigChannel.Init();
		ExportingChannel.Init();
		LogsChannel.Init();
		TrafficChannel.Init();
	}

	GetInfos() {
		ipcMain.on("get-infos", async (e) => {
			try {
				e.sender.send("send-infos", [
					{ name: "version", value: app.getVersion() },
					...(await new vnStat().info()),
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
}