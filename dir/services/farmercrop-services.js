"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFarmerCrops = void 0;
const express_1 = __importDefault(require("express"));
const FarmerCrop_1 = __importDefault(require("../models/FarmerCrop"));
const router = express_1.default.Router();
const getFarmerCrops = async (req, res) => {
    try {
        const alldata = await FarmerCrop_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getFarmerCrops = getFarmerCrops;
exports.default = router;
