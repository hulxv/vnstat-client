import { ipcMain, dialog } from "electron";
import log from "electron-log";
import fs from "fs";
import vnDB from "../../vnStat/db";

export default class Exporting {
	constructor() {
		this.vnDB = new vnDB();
	}
	Init() {
		this.ExportAsJSON();
		this.ExportAsXML();
		this.ExportDBView();
	}
	ExportDBView() {
		return ipcMain.on("export-db-view", async (e, arg) => {
			const { limit, format } = arg;
			try {
				const result = await this.vnDB.export(limit, format);

				e.sender.send("export-result", result);
			} catch (err) {
				log.error(err.stdout);
				log.error(err.message);
			}
		});
	}

	ExportAsJSON() {
		return ipcMain.on("export-as-json", async (e, arg) => {
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
					e.sender.send("message", {
						status: "success",
						msg: `Successufully exported as JSON file in ${saveFile.filePath}`,
					});
				} catch (err) {
					log.error(err.message);
					e.sender.send("message", {
						status: "error",
						msg: err.message,
					});
				}
			}
		});
	}
	ExportAsXML() {
		return ipcMain.on("export-as-xml", async (e, arg) => {
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
					e.sender.send("message", {
						status: "success",
						msg: `Successufully exported as XML file in ${saveFile.filePath}`,
					});
				} catch (err) {
					log.error(err.message);
					e.sender.send("message", {
						status: "error",
						msg: err.message,
					});
				}
			}
		});
	}
}
