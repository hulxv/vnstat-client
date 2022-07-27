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
import { Server } from "./server";

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

		await initlize();
	} catch (err) {
		error(err);
	}
})();

app.on("window-all-closed", () => {
	app.quit();
	log.info("vnStat-client has been closed.");
});

async function initlize() {
	Updates.init();
	if (Configs.get("checkUpdatesOnStartup")) {
		Updates.check();
	}
	await TrayIcon.init();
	mainWindow.webContents.send("send-config", Configs.get());

	if (new Server().isConnected()) {
		mainWindow.webContents.send("server-was-connected");
	} else {
		mainWindow.webContents.send("server-was-disconnected");
	}

	let isVnstatDetect = await vnStat.isDetect();
	mainWindow.webContents.send("res:is-vnstat-detect", isVnstatDetect);
	if (isVnstatDetect) {
		let channels = [
			{
				name: "send-traffic",
				data: vnStat.traffic().getData(),
			},
			{
				name: "send-vnstat-configs",
				data: vnStat.configurations().read(),
			},
			{
				name: "send-vnstat-interfaces",
				data: vnStat.interface(),
			},
			{
				name: "send-vn-daemon-status",
				data: vnStat.daemon().isActive(),
			},
		];
		channels.forEach(async ({ name, data }) =>
			mainWindow.webContents.send(name, await data)
		);
	}
}

export { mainWindow };
