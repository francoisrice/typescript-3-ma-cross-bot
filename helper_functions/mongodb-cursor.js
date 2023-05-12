"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const mongodb_1 = require("mongodb");
// const uri = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/test?retryWrites=true&w=majority`;
const uri = process.env.MONGO_URI || "";
console.log(uri);
const client = new mongodb_1.MongoClient(uri);
const generateDataArray = () => {
    const dataArray = [];
    const start_time = new Date("2000-01-01T00:00:00.000Z").getTime();
    let current_time = start_time;
    let prev_close = Math.random() * 10000;
    for (let i = 0; i < 55; i++) {
        // Generate random prices
        const open_price = prev_close;
        const high_price = open_price + Math.random() * 1000;
        const low_price = open_price - Math.random() * 1000;
        const close_price = Math.random() * (high_price - low_price) + low_price;
        // Create an object with the prices and timestamp
        const timeframe = new Date(current_time).toISOString();
        const obj = {
            metadata: { period: "30m" },
            timeframe,
            timestamp: new Date(timeframe),
            open: open_price.toFixed(2),
            high: high_price.toFixed(2),
            low: low_price.toFixed(2),
            close: close_price.toFixed(2),
        };
        // Add the object to the array
        dataArray.push(obj);
        // Increment the current time by 30 minutes
        current_time += 30 * 60 * 1000;
    }
    return dataArray;
};
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        // await client.db("dev").createCollection("BTCprices", {
        // 	timeseries: {
        // 		timeField: "timestamp",
        // 		metaField: "metadata",
        // 		granularity: "seconds",
        // 	},
        // });
        // await addMockOHLCData(client);
        yield queryPriceData(client);
    }
    catch (err) {
        if (err) {
            console.error(err);
        }
    }
    finally {
        client.close();
    }
});
const addOHLC = (client, candle) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client
        .db("dev")
        .collection("BTCprices")
        .insertOne({
        metadata: { period: "30m" },
        timeframe: "2000-01-01T00:00:00.000Z",
        timestamp: new Date("2000-01-01T00:00:00.000Z"),
        open: 1,
        high: 1,
        low: 1,
        close: 1,
    });
    return result;
});
const addMockOHLCData = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client
        .db("dev")
        .collection("BTCprices")
        .insertMany(generateDataArray());
    return result;
});
main();
const queryPriceData = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const db = "dev";
    // const user = await client.db(db).collection("BTCprices").findOne({});
    const user = yield client
        .db(db)
        .collection("BTCprices")
        .find()
        // .sort({ $natural: -1 })
        .limit(55)
        .toArray();
    console.log(user);
    // return user;
});
//# sourceMappingURL=mongodb-cursor.js.map