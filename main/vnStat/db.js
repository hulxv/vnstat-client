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

				if (!this.SUPPORTED_DB_VERSIONS.includes(this.dbversion))
					warn("dbversion not supported yet, maybe some errors will happen");
			})();
		} catch (err) {
			throw err;
		}
	}

	async get(table) {
		try {
			return await this.db(table).select();
		} catch (err) {
			error(`[${table}]`, err.message);
			throw err;
		}
	}

	async getTablesList() {
		try {
			const tablesList = (
				await this.db("sqlite_master").where("type", "table")
			).map((table) => table.name);
			return tablesList;
		} catch (err) {
			error(err.message);
			throw err;
		}
	}

	async export(limit, format) {
		const { stdout, stderr } = await exec(`vnstat --${format} ${limit || ""}`);
		if (stderr) throw stderr;
		return stdout;
	}
}
