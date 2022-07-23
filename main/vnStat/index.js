import { Database } from "./db";
import { Traffic } from "./traffic";
import { Daemon } from "./daemon";
import { vnConfig } from "./config";
import Communication from "../communication";
import { vnInfo } from "./info";
import { error } from "electron-log";
import { existsSync } from "fs";
import { Server } from "../server";
const util = require("util");
const exec = util.promisify(require("child_process").exec);

export default class __vnStat__ {
	constructor() {}

	db() {
		try {
			if (new Server().isConnected()) return;
			let dbPath = `${
				this.configurations()
					.read()
					["DatabaseDir"]?.replace(/[",']/gi, "") ??
				"/var/lib/vnstat/"
			}/vnstat.db`;
			if (!existsSync(dbPath)) {
				error(`${dbPath}: database filepath not found`);
				new Communication().send("error-database-not-found");
				return;
			}
			return Database(dbPath);
		} catch (err) {
			throw err;
		}
	}
	configurations() {
		return vnConfig;
	}
	daemon() {
		return Daemon;
	}
	async info() {
		try {
			return await vnInfo.get();
		} catch (err) {
			throw err;
		}
	}

	traffic() {
		return Traffic;
	}

	async isDetect() {
		let bash = `        
		if ! [ -x "$(command -v vnstat)" ]; then
			echo "false"
			else echo "true"
		fi`;

		try {
			const { stdout, stderr } = await exec(bash);
			if (stderr) throw stderr;
			return stdout.includes("true");
		} catch (err) {
			return err;
		}
	}
	async interface() {
		if (new Server().isConnected()) {
			return await new Server().request("interface", "get");
		}
		return await this.db().get("interface");
	}
}

export const vnStat = new __vnStat__();
