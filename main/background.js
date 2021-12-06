import { app, ipcMain, dialog } from "electron";
import log from "electron-log";
import serve from "electron-serve";
import fs from "fs";

import { createWindow } from "./helpers";

// Classes
import vnDatabase from "./vndb";
import Traffic from "./traffic";
import vnInfo from "./vnInfo";
import Cfg from "./cfg";
//
const isProd = process.env.NODE_ENV === "production";

// Constants
const ICON_NAME = "vnclient-icon.png";

if (isProd) {
	serve({ directory: "app" });
} else {
	app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
	await app.whenReady();

	log.info("vnStat-client is starting..");

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

	sendingTraffic(); // on app load

	async function sendingTraffic() {
		let traffic = new Traffic();
		log.info("Getting data...");
		try {
			await traffic.getData();
			mainWindow.webContents.send("sendUsage", traffic);
			log.info("Getting data is successfully");
		} catch (err) {
			log.error(err);
		}
	}
	ipcMain.on("reload-data", sendingTraffic); // When user click on refresh button

	ipcMain.on("export-db-view", async (e, arg) => {
		const { limit, format } = arg;
		try {
			let vnDB = new vnDatabase();
			const result = await vnDB.export(limit, format);

			mainWindow.webContents.send("export-result", result);
		} catch (err) {
			log.error(err.stdout);
			log.error(err.message);
		}
	});

	ipcMain.on("export-as-json", async (e, arg) => {
		const { jsonOBJ } = arg;
		const saveFile = await dialog.showSaveDialog({
			defaultPath: "~/",
			title: "Save as json",
			filters: [{ name: "JSON", extensions: ["json"] }],
		});

		if (!saveFile.canceled) {
			log.info(`Successufully exported as JSON file in ${saveFile.filePath}`);
			try {
				fs.writeFileSync(`${saveFile.filePath}`, JSON.stringify(jsonOBJ));
				mainWindow.webContents.send("message", {
					status: "success",
					msg: `Successufully exported as JSON file in ${saveFile.filePath}`,
				});
			} catch (err) {
				log.error(err.message);
				mainWindow.webContents.send("message", {
					status: "error",
					msg: err.message,
				});
			}
		}
	});

	ipcMain.on("export-as-xml", async (e, arg) => {
		const { xmlOBJ } = arg;
		const saveFile = await dialog.showSaveDialog({
			defaultPath: "~/",
			title: "Save as XML",
			filters: [{ name: "XML", extensions: ["xml"] }],
		});

		if (!saveFile.canceled) {
			log.info(`Successufully exported as XML file in ${saveFile.filePath}`);
			try {
				fs.writeFileSync(`${saveFile.filePath}`, `${xmlOBJ}`);
				mainWindow.webContents.send("message", {
					status: "success",
					msg: `Successufully exported as XML file in ${saveFile.filePath}`,
				});
			} catch (err) {
				log.error(err.message);
				mainWindow.webContents.send("message", {
					status: "error",
					msg: err.message,
				});
			}
		}
	});

	ipcMain.on("get-logs", () => {
		mainWindow.webContents.send("send-logs", log.transports.file.readAllLogs());
	});

	ipcMain.on("clear-logs", () => {
		try {
			log.transports.file.clear();
			mainWindow.webContents.send(
				"send-logs",
				log.transports.file.readAllLogs(),
			);
			mainWindow.webContents.send("message", {
				status: "warning",
				msg: "All logs was cleared",
			});
		} catch (err) {
			log.error(err);
		}
	});

	ipcMain.on("get-vnstat-infos", async () => {
		try {
			const vnInfos = new vnInfo();
			await vnInfos.getInfo();
			mainWindow.webContents.send("send-vnstat-infos", vnInfos.info);
		} catch (err) {
			log.error(err);
		}
	});

	// To opne URL in external browser
	ipcMain.on("open-url", (e, url) => {
		if (!url) return;
		e.preventDefault();
		require("electron").shell.openExternal(url);
	});

	// Configrations
	const cfg = new Cfg();
	console.log(cfg.store.store);
	ipcMain.on("set-config", (e, key, value) => {
		cfg.set(key, value);
		log.info(`${key} was changed to ${cfg.get(key)}`);
		mainWindow.webContents.send("send-config", cfg.get());
	});

	ipcMain.on("get-config", (e) => {
		mainWindow.webContents.send("send-config", cfg.get());
	});

	console.log("config", cfg.get());
	mainWindow.webContents.send("send-config", cfg.get()); // On lunch App
})();

app.on("window-all-closed", () => {
	app.quit();
	log.info("vnStat-client has been closed.");
});
