const util = require("util");
const exec = util.promisify(require("child_process").exec);

export async function whichInitSystemUserUsed() {
	let initSystem = null;
	const { stdout, stderr } = await exec(`file /sbin/init`);
	if (stderr) throw stderr;
	let splitingOutput = stdout
		.split(" ")
		[stdout.split(" ").length - 1].split("/");
	initSystem = splitingOutput[splitingOutput.length - 1].replace("\n", "");

	return initSystem;
}

export async function isInitSystemSupported(initSystem) {
	initSystem = initSystem ?? (await whichInitSystemUserUsed());
	const supportedInitSystems = ["systemd"];
	return supportedInitSystems.includes(initSystem);
}

export function convertObjectItemForSedScript(key, value) {
	return `s/${key}.*/${key} ${value}/g`;
}

export function arrayOfObjectToCSV(data) {
	if (!(data.length > 0) && typeof data[0] !== "object") return;
	let headers = Object.keys(data[0]);
	let lines = [
		headers.join(","),
		...data.map((row) =>
			Object.keys(row)
				.map((e) => row[e])
				.join(","),
		),
	];
	return lines.join("\n");
}

export const isProd = process.env.NODE_ENV === "production";
