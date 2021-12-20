import { isInitSystemSupported, whichInitSystemUserUsed } from "../util";
import { error } from "electron-log";
import sudo from "sudo-prompt";

export default class Daemon {
	#cmdOptions = {
		name: "vnStat Client",
	};
	constructor() {}

	async isActive() {
		try {
			if (await isInitSystemSupported()) {
				const { stdout, stderr } = await exec(`systemctl is-active vnstat`);
				if (stderr) throw stderr;
				console.log("output =>", stdout);
				return stdout === "active";
			}
		} catch (err) {
			error(err);
			return;
		}
		error(
			`${await whichInitSystemUserUsed()} init system isn't supported yet.`,
		);
	}
	async start() {
		try {
			if (await isInitSystemSupported()) {
				sudo.exec(
					"sudo systemctl start vnstat",
					this.#cmdOptions,
					(error, stdout, stderr) => {
						if (error) throw error;
					},
				);
			}
		} catch (err) {
			error(err);
			return;
		}
		error(
			`${await whichInitSystemUserUsed()} init system isn't supported yet.`,
		);
	}
	async stop() {
		try {
			if (await isInitSystemSupported()) {
				sudo.exec(
					"sudo systemctl stop vnstat",
					this.#cmdOptions,
					(error, stdout, stderr) => {
						if (error) throw error;
					},
				);
			}
		} catch (err) {
			error(err);
			return;
		}
		error(
			`${await whichInitSystemUserUsed()} init system isn't supported yet.`,
		);
	}
}
