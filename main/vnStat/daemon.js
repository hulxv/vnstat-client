import { isInitSystemSupported, whichInitSystemUserUsed } from "../util";
import Communication from "../Communication";
import log, { error, info } from "electron-log";

import sudo from "sudo-prompt";
const util = require("util");
const exec = util.promisify(require("child_process").exec);
export default class __Daemon__ {
	#cmdOptions = {
		name: "vnStat Client",
	};
	constructor() {
		this.commands = {
			systemd: {
				start: "systemctl start vnstat",
				stop: "systemctl stop vnstat",
				restart: "systemctl restart vnstat",
				status: ["systemctl is-active vnstat", "active"],
			},
			sysvinit: {
				start: "service vnstat start",
				stop: "service vnstat stop",
				restart: "service vnstat restart",
				status: ["service vnstat status", "is running"],
			},
		};
	}

	async start() {
		try {
			if (await isInitSystemSupported()) {
				if (await this.status()) {
					info("Daemon is already starting");
					return;
				}
				let cmd = this.commands[await whichInitSystemUserUsed()].start;
				info(`(RUNNNG-AS-SU) ${cmd}`);
				new Communication().send("message", {
					status: "info",
					description: `(RUNNNG-AS-SU) ${cmd}`,
				});
				sudo.exec(cmd, this.#cmdOptions, async (error, stdout, stderr) => {
					try {
						if (stderr) throw stderr;
						new Communication().send(
							"send-vn-daemon-status",
							await this.status(),
						);
						new Communication().send("message", {
							status: "success",
							description: "Daemon is starting.",
						});
					} catch (err) {
						log.error(err);
						new Communication().send("message", {
							status: "error",
							description: err,
						});
						return;
					}
				});
			} else {
				error(`Youe init system isn't supported yet.`);
			}
		} catch (err) {
			error(err.message);
			new Communication().send("message", {
				status: "error",
				description: err.message,
			});
			return;
		}
	}
	async stop() {
		try {
			if (await isInitSystemSupported()) {
				if (!(await this.status())) {
					info("Daemon is already stopped ");
					return;
				}
				let cmd = this.commands[await whichInitSystemUserUsed()].stop;

				info(`(RUNNNG-AS-SU) ${cmd}`);
				new Communication().send("message", {
					status: "info",
					description: `(RUNNNG-AS-SU) ${cmd}`,
				});
				sudo.exec(cmd, this.#cmdOptions, async (error, stdout, stderr) => {
					try {
						if (stderr) throw stderr;
						new Communication().send(
							"send-vn-daemon-status",
							await this.status(),
						);
						new Communication().send("message", {
							status: "warning",
							description: "Daemon was stopped",
						});
					} catch (err) {
						log.error(err);
						new Communication().send("message", {
							status: "error",
							description: err,
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
					description: `${await whichInitSystemUserUsed()} init system isn't supported yet.`,
				});
			}
		} catch (err) {
			error(err);
			new Communication().send("message", {
				status: "error",
				description: err,
			});
			return;
		}
	}
	async restart() {
		try {
			if (await isInitSystemSupported()) {
				let cmd = this.commands[await whichInitSystemUserUsed()].restart;

				info(`(RUNNNG-AS-SU) ${cmd}`);
				new Communication().send("message", {
					status: "info",
					description: `(RUNNNG-AS-SU) ${cmd}`,
				});
				sudo.exec(cmd, this.#cmdOptions, async (error, stdout, stderr) => {
					try {
						if (stderr) throw stderr;
						new Communication().send(
							"send-vn-daemon-status",
							await this.status(),
						);
						new Communication().send("message", {
							status: "success",
							description: "Daemon restarting now",
						});
					} catch (err) {
						log.error(err);
						new Communication().send("message", {
							status: "error",
							description: err,
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
				description: err.message,
			});
			return;
		}
	}
	async status() {
		try {
			if (await isInitSystemSupported()) {
				const statusCommand =
					this.commands[await whichInitSystemUserUsed()].status.at(0);
				const comparingWord =
					this.commands[await whichInitSystemUserUsed()].status.at(1);
				let bash = `                                                                      
					if grep -q "$(${statusCommand})" <<< "${comparingWord}" ;
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

export const Daemon = new __Daemon__();
