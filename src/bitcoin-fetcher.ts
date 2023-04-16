// Use the coindesk API to fetch the price of BTC and print it to the console every second
import axios from "axios";

setInterval(() => {
	axios
		.get("https://api.coindesk.com/v1/bpi/currentprice.json")
		.then((response) => {
			const price = response.data.bpi.USD.rate_float;
			console.log(`Bitcoin price: $${price.toFixed(2)}`);
		})
		.catch((error) => {
			console.error(error);
		});
}, 1000);
