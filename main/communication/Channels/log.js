import { ipcMain } from "electron";
import log from "electron-log";
export default class __Logs__ {
	constructor() {}
	Init() {
		this.ClearLogs();
		this.GetLogs();
	}
	GetLogs() {
		return ipcMain.on("get-logs", (e) => {
			e.sender.send("send-logs", log.transports.file.readAllLogs());
		});
	}
	ClearLogs() {
		return ipcMain.on("clear-logs", (e) => {
			try {
				log.transports.file.clear();
				e.sender.send("send-logs", log.transports.file.readAllLogs());
				e.sender.send("message", {
					status: "warning",
					description: "All logs was cleared",
				});
			} catch (err) {
				log.error(err);
			}
		});
	}
}

export const LogsChannel = new __Logs__();
