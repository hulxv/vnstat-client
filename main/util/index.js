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
	console.log("init ", initSystem);
	console.log(stdout);
	return initSystem;
}

export async function isInitSystemSupported(initSystem) {
	const supportedInitSystems = ["systemd"];
	return supportedInitSystems.includes(initSystem);
}

export function convertObjectItemForSedScript(key, value) {
	return `s/${key}.*/${key} ${value}/g`;
}
