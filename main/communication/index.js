import { ipcMain, app, shell } from "electron";
import { mainWindow } from "../background";
import log from "electron-log";
import Updates from "../updates";
// Channels
import { ConfigChannel } from "./Channels/config";
import { ExportingChannel } from "./Channels/exporting";
import { LogsChannel } from "./Channels/log";
import { vnStatChannel } from "./Channels/vnStat";
import { DaemonChannel } from "./Channels/daemon";
import { NetworkChannel } from "./Channels/network";
import { ServerChannel } from "./Channels/server";
import { vnStat } from "../vnStat";

export default class __Communication__ {
	constructor() {}

	async Init() {
		this.getInfos();
		this.OpenURL();
		this.checkUpdates();

		// Initlize Channels
		await vnStatChannel.Init();
		ConfigChannel.Init();
		await ExportingChannel.Init();
		LogsChannel.Init();
		DaemonChannel.Init();
		NetworkChannel.init();
		await new ServerChannel().init();
	}

	getInfos() {
		ipcMain.handle("get-infos", async e => {
			try {
				return [
					{ name: "version", value: `v${app.getVersion()}` },
					...(await vnStat.info()),
				];
			} catch (err) {
				e.sender.send("message", {
					status: "error",
					title: "Cannot get information",
					description: err.toString(),
				});
				return [];
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

export const Communication = new __Communication__();
