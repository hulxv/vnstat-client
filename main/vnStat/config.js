import log from "electron-log";
import fs from "fs";
import sudo from "sudo-prompt";

import Communication from "../communication";
import { Server } from "../server";

import { convertObjectItemForSedScript } from "../util";

const isProd = process.env.NODE_ENV === "production";
export default class __vnConfig__ {
	constructor() {
		this.configs = {};
		if (new Server().isConnected()) return;

		this.configFilePath = isProd
			? "/etc/vnstat.conf"
			: "/etc/vnstat.test.conf";

		if (!isProd) {
			if (!fs.existsSync("/etc/vnstat.conf")) {
				log.error("/etc/vnstat.conf not found");
				return;
			}
			if (!fs.existsSync("/etc/vnstat.test.conf")) {
				let cmd = "cp /etc/vnstat.conf /etc/vnstat.test.conf";
				log.info(
					"You are in development mode. to keep your data, we need to backup your '/etc/vnstat.conf and use '/etc/vnstat.test.conf'"
				);
				log.info("running with root privilages: ", cmd);

				sudo.exec(
					cmd,
					{
						name: "vnStat Client",
					},
					(error, stdout, stderr) => {
						if (error) {
							log.error(stderr);
							throw error;
						}
						log.info(
							"'/etc/vnstat.test.conf' was created successfully"
						);

						new Communication().send("message", {
							status: "success",
							description:
								"'/etc/vnstat.test.conf' was created successfully",
						});
					}
				);
			}
		}
		if (!fs.existsSync(this.configFilePath)) {
			log.error(
				`${this.configFilePath}: vnStat Configuration file not found.`
			);
			return;
		}
	}
	async read() {
		if (new Server().isConnected()) {
			this.configs = await new Server().request("config", "get");
		} else {
			if (!fs.existsSync(this.configFilePath)) {
				log.error(
					`${this.configFilePath}: vnStat Configuration  file not found.`
				);
				return;
			}
			let configsOutput = fs
				.readFileSync(this.configFilePath, "utf-8")
				.split("\n")
				.map(line => line.trim())
				.filter(
					line => line && !["#", ";"].some(e => line.startsWith(e))
				)
				.map(line => line.split(" ").filter(_e => _e && _e));
			this.configs = Object.fromEntries([...configsOutput]);
		}
		return this.configs;
	}

	async write(changes) {
		if (!Array.isArray(changes))
			throw new Error("'changes' must be an  array of objects");
		if (new Server().isConnected()) {
			await new Server().request(
				"config",
				"put",
				changes.map(e => ({
					prop: Object.keys(e).at(0),
					value: `${Object.values(e).at(0)}`,
				}))
			);

			new Communication().send("send-vn-configs", await this.read());
			return;
		}

		const options = {
			name: "vnStat Client",
		};
		let cmd = `sed -i '${changes
			.filter(
				e =>
					!this.getAttributesDoesntExistInConfigFile(
						changes
					).includes(e)
			)
			.map(change => {
				let key = Object.keys(change)[0];

				return convertObjectItemForSedScript(
					key,
					change[key].toString().replace(/["]/gi, '"')
				);
			})
			.join(";")}' ${this.configFilePath} `;

		log.info("(RUNNING-AS-SU)", cmd);

		try {
			sudo.exec(cmd, options, async (error, stdout, stderr) => {
				if (error) {
					log.error(stderr);
					new Communication().send("message", {
						status: "error",
						description: stderr,
					});
					throw error;
				}

				await this.read();
				if (
					this.getAttributesDoesntExistInConfigFile(changes).length >
					0
				) {
					let command = `echo "#ADDED BY VNSTAT-CLIENT\n${this.getAttributesDoesntExistInConfigFile(
						changes
					)
						.map(attr => {
							let value = Object.values(
								changes.find(e => Object.keys(e).at(0) === attr)
							).at(0);

							return `${attr} ${value}`;
						})
						.join("\n")}" >> ${this.configFilePath}`;
					new Communication().send("message", {
						status: "info",
						description: `There's attributes doesn't exist, Need to root permissions to add it to ${this.configFilePath}`,
						duration: 10000,
					});
					new Communication().send("message", {
						status: "warning",
						description: `(RUNNING-AS-SU) ${command}`,
						duration: 10000,
					});
					log.info("(RUNNING-AS-SU)", command);

					sudo.exec(command, options, (_error, _stdout, _stderr) => {
						if (error) {
							log.error(stderr);
							new Communication().send("message", {
								status: "error",
								description: stderr,
							});
							throw error;
						}
					});
				}

				new Communication().send("message", {
					status: "success",
					description: "Changes was Saved",
				});
				log.info("vnStat configuration changes has been saved.");

				// Send configs to renderer
				new Communication().send("send-vn-configs", await this.read());
			});
		} catch (err) {
			return;
		}
	}

	getAttributesDoesntExistInConfigFile(attributes) {
		if (!Array.isArray(attributes))
			throw new Error("'attributes' must be an array of objects.");

		let allConfigs = Object.keys(this.configs);

		return attributes
			.map(attr => Object.keys(attr).at(0))
			.filter(attr => !allConfigs.includes(attr));
	}
}

export const vnConfig = new __vnConfig__();
