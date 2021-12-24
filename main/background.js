import { app, ipcMain, dialog } from "electron";
import log, { error } from "electron-log";
import serve from "electron-serve";

import { createWindow } from "./helpers";

// Classes
import CommunicationClass from "./Communication";
import AppConfigClass from "./cfg";
import vnStat from "./vnStat";

const Communication = new CommunicationClass();
const AppConfig = new AppConfigClass();

// Constants
const isProd = process.env.NODE_ENV === "production";
const ICON_NAME = "vnclient-icon.png";

if (isProd) {
	serve({ directory: "app" });
} else {
	app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
	await app.whenReady();
	log.info(`[${process.env.NODE_ENV.toUpperCase()}] vnStat Client is Running.`);
	const mainWindow = createWindow("main", {
		width: 920,
		height: 600,
		minWidth: 550,
		icon: `${
			isProd ? `${__dirname}/images` : "renderer/public/images"
		}/${ICON_NAME}`,
	});

	if (isProd) {
		await mainWindow.loadURL("app://./index.html");
	} else {
		const port = process.argv[2];
		await mainWindow.loadURL(`http://localhost:${port}/`);
		// mainWindow.webContents.openDevTools();
	}

	try {
		Communication.Init();
		await INIT(mainWindow);
	} catch (err) {
		error(err);
	}
})();

app.on("window-all-closed", () => {
	app.quit();
	log.info("vnStat-client has been closed.");
});

async function INIT(mainWindow) {
	// Send Configs
	// await new vnStat().daemonStatus();
	// Send Data
	log.info("Getting data...");
	try {
		mainWindow.webContents.send("send-config", AppConfig.get());
		mainWindow.webContents.send(
			"send-vn-configs",
			new vnStat().configrations(),
		);

		mainWindow.webContents.send(
			"send-traffic",
			await new vnStat().traffic().getData(),
		);
		mainWindow.webContents.send(
			"send-vn-configs",
			new vnStat().configrations().read(),
		);
		log.info("Getting data is successfully");
	} catch (err) {
		log.error(err);
	}
}
