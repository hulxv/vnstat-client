import { knex } from "knex";
import { error } from "electron-log";
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const DEFAULT_DB_PATH = "/var/lib/vnstat/vnstat.db";

export default class Database {
	constructor(path) {
		this.path = path || DEFAULT_DB_PATH;
		this.db = knex({
			client: "sqlite",
			connection: {
				filename: this.path,
			},
			useNullAsDefault: false,
		});
	}

	async Get(table) {
		try {
			const data = await this.db(table).select();
			return data;
		} catch (err) {
			error(err.message);
		}
	}

	async export(limit, format) {
		const { stdout, stderr } = await exec(`vnstat --${format} ${limit || ""}`);
		if (stderr) throw stderr;
		return stdout;
	}

	// More in future...
}
