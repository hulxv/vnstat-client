import { app } from "electron";
import log, { error } from "electron-log";
import serve from "electron-serve";

import { createWindow } from "./helpers";

import { Communication } from "./communication";
import { Configs } from "./configs";
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
	if (Configs.get("checkUpdatesOnStartup")) {
		Updates.check();
	}
	await TrayIcon.init();

	let isVnstatDetect = await vnStat.isDetect();
	let channels = [
		{ name: "send-config", data: Configs.get() },
		{ name: "res:is-vnstat-detect", data: isVnstatDetect },
		{
			name: "send-traffic",
			data: await vnStat.traffic().getData(),
			_if: isVnstatDetect,
		},
		{
			name: "send-vnstat-configs",
			data: await vnStat.configurations().read(),
			_if: isVnstatDetect,
		},
		{
			name: "send-vnstat-interfaces",
			data: await vnStat.interface(),
			_if: isVnstatDetect,
		},
		{
			name: "send-vn-daemon-status",
			data: await vnStat.daemon().isActive(),
			_if: isVnstatDetect,
		},
	];

	channels.forEach(({ name, data, _if = true }) => {
		if (_if) {
			mainWindow.webContents.send(name, data);
		}
	});

	log.info("Getting data is successfully");
}

export { mainWindow };
