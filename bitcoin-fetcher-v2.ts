// bitcoin-fetcher-v2.ts
import * as fs from "fs";
import axios from "axios";

const prices: number[] = [];
let start_time: number;

function computeHighLowOpenClose() {
	// Find the high, low, open, and close prices
	const high_price = Math.max(...prices);
	const low_price = Math.min(...prices);
	const open_price = prices[0];
	const close_price = prices[prices.length - 1];

	// Create an object with the prices and timestamp
	const timestamp = new Date().toISOString();
	const price_object = {
		timestamp,
		open: open_price.toFixed(2),
		close: close_price.toFixed(2),
		high: high_price.toFixed(2),
		low: low_price.toFixed(2),
	};

	// Write the object to a JSON file
	const json = JSON.stringify(price_object);
	fs.appendFileSync("prices.json", json + "\n");

	// Reset the prices array
	prices.length = 0;
}

function fetchPrice() {
	axios
		.get("https://api.coindesk.com/v1/bpi/currentprice.json")
		.then((response) => {
			const price = response.data.bpi.USD.rate_float;

			console.log(price); // Let us know you're alive

			const timestamp = Date.now();

			if (!start_time) {
				start_time = timestamp;
			}

			if (timestamp % (30 * 60 * 1000) <= 60000) {
				console.log("30 minutes have passed");
				computeHighLowOpenClose();
				start_time = timestamp;
			}

			prices.push(price);
		})
		.catch((error) => {
			console.error(error);
		});
}

// setInterval(fetchPrice, 1000); // Price only refreshes every minute
setInterval(fetchPrice, 60000);
