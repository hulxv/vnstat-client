import log from "electron-log";
import fs from "fs";
import sudo from "sudo-prompt";
export default class vnConfig {
	constructor() {
		this.configs = {};
		this.configFilePath = "/etc/vnstat.conf";
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

	edit(changes) {
		if (!Array.isArray(changes)) return;
		const options = {
			name: "vnStat Client",
		};

		let cmd = "";
		// sudo.exec(cmd, options, (error, stdout, stderr) => {
		// 	if (error) throw error;
		// });
	}
}
