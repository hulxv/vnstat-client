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
		(async () => await this.readConfigs())();
	}
	async readConfigs() {
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
	}

	editConfigs(changes) {
		const isProd = process.env.NODE_ENV === "production";

		if (!Array.isArray(changes)) return;
		const options = {
			name: "vnStat Client",
			icon: `${
				isProd ? `${__dirname}/images` : "renderer/public/images"
			}/vnclient-icon.png`,
		};

		let cmd = "";
		// sudo.exec(cmd, options, (error, stdout, stderr) => {
		// 	if (error) throw error;
		// });
	}
	e;
}
