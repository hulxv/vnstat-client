import vnDB from "./db";
import { Server } from "../server";
import { debug } from "electron-log";
export default class __vnInfo__ {
	#db = new vnDB();
	#server = new Server();
	constructor() {
		this.info = [];
	}

	async get() {
		try {
			this.info = new Server().isConnected()
				? await new Server().request("info", "get")
				: await this.#db.get("info");
			return this.info;
		} catch (err) {
			throw err;
		}
	}
}

export const vnInfo = new __vnInfo__();
