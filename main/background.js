import { app, ipcMain } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";

import Traffic from "./traffic";

const isProd = process.env.NODE_ENV === "production";

// Constants
const ICON_NAME = "icon1.png";

if (isProd) {
	serve({ directory: "app" });
} else {
	app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
	await app.whenReady();

	const mainWindow = createWindow("main", {
		width: 800,
		height: 600,
		minWidth: 650,
		minHeight: 200,
		icon: `${
			isProd ? `${__dirname}/images` : "renderer/public/images"
		}/${ICON_NAME}`,
	});

	if (isProd) {
		await mainWindow.loadURL("app://./index.html");
	} else {
		const port = process.argv[2];
		await mainWindow.loadURL(`http://localhost:${port}/`);
		mainWindow.webContents.openDevTools();
	}

	ipcMain.on("reload-data", sendingTraffic); // When user click on refresh button

	sendingTraffic(); // on app load

	async function sendingTraffic() {
		const traffic = new Traffic();

		await traffic.getData();

		mainWindow.webContents.send("sendUsage", traffic);
	}
})();

app.on("window-all-closed", () => {
	app.quit();
});
