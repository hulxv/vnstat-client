import DB from "./db";
import Traffic from "./traffic";
import Daemon from "./daemon";
import Config from "./config";

import { error } from "electron-log";

export default class vnStat {
	constructor() {}

	db() {
		try {
			let dbPath = `${
				this.configurations().read()["DatabaseDir"].replace(/[",']/gi, "") ??
				"/var/lib/vnstat/"
			}/vnstat.db`;
			return new DB(dbPath);
		} catch (err) {
			error(err);
		}
	}
	configurations() {
		return new Config();
	}
	daemon() {
		return new Daemon();
	}
	async info() {
		try {
			return await this.db().get("info");
		} catch (err) {
			error(err);
		}
	}

	traffic() {
		return new Traffic();
	}

	async interfaces() {
		return await this.db().get("interface");
	}
}
