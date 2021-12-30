import { isInitSystemSupported, whichInitSystemUserUsed } from "../util";
import Communication from "../Communication";
import log, { error, info } from "electron-log";

import sudo from "sudo-prompt";
const util = require("util");
const exec = util.promisify(require("child_process").exec);
export default class Daemon {
	#cmdOptions = {
		name: "vnStat Client",
	};
	constructor() {}

	async start() {
		try {
			if (await isInitSystemSupported()) {
				if ((await this.status()) === "active") {
					info("Daemon is alreadey starting");
					return;
				}
				let cmd = "systemctl start vnstat";

				info(`[RUNNNG-AS-SU] ${cmd}`);
				sudo.exec(cmd, this.#cmdOptions, async (error, stdout, stderr) => {
					try {
						if (stderr) throw stderr;
						new Communication().send(
							"send-vn-daemon-status",
							await this.status(),
						);
						new Communication().send("message", {
							status: "success",
							msg: "Daemon is starting.",
						});
					} catch (err) {
						log.error(err);
						new Communication().send("message", {
							status: "error",
							msg: err,
						});
						return;
					}
				});
			} else {
				error(
					`${await whichInitSystemUserUsed()} init system isn't supported yet.`,
				);
			}
		} catch (err) {
			error(err.message);
			new Communication().send("message", {
				status: "error",
				msg: err.message,
			});
			return;
		}
	}
	async stop() {
		try {
			if (await isInitSystemSupported()) {
				if ((await this.status()) === "inactive") {
					info("Daemon is already stopped ");
					return;
				}
				let cmd = "systemctl stop vnstat";

				info(`[RUNNNG-AS-SU], ${cmd}`);
				sudo.exec(cmd, this.#cmdOptions, async (error, stdout, stderr) => {
					try {
						if (stderr) throw stderr;
						new Communication().send(
							"send-vn-daemon-status",
							await this.status(),
						);
						new Communication().send("message", {
							status: "warning",
							msg: "Daemon was stopped",
						});
					} catch (err) {
						log.error(err);
						new Communication().send("message", {
							status: "error",
							msg: err,
						});
						return;
					}
				});
			} else {
				error(
					`${await whichInitSystemUserUsed()} init system isn't supported yet.`,
				);
				new Communication().send("message", {
					status: "error",
					msg: `${await whichInitSystemUserUsed()} init system isn't supported yet.`,
				});
			}
		} catch (err) {
			error(err);
			new Communication().send("message", {
				status: "error",
				msg: err,
			});
			return;
		}
	}
	async restart() {
		try {
			if (await isInitSystemSupported()) {
				let cmd = "systemctl restart vnstat";

				info(`[RUNNNG-AS-SU], ${cmd}`);
				sudo.exec(cmd, this.#cmdOptions, async (error, stdout, stderr) => {
					try {
						if (stderr) throw stderr;
						new Communication().send(
							"send-vn-daemon-status",
							await this.status(),
						);
						new Communication().send("message", {
							status: "success",
							msg: "Daemon restarting now",
						});
					} catch (err) {
						log.error(err);
						new Communication().send("message", {
							status: "error",
							msg: err,
						});
						return;
					}
				});
			} else {
				error(
					`${await whichInitSystemUserUsed()} init system isn't supported yet.`,
				);
			}
		} catch (err) {
			error(err.message);
			new Communication().send("message", {
				status: "error",
				msg: err.message,
			});
			return;
		}
	}
	async status() {
		try {
			if (await isInitSystemSupported()) {
				let bash = `                                                                      
					if [[ $(systemctl is-active vnstat) == "active" ]] 
						then echo "true"                                                                                         
					else echo "false"  
					fi                                                                                                                    
				`;

				const { stdout, stderr } = await exec(bash);
				if (stderr) throw stderr;
				return stdout.replace(/[\n, " "]/, "") == "true";
			} else {
				error(
					`${await whichInitSystemUserUsed()} init system isn't supported yet.`,
				);
			}
		} catch (err) {
			error(err);
		}
	}
}
