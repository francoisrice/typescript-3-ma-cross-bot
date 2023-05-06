"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Use the coindesk API to fetch the price of BTC and send to fan out queue
const axios_1 = __importDefault(require("axios"));
// Collect price data
const start_time = Date.now();
setInterval(() => {
    axios_1.default
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
//# sourceMappingURL=bitcoin-fetcher.js.map