import { ipcMain, dialog } from "electron";
import log from "electron-log";
import fs from "fs";
import vnStat from "../../vnStat";
import { arrayOfObjectToCSV } from "../../util";

export default class Exporting {
	constructor() {}
	Init() {
		this.ExportAsJSON();
		this.ExportAsXML();
		this.ExportAsCSV();
		this.ExportDBView();
	}
	ExportDBView() {
		return ipcMain.on("export-db-view", async (e, arg) => {
			const { limit, format } = arg;
			try {
				const result = await new vnStat().db().export(limit, format);

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
				try {
					fs.writeFileSync(`${saveFile.filePath}`, JSON.stringify(jsonOBJ));
					e.sender.send("message", {
						status: "success",
						description: `Successufully exported as JSON file in ${saveFile.filePath}`,
					});
					log.info(
						`Successufully exported as JSON file in ${saveFile.filePath}`,
					);
				} catch (err) {
					log.error(err.message);
					e.sender.send("message", {
						status: "error",
						description: err.message,
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
				try {
					fs.writeFileSync(`${saveFile.filePath}`, `${xmlOBJ}`);
					e.sender.send("message", {
						status: "success",
						description: `Successufully exported as XML file in ${saveFile.filePath}`,
					});
					log.info(
						`Successufully exported as XML file in ${saveFile.filePath}`,
					);
				} catch (err) {
					log.error(err.message);
					e.sender.send("message", {
						status: "error",
						description: err.message,
					});
				}
			}
		});
	}

	ExportAsCSV() {
		return ipcMain.on("export-as-csv", async (e, table) => {
			const saveFile = await dialog.showSaveDialog({
				defaultPath: "~/",
				title: "Save as CSV",
				filters: [{ name: "CSV", extensions: ["csv"] }],
			});

			if (!saveFile.canceled) {
				try {
					let tableData = await new vnStat().db().get(table);
					let fileContent = arrayOfObjectToCSV(tableData);
					fs.writeFileSync(`${saveFile.filePath}`, fileContent);
					e.sender.send("message", {
						status: "success",
						description: `Successufully exported as XML file in ${saveFile.filePath}`,
					});
					log.info(
						`Successufully exported as CSV file in ${saveFile.filePath}`,
					);
				} catch (err) {
					log.error(err.message);
					e.sender.send("message", {
						status: "error",
						description: err.message,
					});
				}
			}
		});
	}
}
