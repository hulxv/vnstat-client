import { app, ipcMain, dialog } from "electron";
import log from "electron-log";
import serve from "electron-serve";

import fs from "fs";

import vnDatabase from "./vndb";
import { createWindow } from "./helpers";
import Traffic from "./traffic";

const isProd = process.env.NODE_ENV === "production";

// Constants
const ICON_NAME = "icon1.png";

if (isProd) {
	serve({ directory: "app" });
} else {
	app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
	await app.whenReady();

	log.info("vnStat-client is starting..");
	const mainWindow = createWindow("main", {
		width: 800,
		height: 600,
		minWidth: 650,
		minHeight: 200,
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

	ipcMain.on("reload-data", sendingTraffic); // When user click on refresh button
	sendingTraffic(); // on app load

	async function sendingTraffic() {
		let traffic = new Traffic();
		log.info("Trying get traffic usage data");
		try {
			await traffic.getData();
			mainWindow.webContents.send("sendUsage", traffic);
			log.info("Getting data is successfully");
		} catch (err) {
			log.error(err.message);
		}
	}

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
})();

app.on("window-all-closed", () => {
	app.quit();
	log.info("vnStat-client has been closed.");
});
