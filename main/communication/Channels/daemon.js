import { ipcMain } from "electron";
import { error } from "electron-log";
import { vnStat } from "../../vnStat";
import { Server } from "../../server";

export default class __Daemon__ {
	constructor() {}

	Init() {
		this.Restart();
		this.Stop();
		this.Start();
		this.Status();
	}

	Status() {
		return ipcMain.on("get-vn-daemon-status", async e => {
			try {
				if (!(await vnStat.isDetect()) && !new Server().isConnected()) {
					throw new Error(
						"vnStat isn't detected or client connected with vnstat-server."
					);
				}
				e.sender.send(
					"send-vn-daemon-status",
					await vnStat.daemon().isActive()
				);
			} catch (err) {
				error(err);
				e.sender.send("message", {
					description: err.toString(),
					title: "Getting vnstatd has been failed.",
					status: "error",
				});
			}
		});
	}
	Stop() {
		return ipcMain.on("stop-vn-daemon", async e => {
			try {
				if (!(await vnStat.isDetect()) && !new Server().isConnected()) {
					throw new Error(
						"vnStat isn't detected or client connected with vnstat-server."
					);
				}
				await vnStat.daemon().stop();
				e.sender.send(
					"send-vn-daemon-status",
					await vnStat.daemon().isActive()
				);
			} catch (err) {
				error(err);
				e.sender.send("message", {
					description: err.toString(),
					title: "Stopping vnstatd has been failed.",
					status: "error",
				});
			}
		});
	}
	Start() {
		return ipcMain.on("start-vn-daemon", async e => {
			try {
				if (!(await vnStat.isDetect()) && !new Server().isConnected()) {
					throw new Error(
						"vnStat isn't detected or client connected with vnstat-server."
					);
				}
				await vnStat.daemon().start();
				e.sender.send(
					"send-vn-daemon-status",
					await vnStat.daemon().isActive()
				);
			} catch (err) {
				error(err);
				e.sender.send("message", {
					description: err.toString(),
					title: "starting vnstatd has been failed.",
					status: "error",
				});
			}
		});
	}
	Restart() {
		return ipcMain.on("restart-vn-daemon", async e => {
			try {
				if (!(await vnStat.isDetect()) && !new Server().isConnected()) {
					throw new Error(
						"vnStat isn't detected or client connected with vnstat-server."
					);
				}
				await vnStat.daemon().restart();
				e.sender.send(
					"send-vn-daemon-status",
					await vnStat.daemon().isActive()
				);
			} catch (err) {
				error(err);
				e.sender.send("message", {
					description: err.toString(),
					title: "restarting vnstatd has been failed.",
					status: "error",
				});
			}
		});
	}
}

export const DaemonChannel = new __Daemon__();
