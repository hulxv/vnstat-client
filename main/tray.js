import { Tray, Menu, app } from "electron";
import vnStat from "./vnStat";
import Updates from "./updates";
import { isProd } from "./util";
import { ICON_NAME } from "./constants";

export default class __TrayIcon__ {
	constructor() {
		this.tray = null;
		this.icon = `${
			isProd ? `${__dirname}/images` : "renderer/public/images"
		}/${ICON_NAME}`;
		this.menuItems = Menu.buildFromTemplate([
			{ label: "Check for updates", click: new Updates().check },
			{ label: "Quit", click: app.quit },
		]);
	}
	async init() {
		let traffic = await new vnStat().traffic().getSummary();
		let todayData = traffic.filter(e => e.interval === "today").at(0).data;
		this.tray = new Tray(this.icon);
		this.tray.setToolTip(`Down: ${todayData.rx}, Up: ${todayData.tx}`);
		this.tray.setContextMenu(this.menuItems);
	}
}

export const TrayIcon = new __TrayIcon__();
