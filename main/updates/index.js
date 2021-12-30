import { autoUpdater } from "electron-updater";
import Communication from "../Communication";
import { mainWindow } from "../background";
export default class Updates {
	constructor() {
		let log = require("electron-log");
		log.transports.file.level = "debug";
		autoUpdater.logger = log;
	}

	init() {
		let options = {
			duration: 10000,
			position: "top",
			variant: "left-accent",
		};
		autoUpdater.on("checking-for-update", () => {
			mainWindow.webContents.send("message", {
				...options,
				description: "Checking for updates...",
			});
		});
		autoUpdater.on("update-available", (info) => {
			mainWindow.webContents.send("message", {
				...options,
				title: "New Update",
				description: `${info?.version} is now available`,
			});
		});

		autoUpdater.on("update-not-available", () => {
			mainWindow.webContents.send("message", {
				...options,
				description: "Your client is up-to-date",
			});
		});
		autoUpdater.on("error", (err) => {
			mainWindow.webContents.send("message", {
				...options,
				description: err.message,
				status: "error",
			});
		});
	}

	check() {
		autoUpdater.checkForUpdates();
	}
}
