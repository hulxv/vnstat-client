const util = require("util");
const exec = util.promisify(require("child_process").exec);

export async function whichInitSystemUserUsed() {
	const supportedInitSys = ["sysvinit", "systemd"];

	let bash = `
    strings /sbin/init |
  awk 'match($0, /(${supportedInitSys.join(
		"|",
	)})/) { print tolower(substr($0, RSTART, RLENGTH));exit; }'
`;
	try {
		const { stdout, stderr } = await exec(bash);
		if (stderr) throw stderr;
		return stdout.replace(/\n/, "").trim().length <= 0
			? null
			: stdout.replace(/\n/, "");
	} catch (err) {
		throw err;
	}
}

export async function isInitSystemSupported(initSystem) {
	initSystem = initSystem ?? (await whichInitSystemUserUsed());
	return Boolean(initSystem);
}

export function convertObjectItemForSedScript(key, value) {
	return `s/.*${key} .*/${key} ${value}/g`;
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

export async function vnStatIsInstalled() {
	let bash = `        
if ! [ -x "$(command -v vnstat)" ]; then
  echo "false"
  else echo "true"
  exit 1
fi`;

	try {
		const { stdout, stderr } = await exec(bash);
		if (stderr) throw stderr;
		return stdout.includes("true");
	} catch (err) {
		return err;
	}
}

export const isProd = process.env.NODE_ENV === "production";

export function isJson(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
