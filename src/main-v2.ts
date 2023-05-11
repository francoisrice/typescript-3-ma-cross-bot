import axios from "axios";

import { getMovingAveragesWithPrice } from "./mongo";
import { Candle } from "./types";

//
// ... Tick Management and requerying ...
//
setTimeout(() => {
	// Refresh Moving Average Cache
});

var isPositionOpened = false;

const api_key = process.env.COINBASE_API_KEY || "";
const api_secret = process.env.COINBASE_API_SECRET || "";

const main = async () => {
	const price = await fetchPrice();

	const averages = await getMovingAveragesWithPrice(price); // Caching handled within function

	if (averages) {
		if (
			averages.ma7 > averages.ma21 &&
			averages.ma7 > averages.ma55 &&
			isPositionOpened == false
		) {
			// Open a position
			const orderResponse = await sendBuyOrder(); // async fetch( "POST", { "order":"market", .... })
			const order = await orderResponse.json();
			// if (order.status == "200" || order.status == "201") {
			if (order.data.success === true) {
				isPositionOpened = true;
			}
		} else if (
			(averages.ma7 < averages.ma21 || averages.ma7 < averages.ma55) &&
			isPositionOpened == true
		) {
			// Close a position
			const orderResponse = await sendSellOrder(); // async fetch( "POST", { "order":"market", .... })
			const order = await orderResponse.json();
			// if (orderResponse.status == "200" || orderResponse.status == "201") {
			if (order.data.success === true) {
				isPositionOpened = false;
			}
		}
	} else {
		console.log("Moving Averages returned as undefined.");
	}
};

const fetchPrice: Promise<number> = async () => {
	const timer = setInterval(() => {
		axios
			.get("https://api.coindesk.com/v1/bpi/currentprice.json")
			.then((response) => {
				const price = response.data.bpi.USD.rate_float;

				console.log(price); // Let us know you're alive

				const timestamp = new Date();
				timestamps.push(timestamp);
				prices.push(price);
			})
			.catch((error) => {
				console.error(error);
			});
	}, 60000);
};

const sendBuyOrder = async () => {};

const sendSellOrder = async () => {};

main();
