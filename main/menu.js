const { app, Menu: MENU } = require("electron");

export default class __Menu__ {
	constructor() {
		this.template = [
			{
				label: "File",
				submenu: [{ role: "quit" }],
			},
			{
				label: "View",
				submenu: [
					{ role: "reload" },
					{ role: "forceReload" },
					{ role: "toggleDevTools" },
					{ type: "separator" },
					{ role: "resetZoom" },
					{ role: "zoomIn" },
					{ role: "zoomOut" },
					{ type: "separator" },
					{ role: "togglefullscreen" },
				],
			},
			{
				label: "Window",
				submenu: [
					{ role: "minimize" },
					{ role: "zoom" },
					{ role: "close" },
				],
			},
			{
				role: "help",
				submenu: [
					{
						label: "Issues",
						click: async () => {
							const { shell } = require("electron");
							await shell.openExternal(
								"https://github.com/Hulxv/vnstat-client/issues"
							);
						},
					},
					{
						label: "Open Issue",
						click: async () => {
							const { shell } = require("electron");
							await shell.openExternal(
								"https://github.com/Hulxv/vnstat-client/issues/new/choose"
							);
						},
					},
				],
			},
		];
		this.menu = MENU.buildFromTemplate(this.template);
		MENU.setApplicationMenu(this.menu);
	}
}

export const Menu = () => new __Menu__();
