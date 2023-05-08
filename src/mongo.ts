require("dotenv").config();
import { MongoClient } from "mongodb";

import { Candle } from "./types";

// const uri =
// 	"mongodb+srv://<username>:<password>@<cluster>.mongodb.net/test?retryWrites=true&w=majority";
const uri = process.env.MONGO_URI || "";
if (uri === "") {
	console.error("MONGO_URI not set");
}
const client = new MongoClient(uri);

export const sendBTCTickToMongo = async (candle: Candle) => {
	try {
		await client.connect();

		const result = await client
			.db("dev")
			.collection("BTCprices")
			.insertOne(candle);

		return `New tick recorded: ${result.insertedId}`;
	} catch (err) {
		if (err) {
			console.error(err);
			return;
		}
	} finally {
		client.close();
	}
};
