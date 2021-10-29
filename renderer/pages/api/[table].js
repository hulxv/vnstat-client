import { knex } from "knex";

export default async function getTableData(req, res) {
	const db = await knex({
		client: "sqlite",
		connection: {
			filename: process.env.NEXT_PUBLIC_DB_PATH,
		},
	});
	const result = await db(req.query.table).select();

	console.log("result", result);
	res.status(200).json(result);
}
