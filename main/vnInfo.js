import { createProjectionState } from "framer-motion/types/render/utils/state";
import vnDB from "./vndb";
class vnInfo {
	#db = new vnDB();
	constructor() {
		this.info = {};
	}

	getInfo() {
		try {
			this.info = {
				...(await this.db("info").select().where("name", "=", "dbversion")),
			}["0"];
			return this.info;
		} catch (err) {
			throw err;
		}
	}
}
