"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStationsByAccess = void 0;
const express_1 = __importDefault(require("express"));
const Stations_1 = __importDefault(require("../models/Stations"));
const router = express_1.default.Router();
const getStationsByAccess = async (req, res) => {
    try {
        const alldata = await Stations_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getStationsByAccess = getStationsByAccess;
exports.default = router;
