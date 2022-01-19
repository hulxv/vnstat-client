import { ipcMain, app, shell } from "electron";
import { mainWindow } from "../background";
import log from "electron-log";
import Updates from "../updates";
// Channels
import ConfigChannelClass from "./Channels/Config";
import ExportingChannelClass from "./Channels/Exporting";
import LogsChannelClass from "./Channels/Logs";
import vnStatChannelClass from "./Channels/vnStat";
import DaemonChannelClass from "./Channels/Daemon";
import NetworkChannelClass from "./Channels/Network";
import vnStat from "../vnStat";

const ConfigChannel = new ConfigChannelClass();
const ExportingChannel = new ExportingChannelClass();
const LogsChannel = new LogsChannelClass();
const vnStatChannel = new vnStatChannelClass();
const DaemonChannel = new DaemonChannelClass();
const Network = new NetworkChannelClass();

export default class Communication {
	constructor() {}

	async Init() {
		this.getInfos();
		this.OpenURL();
		this.checkUpdates();
		// this.getVnStatInterfaces();
		ConfigChannel.Init();
		ExportingChannel.Init();
		LogsChannel.Init();
		await vnStatChannel.Init();
		DaemonChannel.Init();
		Network.init();
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
		// To open URL in external browser
		ipcMain.on("open-url", (e, url) => {
			if (!url) return;
			e.preventDefault();
			shell.openExternal(url);
		});
	}

	send(channel, args) {
		mainWindow.webContents.send(channel, args);
	}
	checkUpdates() {
		ipcMain.on("check-for-updates", () => {
			new Updates().check();
		});
	}
}
