import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";
import { knex } from "knex";
const isProd = process.env.NODE_ENV === "production";

const DB_PATH = "/var/lib/vnstat/vnstat.db";

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
		minWidth: 550,
		minHeight: 200,
	});

	if (isProd) {
		await mainWindow.loadURL("app://./index.html");
	} else {
		const port = process.argv[2];
		await mainWindow.loadURL(`http://localhost:${port}/`);
		mainWindow.webContents.openDevTools();
	}

	ipcMain.on("getMonthData", async () => {
		const result = await getDataFromDB("day");
		mainWindow.webContents.send("monthData", result);
		return result;
	});

	ipcMain.on("getDayData", async () => {
		const result = await getDataFromDB("hour").then((res) =>
			mainWindow.webContents.send("dayData", res),
		);

		return result;
	});
	ipcMain.on("getYearData", async () => {
		const result = await getDataFromDB("month");
		mainWindow.webContents.send("yearData", result);
		return result;
	});
})();

app.on("window-all-closed", () => {
	app.quit();
});
