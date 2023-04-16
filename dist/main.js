"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Use the coindesk API to fetch the price of BTC and print it to the console every second
const axios_1 = __importDefault(require("axios"));
setInterval(() => {
    axios_1.default
        .get("https://api.coindesk.com/v1/bpi/currentprice.json")
        .then((response) => {
        const price = response.data.bpi.USD.rate_float;
        console.log(`Bitcoin price: $${price.toFixed(2)}`);
    })
        .catch((error) => {
        console.error(error);
    });
}, 1000);
//# sourceMappingURL=main.js.map