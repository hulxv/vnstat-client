import { ipcMain } from "electron";
import { vnStat } from "../../vnStat";

export default class __Daemon__ {
	constructor() {}

	Init() {
		this.Restart();
		this.Stop();
		this.Start();
		this.Status();
	}

	Status() {
		return ipcMain.on("get-vn-daemon-status", async (e) => {
			e.sender.send("send-vn-daemon-status", await vnStat.daemon().isActive());
		});
	}
	Stop() {
		return ipcMain.on("stop-vn-daemon", async (e) => {
			await vnStat.daemon().stop();
		});
	}
	Start() {
		return ipcMain.on("start-vn-daemon", async (e) => {
			await vnStat.daemon().start();
		});
	}
	Restart() {
		return ipcMain.on("restart-vn-daemon", async (e) => {
			await vnStat.daemon().restart();
		});
	}
}

export const DaemonChannel = new __Daemon__();
