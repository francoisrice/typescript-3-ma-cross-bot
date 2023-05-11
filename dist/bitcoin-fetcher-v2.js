"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// bitcoin-fetcher-v2.ts
const fs = __importStar(require("fs"));
const axios_1 = __importDefault(require("axios"));
const prices = [];
let start_time;
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
    axios_1.default
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
//# sourceMappingURL=bitcoin-fetcher-v2.js.map