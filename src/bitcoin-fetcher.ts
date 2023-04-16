// Use the coindesk API to fetch the price of BTC and send to fan out queue
import axios from "axios";

// Collect price data
const start_time = Date.now();
setInterval(() => {
	axios
		.get("https://api.coindesk.com/v1/bpi/currentprice.json")
		.then((response) => {
			const price = response.data.bpi.USD.rate_float;
			const timestamp = Date.now();

			// Send price to fan out queue
			// push({timestamp, price})

			console.log(`Bitcoin price: $${price.toFixed(2)}`);
		})
		.catch((error) => {
			console.error(error);
		});
}, 1000);
