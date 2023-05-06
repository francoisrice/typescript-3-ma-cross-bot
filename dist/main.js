"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const axios_1 = __importDefault(require("axios"));
const mongo_1 = require("./mongo");
const interval = 30 * 60 * 1000; // 30 minutes in milliseconds
const timestamps = [];
const prices = [];
var candle = null;
// Get price data from the queue
// const pull = () => {}
// Collect price data for 30 minutes
const start_time = Date.now();
const timer = setInterval(() => {
    axios_1.default
        .get("https://api.coindesk.com/v1/bpi/currentprice.json")
        .then((response) => {
        const price = response.data.bpi.USD.rate_float;
        const timestamp = Date.now();
        timestamps.push(timestamp);
        prices.push(price);
    })
        .catch((error) => {
        console.error(error);
    });
}, 1000);
// Wait for 30 minutes
setTimeout(() => {
    clearInterval(timer);
    // Find the high, low, open, and close prices
    const high_price = Math.max(...prices);
    const low_price = Math.min(...prices);
    const open_price = prices[0];
    const close_price = prices[prices.length - 1];
    candle = {
        timeframe: "TODO: timestamp to ISO 8601",
        timestamp: timestamps[0],
        open: open_price,
        high: high_price,
        low: low_price,
        close: close_price,
    };
    (0, mongo_1.sendToMongo)(candle);
    // const uri =
    // 	"mongodb+srv://<username>:<password>@<cluster>.mongodb.net/test?retryWrites=true&w=majority";
    // const client = new MongoClient(uri);
    // try {
    // 	await client.connect();
    // 	const db = client.db("mydb");
    // 	const collection = db.collection("prices");
    // 	collection.insertOne(candle);
    // } catch (err) {
    // 	if (err) {
    // 		console.error(err);
    // 		return;
    // 	}
    // } finally {
    // 	client.close();
    // }
    // Print the results
    console.log(`High price: $${high_price.toFixed(2)}`);
    console.log(`Low price: $${low_price.toFixed(2)}`);
    console.log(`Open price: $${open_price.toFixed(2)}`);
    console.log(`Close price: $${close_price.toFixed(2)}`);
}, interval);
//# sourceMappingURL=main.js.map