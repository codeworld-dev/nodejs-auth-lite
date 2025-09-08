"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectToDatabase = async () => {
    try {
        const mongoURI = 'mongodb://localhost:27017/Node';
        await mongoose_1.default.connect(mongoURI);
        console.log(`Database is connected to MongoDB at ${mongoURI}`);
    }
    catch (err) {
        console.error(err);
    }
};
exports.connectToDatabase = connectToDatabase;
