import { ipcMain, app, shell, BrowserWindow } from "electron";
import log from "electron-log";
const {} = require("electron");

// Channels
import ConfigChannelClass from "./Channels/Config";
import ExportingChannelClass from "./Channels/Exporting";
import LogsChannelClass from "./Channels/Logs";
import vnStatChannelClass from "./Channels/vnStat";
import DaemonChannelClass from "./Channels/Daemon";
import vnStat from "../vnStat";

const ConfigChannel = new ConfigChannelClass();
const ExportingChannel = new ExportingChannelClass();
const LogsChannel = new LogsChannelClass();
const vnStatChannel = new vnStatChannelClass();
const DaemonChannel = new DaemonChannelClass();

export default class Communication {
	constructor() {}

	async Init() {
		this.getInfos();
		this.OpenURL();
		// this.getVnStatInterfaces();
		ConfigChannel.Init();
		ExportingChannel.Init();
		LogsChannel.Init();
		await vnStatChannel.Init();
		DaemonChannel.Init();
	}

	// async getVnStatInterfaces() {
	// 	ipcMain.on("get-vnStat-interfaces", async (e) => {
	// 		try {
	// 			e.sender.send(
	// 				"send-vnStat-interfaces",
	// 				await new vnStat().db().get("interface"),
	// 			);
	// 		} catch (err) {
	// 			log.error(err);
	// 		}
	// 	});
	// }

	getInfos() {
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
