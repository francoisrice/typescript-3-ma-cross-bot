import axios from "axios";

const interval = 30 * 60 * 1000; // 30 minutes in milliseconds
const timestamps: number[] = [];
const prices: number[] = [];

// Get price data from the queue
// const pull = () => {}

// Collect price data for 30 minutes
const start_time = Date.now();
const timer = setInterval(() => {
	axios
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

	// const candle = {
	// 	timeframe: Date(timestamps[0]),
	// 	timestamp: timestamps[0],
	// 	open: open_price,
	// 	high: high_price,
	// 	low: low_price,
	// 	close: close_price,
	// };

	// Print the results
	console.log(`High price: $${high_price.toFixed(2)}`);
	console.log(`Low price: $${low_price.toFixed(2)}`);
	console.log(`Open price: $${open_price.toFixed(2)}`);
	console.log(`Close price: $${close_price.toFixed(2)}`);
}, interval);
