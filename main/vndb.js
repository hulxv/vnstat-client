import { knex } from "knex";
import { error, warn } from "electron-log";
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const DEFAULT_DB_PATH = "/var/lib/vnstat/vnstat.db";

export default class Database {
	constructor(path) {
		this.SUPPORTED_DB_VERSIONS = ["1"];
		this.path = path || DEFAULT_DB_PATH;

		try {
			this.db = knex({
				client: "sqlite",
				connection: {
					filename: this.path,
				},
				useNullAsDefault: false,
			});
			this.dbversion = {};
			(async () => {
				this.dbversion = {
					...(await this.db("info").select().where("name", "=", "dbversion")),
				}["0"].value;

				if (this.SUPPORTED_DB_VERSIONS.indexOf(this.dbversion) < 0)
					warn("dbversion not supported yet, maybe some errors happen");
			})();
		} catch (err) {
			throw err;
		}
	}

	async Get(table) {
		try {
			const data = await this.db(table).select();

			return data;
		} catch (err) {
			error(`[${table}]`, err.message);
			throw err;
		}
	}

	async export(limit, format) {
		const { stdout, stderr } = await exec(`vnstat --${format} ${limit || ""}`);
		if (stderr) throw stderr;
		return stdout;
	}
}
