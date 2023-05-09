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
	try {
		// Connect to the MongoDB database
		await client.connect();
		const database = client.db("dev");
		const collection = database.collection("BTCprices");

		// Find the latest 55 documents
		const cursor55 = collection.find().sort({ $natural: -1 }).limit(55);
		let docs55 = await cursor55.toArray();

		// Calculate the moving average for the last 55 documents
		const ma55 = calculateMovingAverage(docs55, currentPrice);

		// Find the latest 21 documents
		const docs21 = docs55.slice(0, 21);
		const ma21 = calculateMovingAverage(docs21, currentPrice);

		// Find the latest 7 documents
		const docs7 = docs55.slice(0, 7);

		// Calculate the moving average for the last 7 documents
		const ma7 = calculateMovingAverage(docs7, currentPrice);

		// Print the results
		console.log(`Moving average for the last 55 documents: ${ma55.toFixed(2)}`);
		console.log(`Moving average for the last 21 documents: ${ma21.toFixed(2)}`);
		console.log(`Moving average for the last 7 documents: ${ma7.toFixed(2)}`);
		return ma55.toFixed(2), ma21.toFixed(2), ma7.toFixed(2);
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
