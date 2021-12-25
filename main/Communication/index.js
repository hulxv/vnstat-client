import { ipcMain, app, shell, BrowserWindow } from "electron";
import log from "electron-log";
const {} = require("electron");

// Channels
import ConfigChannelClass from "./Channels/Config";
import ExportingChannelClass from "./Channels/Exporting";
import LogsChannelClass from "./Channels/Logs";
import TrafficDataChannelClass from "./Channels/TrafficData";
import DaemonChannelClass from "./Channels/Daemon";
import vnStat from "../vnStat";

const ConfigChannel = new ConfigChannelClass();
const ExportingChannel = new ExportingChannelClass();
const LogsChannel = new LogsChannelClass();
const TrafficChannel = new TrafficDataChannelClass();
const DaemonChannel = new DaemonChannelClass();

export default class Communication {
	constructor() {}

	Init() {
		this.GetInfos();
		this.OpenURL();
		ConfigChannel.Init();
		ExportingChannel.Init();
		LogsChannel.Init();
		TrafficChannel.Init();
		DaemonChannel.Init();
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

	send(channel, args) {
		BrowserWindow.getFocusedWindow().webContents.send(channel, args);
	}
}
