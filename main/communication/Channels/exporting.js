import { ipcMain, dialog } from "electron";
import log from "electron-log";
import fs from "fs";
import vnStat from "../../vnStat";
import { Server } from "../../server";
import { arrayOfObjectToCSV, isJson } from "../../util";

export default class __Exporting__ {
	constructor() {}
	async Init() {
		await this.ExportAsCSV();
		await this.ExportDBView();
		this.ExportToFile();
	}
	async ExportDBView() {
		return ipcMain.on("export-db-view", async (e, arg) => {
			const { limit, format } = arg;
			try {
				if (!(await vnStat.isDetect()) && !new Server().isConnected()) {
					throw new Error(
						"vnStat isn't detected or client connected with vnstat-server."
					);
				}
				const result = await new vnStat().db().export(limit, format);

				e.sender.send("export-result", result);
			} catch (err) {
				log.error(err.stdout);
				log.error(err.message);
			}
		});
	}
	async ExportAsCSV() {
		return ipcMain.on("export-as-csv", async (e, table) => {
			const saveFile = await dialog.showSaveDialog({
				defaultPath: "vnstat-client.csv",
				title: "Save as CSV",
				filters: [{ name: "CSV", extensions: ["csv"] }],
			});

			if (!saveFile.canceled) {
				try {
					if (
						!(await vnStat.isDetect()) &&
						!new Server().isConnected()
					) {
						throw new Error(
							"vnStat isn't detected or client connected with vnstat-server."
						);
					}
					let tableData = await new vnStat().db().get(table);
					let fileContent = arrayOfObjectToCSV(tableData);
					fs.writeFileSync(`${saveFile.filePath}`, fileContent);
					e.sender.send("message", {
						status: "success",
						description: `Successufully exporting as CSV file in ${saveFile.filePath}`,
					});
					log.info(
						`Successufully exporting as CSV file in ${saveFile.filePath}`
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
	ExportToFile() {
		return ipcMain.on("export-to-file", async (e, { data, ext = "" }) => {
			const saveFile = await dialog.showSaveDialog({
				defaultPath: `vnstat-client${ext.length > 0 && `.${ext}`}`,
				title: `Save as ${ext?.toUpperCase()}`,
				filters: [{ name: ext?.toUpperCase(), extensions: [ext] }],
			});

			if (!saveFile.canceled) {
				try {
					fs.writeFileSync(
						`${saveFile.filePath}`,
						isJson(data) ? JSON.stringify(data) : `${data}`
					);
					e.sender.send("message", {
						status: "success",
						description: `Successufully exporting as ${ext?.toUpperCase()} file in ${
							saveFile.filePath
						}`,
					});
					log.info(
						`Successufully exporting as ${ext?.toUpperCase()} file in ${
							saveFile.filePath
						}`
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

export const ExportingChannel = new __Exporting__();
