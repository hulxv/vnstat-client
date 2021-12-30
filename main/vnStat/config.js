import log from "electron-log";
import fs from "fs";
import sudo from "sudo-prompt";

import Communication from "../Communication";

import { convertObjectItemForSedScript } from "../util";
const isProd = process.env.NODE_ENV === "production";
export default class vnConfig {
	constructor() {
		this.configs = {};
		this.configFilePath = isProd ? "/etc/vnstat.conf" : "/etc/vnstat.test.conf";

		if (!isProd) {
			if (!fs.existsSync("/etc/vnstat.conf")) {
				log.error("/etc/vnstat.conf not found");
				return;
			}
			if (!fs.existsSync("/etc/vnstat.test.conf")) {
				let cpCMD = "cp /etc/vnstat.conf /etc/vnstat.test.conf";
				sudo.exec(
					cpCMD,
					{
						name: "vnStat Client",
					},
					(error, stdout, stderr) => {
						log.info(
							`[${process.env.NODE_ENV.toUpperCase()}][RUNNING-AS-SU] ${cpCMD}`,
						);

						if (error) {
							log.error(stderr);
							throw error;
						}
						log.info("'/etc/vnstat.test.conf' was created successfully");

						new Communication().send("message", {
							status: "success",
							description: "'/etc/vnstat.test.conf' was created successfully",
						});
					},
				);
			}
		}
		if (!fs.existsSync(this.configFilePath)) {
			log.error(
				`vnStat Configration file not found. [Path: ${this.configFilePath}]`,
			);
			return;
		}
	}
	read() {
		if (!fs.existsSync(this.configFilePath)) {
			log.error("vnStat Configration file not found.");
			return;
		}
		let configsOutput = fs
			.readFileSync(this.configFilePath, "utf-8")
			.split("\n")
			.filter((line) => line && !line.startsWith("#"))
			.map((line) => line.split(" ").filter((_e) => _e && _e));
		this.configs = Object.fromEntries([...configsOutput]);

		return this.configs;
	}

	async write(changes) {
		if (!Array.isArray(changes)) return;

		const options = {
			name: "vnStat Client",
		};
		let cmd = `sed -i '${changes
			.map((change) => {
				let key = Object.keys(change)[0];

				return convertObjectItemForSedScript(
					key,
					change[key].toString().replace(/["]/gi, '"'),
				);
			})
			.join(";")}' ${this.configFilePath}`;

		log.info("[RUNNING-AS-SU]", cmd);
		sudo.exec(cmd, options, (error, stdout, stderr) => {
			if (error) {
				log.error(stderr);
				new Communication().send("message", {
					status: "error",
					description: stderr,
				});
				throw error;
			}
			new Communication().send("message", {
				status: "success",
				description: "Changes was Saved",
			});

			// Send configs to renderer
			new Communication().send("send-vn-configs", this.read());
		});
	}
}
