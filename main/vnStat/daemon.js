import { isInitSystemSupported, whichInitSystemUserUsed } from "../util";
import Communication from "../communication";
import log, { error, info, warn } from "electron-log";

import sudo from "sudo-prompt";
import { Server } from "../server";
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
		(async () => {
			if (!(await isInitSystemSupported())) {
				throw new Error(
					`${await whichInitSystemUserUsed()} init system isn't supported yet.`
				);
			}
		})();
	}

	async start() {
		try {
			if (new Server().isConnected()) {
				let res = await new Server().request("daemon/restart", "post");
				new Communication().send("message", {
					status: "success",
					description: res.details,
				});
				return;
			}
			if (await this.isActive()) {
				info("Daemon is already starting");
				return;
			}
			let cmd = this.commands[await whichInitSystemUserUsed()].start;
			info(`running with root privileges: ${cmd}`);
			new Communication().send("message", {
				status: "info",
				description: `(RUNNNG-AS-SU) ${cmd}`,
			});
			sudo.exec(cmd, this.#cmdOptions, async (error, stdout, stderr) => {
				if (stderr) throw stderr;
			});
		} catch (err) {
			console.dir(err, { depth: null });
			throw err.toString();
		}
	}
	async stop() {
		try {
			if (new Server().isConnected()) {
				let res = await new Server().request("daemon/stop", "post");
				new Communication().send("message", {
					status: "success",
					description: res.details,
				});
				return;
			}
			let cmd = this.commands[await whichInitSystemUserUsed()].stop;

			info(`running with root privileges: ${cmd}`);
			new Communication().send("message", {
				status: "info",
				description: `${cmd}`,
				title: "Running with root privileges.",
			});
			sudo.exec(cmd, this.#cmdOptions, async (error, stdout, stderr) => {
				try {
					if (stderr) throw stderr;

					warn("Daemon was stopped.");
				} catch (err) {
					throw err;
				}
			});
		} catch (err) {
			throw err.toString();
		}
	}
	async restart() {
		try {
			if (new Server().isConnected()) {
				let res = await new Server().request("daemon/restart", "post");
				new Communication().send("message", {
					status: "success",
					description: res.details,
				});
				return;
			}
			let cmd = this.commands[await whichInitSystemUserUsed()].restart;

			info(`running with root privileges: ${cmd}`);
			new Communication().send("message", {
				status: "info",
				description: `${cmd}`,
				title: "Running with root privileges.",
			});
			sudo.exec(cmd, this.#cmdOptions, async (error, stdout, stderr) => {
				if (stderr) throw stderr;
			});
		} catch (err) {
			throw err.toString();
		}
	}
	async isActive() {
		try {
			if (new Server().isConnected()) {
				let res = await new Server().request("daemon", "get");
				return res.is_active;
			}
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
		} catch (err) {
			console.dir(err, { depth: null });
			throw err.toString();
		}
	}
}

export const Daemon = new __Daemon__();
