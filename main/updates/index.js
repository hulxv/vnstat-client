import { autoUpdater } from "electron-updater";
import { info, error } from "electron-log";
import { mainWindow } from "../background";
import { isProd } from "../util";
import { ipcMain } from "electron";
export default class __Updates__ {
	constructor() {
		require("electron-log").transports.file.level = "debug";
		autoUpdater.logger = require("electron-log");
		autoUpdater.autoDownload = false;
	}

	init() {
		let options = {
			duration: 10000,
			variant: "left-accent",
		};
		autoUpdater.on("checking-for-update", () => {
			mainWindow.webContents.send("message", {
				...options,
				description: "Checking for updates...",
			});
		});
		autoUpdater.on("update-available", (info) => {
			if (!isProd) console.log(info);
			mainWindow.webContents.send("message", {
				...options,
				title: "New Update",
				description: `${info?.version} is now available`,
			});

			mainWindow.webContents.send("update-available", info);
		});

		autoUpdater.on("update-not-available", (info) => {
			if (!isProd) console.log(info);

			mainWindow.webContents.send("message", {
				...options,
				description: "Your client is up-to-date",
			});
		});

		autoUpdater.on("download-progress", (progress) => {
			mainWindow.webContents.send("download-update-progress", progress);
		});

		autoUpdater.on("update-downloaded", () => {
			mainWindow.webContents.send("update-downloaded");
		});

		autoUpdater.on("error", (err) => {
			mainWindow.webContents.send("message", {
				...options,
				description: err.message,
				status: "error",
			});
		});

		ipcMain.on("quit-and-update", () => {
			autoUpdater.quitAndInstall();
		});

		ipcMain.on("start-download-new-update", async () => {
			info("Starting update...");

			try {
				await autoUpdater.downloadUpdate();
			} catch (err) {
				mainWindow.webContents.send("download-update-error");
			}
		});
	}

	check() {
		autoUpdater.checkForUpdates();
	}
}

export const Updates = new __Updates__();
