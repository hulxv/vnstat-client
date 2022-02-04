import vnDB from "./db";
export default class __vnInfo__ {
	#db = new vnDB();
	constructor() {
		this.info = [];
	}

	async getInfo() {
		try {
			this.info = await this.#db.get("info");
			return this.info;
		} catch (err) {
			throw err;
		}
	}
}

export const vnInfo = new __vnInfo__();
