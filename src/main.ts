import axios from "axios";
import CryptoJS from "crypto-js";
import { LocalStorage } from "node-localstorage";

import { getMovingAveragesWithPrice } from "./mongo";
import { Candle } from "./types";

//
// ... Tick Management and requerying ...
//
setTimeout(() => {
	// Refresh Moving Average Cache
});

const localstorage = new LocalStorage("./localstorage");

var isPositionOpened = false;

const api_key = process.env.COINBASE_API_KEY || "";
const api_secret = process.env.COINBASE_API_SECRET || "";

const buyVar = process.env.BUY_AMOUNT || "100.0";
if (buyVar.toUpperCase().includes("MAX")) {
	// Use max funds. Where should we get this from? Database? A call to Coinbase? Another service updating from a Webhook?
}

const sellVar = process.env.SELL_AMOUNT || "100.0";
if (sellVar.toUpperCase().includes("MAX")) {
	// Use max funds. Where should we get this from? Database? A call to Coinbase? Another service updating from a Webhook?
}

const main = async () => {
	const price: number = await fetchPrice();
	console.log(price); // Let us know you're alive

	const averages = await getMovingAveragesWithPrice(price); // Caching handled within function

	if (averages) {
		if (
			isPositionOpened == false &&
			averages.ma7 > averages.ma21 &&
			averages.ma7 > averages.ma55
		) {
			// Open a position
			console.log(
				`MA crossover detected. Buying a position @ ${price.toString()}`
			);
			const orderResponse = await sendMockBuyOrder();
			const order = await orderResponse;

			// const orderResponse = await sendBuyOrder();
			// const order = await orderResponse.json();
			// if (order.status == "200" || order.status == "201") {
			if (order.data.success === true) {
				isPositionOpened = true;
				const assetAmount = 100.0 / price;

				console.log(
					`Buy Order successful. Bought ${assetAmount.toString()} BTC @ ${price.toString()}`
				);

				localStorage.setItem(`assetAmount-BTC`, assetAmount.toString());
				localStorage.setItem(`entryPrice-BTC`, price.toString());
			}
		} else if (
			isPositionOpened == true &&
			(averages.ma7 < averages.ma21 || averages.ma7 < averages.ma55)
		) {
			// Close a position
			console.log(
				`MA correction detected. Selling a position @ ${price.toString()}`
			);

			var assetAmount: number;
			var entryPrice: number;
			var base_size: number;

			const assetAmountString = localStorage.getItem(`assetAmount-BTC`);
			if (!assetAmountString) {
				// throw new Error("Asset Amount is null.");
				assetAmount = -1;
			} else {
				assetAmount = parseFloat(assetAmountString);
			}

			const entryPriceString = localStorage.getItem(`entryPrice-BTC`);
			if (!entryPriceString) {
				// throw new Error("Entry Price is null.");
				entryPrice = -1;
			} else {
				entryPrice = parseFloat(entryPriceString);
			}

			if (
				sellVar.toUpperCase().includes("MAX") &&
				assetAmount > 0 &&
				entryPrice > 0
			) {
				base_size = assetAmount * (price / entryPrice);
			} else {
				base_size = parseFloat(sellVar) / price;
			}
			const orderResponse = await sendMockSellOrder(base_size);
			const order = await orderResponse;

			// const orderResponse = await sendSellOrder(base_size);
			// const order = await orderResponse.json();
			// if (orderResponse.status == "200" || orderResponse.status == "201") {
			if (order.data.success === true) {
				isPositionOpened = false;

				localStorage.setItem(`assetAmount-BTC`, "");
				localStorage.setItem(`entryPrice-BTC`, "");

				console.log(
					`Sell Order successful. Sold ${base_size.toString()} BTC @ ${price.toString()}`
				);
				var profit: number;
				var realProfit: number;

				if (assetAmount > 0 && entryPrice > 0) {
					profit = price / entryPrice;
					// if (price > entryPrice) {
					// 	profit = price / entryPrice;
					// 	// realProfit;
					// } else {
					// 	profit = price / entryPrice;
					// 	// realProfit = (base_size * price) / (assetAmount * entryPrice);
					// }
					if (profit >= 1.0) {
						console.log(`Made ${((profit - 1) * 100).toString()}% gain`);
						// send to Database/Analytics Dashboard
					} else {
						console.log(`Lost ${((1 - profit) * 100).toString()}%`);
						// send to Database/Analytics Dashboard
					}
				}
			}
		}
	} else {
		console.log("Moving Averages returned as undefined.");
	}
};

const fetchPrice = async (): Promise<number> => {
	const response = await fetch(
		"https://api.coindesk.com/v1/bpi/currentprice.json",
		{ method: "GET" }
	);
	const responseData = await response.json();

	return responseData.bpi.USD.rate_float;
};

const createSignature = (inputString: string, secret: string) => {
	const hash = CryptoJS.HmacSHA256(inputString, secret);
	return hash.toString();
};

const sendMockBuyOrder = async () => {
	return {
		status: "200",
		data: {
			success: true,
		},
	};
};

const sendMockSellOrder = async (base_size: number) => {
	return {
		status: "200",
		data: {
			success: true,
		},
	};
};

const sendBuyOrder = async () => {
	if (api_key === "") {
		throw new Error("No API key found.");
	}

	if (api_secret === "") {
		throw new Error("No API key secret found.");
	}

	const timestamp = Math.floor(Date.now() / 1000).toString();
	const method = "POST";
	const requestPath = "/api/v3/brokerage/orders";
	const body = JSON.stringify({
		client_order_id: Date.now().toString(),
		product_id: "BTC-USD",
		side: "BUY",
		order_configuration: {
			market_market_ioc: {
				quote_size: "100",
			},
		},
	});

	const signature = createSignature(
		timestamp + method + requestPath + body,
		api_secret
	);

	const buyResponse = await fetch(
		// `https://api.coinbase.com/api/v3/brokerage/orders`,
		`https://api.coinbase.com${requestPath}`,
		{
			method,
			headers: {
				"CB-ACCESS-KEY": api_key,
				"CB-ACCESS-TIMESTAMP": timestamp,
				"CB-ACCESS-SIGN": signature,
				"Content-Type": "application/json",
			},
			body,
		}
	);

	return buyResponse;
};

const sendSellOrder = async (base_size: number) => {
	if (api_key === "") {
		throw new Error("No API key found.");
	}

	if (api_secret === "") {
		throw new Error("No API key secret found.");
	}

	const timestamp = Math.floor(Date.now() / 1000).toString();
	const method = "POST";
	const requestPath = "/api/v3/brokerage/orders";
	const body = JSON.stringify({
		client_order_id: Date.now().toString(),
		product_id: "BTC-USD",
		side: "SELL",
		order_configuration: {
			market_market_ioc: {
				base_size: base_size.toString(),
			},
		},
	});

	const signature = createSignature(
		timestamp + method + requestPath + body,
		api_secret
	);

	const sellResponse = await fetch(
		// `https://api.coinbase.com/api/v3/brokerage/orders`,
		`https://api.coinbase.com${requestPath}`,
		{
			method,
			headers: {
				"CB-ACCESS-KEY": api_key,
				"CB-ACCESS-TIMESTAMP": timestamp,
				"CB-ACCESS-SIGN": signature,
				"Content-Type": "application/json",
			},
			body,
		}
	);

	return sellResponse;
};

setInterval(async () => {
	await main();
}, 60000);
