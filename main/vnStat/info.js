import vnDB from "./db";
export default class vnInfo {
	#db = new vnDB();
	constructor() {
		this.info = [];
	}

	async getInfo() {
		try {
			this.info = await this.#db.Get("info");
			return this.info;
		} catch (err) {
			throw err;
		}
	}
}
