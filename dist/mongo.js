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
exports.sendToMongo = void 0;
require("dotenv").config();
const mongodb_1 = require("mongodb");
// const uri =
// 	"mongodb+srv://<username>:<password>@<cluster>.mongodb.net/test?retryWrites=true&w=majority";
const uri = process.env.MONGO_URI || "";
if (uri === "") {
    console.error("MONGO_URI not set");
}
const client = new mongodb_1.MongoClient(uri);
// export const sendToMongo = async (client: MongoClient, candle: Candle) => {
const sendToMongo = (candle) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        const db = client.db("mydb");
        const collection = db.collection("prices");
        collection.insertOne(candle);
    }
    catch (err) {
        if (err) {
            console.error(err);
            return;
        }
    }
    finally {
        client.close();
    }
});
exports.sendToMongo = sendToMongo;
//# sourceMappingURL=mongo.js.map