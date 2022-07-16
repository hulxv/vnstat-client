import { app } from "electron";
import log, { error } from "electron-log";
import serve from "electron-serve";

import { createWindow } from "./helpers";

import { Communication } from "./communication";
import { AppConfigs } from "./configs";
import { vnStat } from "./vnStat";
import { Updates } from "./updates";

import { TrayIcon } from "./tray";
import { Menu } from "./menu";

import { ICON_NAME } from "./constants";
import { isProd, vnStatIsInstalled } from "./util";

if (isProd) {
	serve({ directory: "app" });
} else {
	app.setPath("userData", `${app.getPath("userData")} (development)`);
}
let mainWindow;
(async () => {
	await app.whenReady();
	log.info(
		`[${process.env.NODE_ENV.toUpperCase()}] vnStat Client is Running.`
	);
	mainWindow = createWindow("main", {
		width: 920,
		height: 600,
		minWidth: 550,
		icon: `${
			isProd ? `${__dirname}/images` : "renderer/public/images"
		}/${ICON_NAME}`,
	});
	Menu();

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
	if ((await AppConfigs).get("checkUpdatesOnStartup")) {
		Updates.check();
	}
	await TrayIcon.init();

	mainWindow.webContents.send("send-config", (await AppConfigs).get());

	if (!(await vnStatIsInstalled())) {
		error(
			"vnStat isn't installed, You should download and setup it before using this client."
		);
		mainWindow.webContents.send("error-vnstat-is-not-installed");
		return;
	}

	// Send vnStat data
	mainWindow.webContents.send(
		"send-vn-configs",
		await vnStat.configurations().read()
	);

	mainWindow.webContents.send(
		"send-traffic",
		await vnStat.traffic().getData()
	);

	mainWindow.webContents.send(
		"send-vnstat-interfaces",
		await vnStat.interface()
	);
	mainWindow.webContents.send(
		"send-vn-daemon-status",
		await vnStat.daemon().isActive()
	);
	mainWindow.webContents.send(
		"send-vnstat-database-tables-list",
		await vnStat.db().getTablesList()
	);

	log.info("Getting data is successfully");
}

export { mainWindow };
