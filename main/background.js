import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { knex } from "knex";
const isProd = process.env.NODE_ENV === "production";

const DB_PATH = "/var/lib/vnstat/vnstat.db";
console.log(process.env);
const db = knex({
	client: "sqlite",
	connection: {
		filename: DB_PATH,
	},
	useNullAsDefault: false,
});
async function getDataFromDB(table) {
	const result = await db(table).select();

	return result;
}

if (isProd) {
	serve({ directory: "app" });
} else {
	app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
	await app.whenReady();

	const mainWindow = createWindow("main", {
		width: 1000,
		height: 600,
	});

	if (isProd) {
		await mainWindow.loadURL("app://./index.html");
	} else {
		const port = process.argv[2];
		await mainWindow.loadURL(`http://localhost:${port}/`);
		mainWindow.webContents.openDevTools();
	}
	ipcMain.on("getMonthData", async () => {
		const result = getDataFromDB("day");
		result.then((rows) => mainWindow.webContents.send("monthData", rows));
	});
	ipcMain.on("getDayData", async () => {
		const result = getDataFromDB("hour");
		result.then((rows) => mainWindow.webContents.send("dayData", rows));
	});
	ipcMain.on("getYearData", async () => {
		const result = getDataFromDB("month");
		result.then((rows) => mainWindow.webContents.send("yearData", rows));
	});
})();

app.on("window-all-closed", () => {
	app.quit();
});
