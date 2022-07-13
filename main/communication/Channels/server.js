import { ipcMain } from "electron";
import { error } from "electron-log";
import { Server } from "../../server";

export class ServerChannel {
	constructor() {}
	async init() {
		await this.disconnect();
		await this.connect();
		this.isConnected();
	}
	disconnect() {
		ipcMain.handle("server-disconnect", e => {
			new Server().disconnect();

			e.sender.send("server-was-disconnected");
			return {
				status: "warning",
				title: "Server has been disconnected",
			};
		});
	}
	connect() {
		ipcMain.handle("server-connect", async (e, { address, password }) => {
			try {
				await new Server().connect(address, password);
				e.sender.send("server-was-connected");
				return {
					title: "Connect to server successd",
					status: "success",
				};
			} catch (err) {
				error(`Cannot connect to server: ${err.toString()}`);
				return {
					title: "Connect to server failed",
					status: "error",
					description: err.toString(),
				};
			}
		});
	}
	isConnected() {
		ipcMain.handle("server-is-connected", () => {
			return { is_connected: new Server().isConnected() };
		});
	}
}
