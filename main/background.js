import { app } from "electron";
import log, { error } from "electron-log";
import serve from "electron-serve";

import { createWindow } from "./helpers";

// Classes
import CommunicationClass from "./Communication";
import AppConfigClass from "./AppConfigs";
import vnStatClass from "./vnStat";
import TrayIconClass from "./Tray";
import UpdatesClass from "./updates";

import { ICON_NAME } from "./constants";
import { isProd, vnStatIsInstalled } from "./util";

const Communication = new CommunicationClass();
const AppConfig = new AppConfigClass().init();
const TrayIcon = new TrayIconClass();
const Updates = new UpdatesClass();
const vnStat = new vnStatClass();

if (isProd) {
	serve({ directory: "app" });
} else {
	app.setPath("userData", `${app.getPath("userData")} (development)`);
}
let mainWindow;
(async () => {
	await app.whenReady();
	log.info(`[${process.env.NODE_ENV.toUpperCase()}] vnStat Client is Running.`);
	mainWindow = createWindow("main", {
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
		await Communication.Init();
		await INIT();
	} catch (err) {
		error(err);
	}
})();

app.on("window-all-closed", () => {
	app.quit();
	log.info("vnStat-client has been closed.");
});

async function INIT() {
	log.info("Getting data...");
	Updates.init();
	if ((await AppConfig).get("checkUpdatesOnStartup")) {
		Updates.check();
	}
	await TrayIcon.init();

	if (!(await vnStatIsInstalled())) {
		error(
			"vnStat isn't installed, You should download and setup it before using this client.",
		);
		mainWindow.webContents.send("vnstat-is-not-installed");
		return;
	}

	// Send Configs
	mainWindow.webContents.send("send-config", (await AppConfig).get());

	mainWindow.webContents.send("send-vn-configs", vnStat.configrations().read());

	// Send Data
	mainWindow.webContents.send("send-traffic", await vnStat.traffic().getData());
	mainWindow.webContents.send(
		"send-vnstat-interfaces",
		await vnStat.interfaces(),
	);

	mainWindow.webContents.send(
		"send-vn-daemon-status",
		await vnStat.daemon().status(),
	);
	mainWindow.webContents.send(
		"send-vnstat-database-tables-list",
		await vnStat.db().getTablesList(),
	);

	log.info("Getting data is successfully");
}

export { mainWindow };
