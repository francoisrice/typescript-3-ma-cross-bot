require("dotenv").config();
import { MongoClient } from "mongodb";

import { Candle } from "./types";

// const uri =
// 	"mongodb+srv://<username>:<password>@<cluster>.mongodb.net/test?retryWrites=true&w=majority";
const uri = process.env.MONGO_URI;

if (uri === "") {
	console.error("MONGO_URI not set");
}

const environment = process.env.ENVIROMENT;
var env: string;
if (process.env.ENVIROMENT?.toUpperCase().includes("PROD")) {
	env = "prod";
} else {
	env = process.env.ENVIROMENT?.toLowerCase() || "dev";
}

const client = new MongoClient(process.env.MONGO_URI || "");

if (client) {
	console.log("Mongo Client Connected");
}

export const sendBTCTickToMongo = async (candle: Candle) => {
	try {
		await client.connect();

		const result = await client
			.db(env)
			.collection("BTCprices")
			.insertOne(candle);

		console.log(`New tick recorded: ${result.insertedId}`);
	} catch (err) {
		if (err) {
			console.error(err);
			return;
		}
	} finally {
		client.close();
	}
};

export async function getMovingAverages() {
	try {
		// Connect to the MongoDB database
		await client.connect();
		const database = client.db("dev");
		const collection = database.collection("BTCprices");

		// Find the latest 55 documents
		//   fetchLatestPricesFromMongo()
		const cursor55 = collection.find().sort({ $natural: -1 }).limit(55);
		let docs55 = await cursor55.toArray();

		// Calculate the moving average for the last 55 documents
		const ma55 =
			docs55.reduce((acc, doc) => acc + parseFloat(doc.close), 0) /
			docs55.length;

		// Find the latest 21 documents
		const docs21 = docs55.slice(0, 21);

		// Calculate the moving average for the last 21 documents
		const ma21 =
			docs21.reduce((acc, doc) => acc + parseFloat(doc.close), 0) /
			docs21.length;

		// Find the latest 7 documents
		const docs7 = docs55.slice(0, 7);

		// Calculate the moving average for the last 7 documents
		const ma7 =
			docs7.reduce((acc, doc) => acc + parseFloat(doc.close), 0) / docs7.length;

		// Print the results
		console.log(`Moving average for the last 55 documents: ${ma55.toFixed(2)}`);
		console.log(`Moving average for the last 21 documents: ${ma21.toFixed(2)}`);
		console.log(`Moving average for the last 7 documents: ${ma7.toFixed(2)}`);
	} catch (err) {
		if (err) {
			console.error(err);
			return;
		}
	} finally {
		client.close();
	}
}

export async function getMovingAveragesWithPrice(currentPrice: number) {
	// Cache Averages and Pull from Cache if within 30 minute period

	try {
		// Connect to the MongoDB database
		await client.connect();
		const database = client.db("dev");
		const collection = database.collection("BTCprices");

		// Find the latest 55 documents
		const cursor55 = collection.find().sort({ $natural: -1 }).limit(55);
		let docs55 = await cursor55.toArray();

		// Calculate the moving average for the last 55 documents
		const rawMa55 = calculateMovingAverage(docs55, currentPrice);

		// Find the latest 21 documents
		const docs21 = docs55.slice(0, 21);
		const rawMa21 = calculateMovingAverage(docs21, currentPrice);

		// Find the latest 7 documents
		const docs7 = docs55.slice(0, 7);

		// Calculate the moving average for the last 7 documents
		const rawMa7 = calculateMovingAverage(docs7, currentPrice);

		// Print the results
		console.log(
			`Moving average for the last 55 documents: ${rawMa55.toFixed(2)}`
		);
		console.log(
			`Moving average for the last 21 documents: ${rawMa21.toFixed(2)}`
		);
		console.log(
			`Moving average for the last 7 documents: ${rawMa7.toFixed(2)}`
		);
		const ma55 = rawMa55.toFixed(2);
		const ma21 = rawMa21.toFixed(2);
		const ma7 = rawMa7.toFixed(2);

		return { ma55, ma21, ma7 };
	} catch (error) {
		console.error(error);
	} finally {
		await client.close();
	}
}

const fetchLatestPricesFromMongo = async (priceLength: number = 55) => {
	try {
		await client.connect();
		const database = client.db("dev");
		const collection = database.collection("BTCprices");

		// Find the latest 55 documents
		const cursor55 = collection
			.find()
			.sort({ $natural: -1 })
			.limit(priceLength);
		let docs55 = await cursor55.toArray();
		return docs55;
	} catch (error) {
		console.error(error);
	} finally {
		await client.close();
	}
};

const calculateMovingAverage = (
	docs: any[],
	currentPrice: number,
	length: number = 0
): number => {
	if (length === 0) length = docs.length;

	let sum = 0;
	let count = 0;

	for (let i = docs.length - length; i < docs.length - 1; i++) {
		if (i >= 0) {
			sum += parseFloat(docs[i].close);
			count++;
		}
	}

	if (currentPrice) {
		sum += currentPrice;
		count++;
	} else {
		sum += parseFloat(docs[docs.length].close);
		count++;
	}

	return sum / count;
};
