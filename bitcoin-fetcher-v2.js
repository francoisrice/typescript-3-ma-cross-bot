"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// bitcoin-fetcher-v2.ts
var fs = require("fs");
var axios_1 = require("axios");
var prices = [];
var start_time;
function computeHighLowOpenClose() {
    // Find the high, low, open, and close prices
    var high_price = Math.max.apply(Math, prices);
    var low_price = Math.min.apply(Math, prices);
    var open_price = prices[0];
    var close_price = prices[prices.length - 1];
    // Create an object with the prices and timestamp
    var timestamp = new Date().toISOString();
    var price_object = {
        timestamp: timestamp,
        open: open_price.toFixed(2),
        close: close_price.toFixed(2),
        high: high_price.toFixed(2),
        low: low_price.toFixed(2),
    };
    // Write the object to a JSON file
    var json = JSON.stringify(price_object);
    fs.appendFileSync("prices.json", json + "\n");
    // Reset the prices array
    prices.length = 0;
}
function fetchPrice() {
    axios_1.default
        .get("https://api.coindesk.com/v1/bpi/currentprice.json")
        .then(function (response) {
        var price = response.data.bpi.USD.rate_float;
        console.log(price); // Let us know you're alive
        var timestamp = Date.now();
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
        .catch(function (error) {
        console.error(error);
    });
}
// setInterval(fetchPrice, 1000); // Price only refreshes every minute
setInterval(fetchPrice, 60000);
