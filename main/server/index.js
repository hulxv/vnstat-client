import axios from "axios";
import Store from "electron-store";
import { error } from "electron-log";
import { app } from "electron";
import fs from "fs";

const default_scheme = {
	uuid: "",
	key: {
		value: "",
		expire_at: "",
	},
	address: "",
	is_connected: false,
};
export class Server {
	constructor() {
		this.store = new Store({ name: ".server" });
		if (!fs.existsSync(`${app.getPath("userData")}/.server.json`)) {
			this.store.set(default_scheme);
		}
	}

	async connect(address, password) {
		this.store.set("address", address);
		try {
			let res = await axios.post(
				`${this.store.get("address")}/api/auth/login`,
				{
					password,
				}
			);

			this.store.set("key", res.data.data.key);
			this.store.set("uuid", res.data.data.uuid);
			this.store.set("is_connected", true);
		} catch (err) {
			throw err?.response?.data?.data?.details ?? err.toString();
		}
	}

	disconnect() {
		this.store.set("key", default_scheme.key);
		this.store.set("uuid", default_scheme.uuid);
		this.store.set("is_connected", default_scheme.is_connected);
	}

	isConnected() {
		return (
			this.store.get("is_connected") && this.store.get("address") !== ""
		);
	}

	async request(path, method, data) {
		// console.log("address", this.store.store);
		try {
			let res = await axios.request({
				method,
				url: `${this.store.get("address")}/api/${path}`,
				data,
				headers: {
					Authorization: `Bearer ${this.store.get("key.value")}`,
				},
			});

			return res.data.data;
		} catch (err) {
			// console.log(err);
			throw err?.response?.data?.data?.details ?? err.toString();
		}
	}
}
