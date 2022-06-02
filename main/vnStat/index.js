import { Database } from "./db";
import { Traffic } from "./traffic";
import { Daemon } from "./daemon";
import { vnConfig } from "./config";
import Communication from "../Communication";
import { error } from "electron-log";
import { existsSync } from "fs";

export default class __vnStat__ {
	constructor() {}

	db() {
		try {
			let dbPath = `${
				this.configurations().read()["DatabaseDir"]?.replace(/[",']/gi, "") ??
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
			return await this.db().get("info");
		} catch (err) {
			throw err;
		}
	}

	traffic() {
		return Traffic;
	}

	async interfaces() {
		return await this.db().get("interface");
	}
}

export const vnStat = new __vnStat__();
