"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBounceInsights = exports.getBounceProducts = exports.addBounceProduct = void 0;
const express_1 = __importDefault(require("express"));
const BounceProducts_1 = __importDefault(require("../models/BounceProducts"));
//import {Long} from 'bson';
const router = express_1.default.Router();
const addBounceProduct = async (req, res) => {
    try {
        const { BounceProductId, StationId, OutletLegalName, BounceDate, Mobile, FarmerName, ProductPack, Qty, ProductId } = req.body;
        // Check for missing fields
        const requiredFields = ['BounceProductId', 'StationId', 'OutletLegalName', 'ProductId', 'Mobile', 'BounceDate', 'FarmerName', 'ProductPack', 'Qty',];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Data is not sending correctly",
                missingFields
            });
        }
        let bounceProducts = null;
        const createdBy = req.user ? req.user.UserName : null;
        // If BounceProductId equals "0", create a new record
        if (BounceProductId === "0") {
            // Creating a new BounceProducts record
            const latestBounceProduct = await BounceProducts_1.default.findOne({}, { BounceProductId: 1 }, { sort: { BounceProductId: -1 } });
            const lastId = latestBounceProduct ? parseInt(latestBounceProduct.BounceProductId.slice(3)) : 0;
            const newBounceProductId = 'BPR' + ('0000' + (lastId + 1)).slice(-4);
            //const randomId = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
            bounceProducts = new BounceProducts_1.default({
                // _id: randomId,
                BounceProductId: newBounceProductId,
                StationId,
                OutletLegalName,
                FarmerName,
                Mobile,
                Qty,
                ProductId,
                ProductPack,
                BounceDate: formatDate(BounceDate),
                CreatedDate: Date.now(),
                CreatedBy: createdBy
            });
            await bounceProducts.save();
            return res.status(200).send("BounceProducts record added successfully");
        }
        // If BounceProductId is provided and not "0", update the existing record
        bounceProducts = await BounceProducts_1.default.findOneAndUpdate({ BounceProductId }, {
            Mobile,
            StationId,
            OutletLegalName,
            ProductPack,
            Qty,
            FarmerName,
            BounceDate: formatDate(BounceDate),
            UpdatedDate: Date.now(),
            UpdatedBy: createdBy
        }, { upsert: true, new: true });
        if (bounceProducts) {
            return res.status(200).send("BouncePRoducts record updated successfully");
        }
        else {
            console.log("Failed to update/create BounceProducts record");
            return res.status(500).send("Internal Server Error");
        }
    }
    catch (err) {
        // Handle errors
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.addBounceProduct = addBounceProduct;
function formatDate(dateString) {
    const parts = dateString.split('-');
    const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000+0000`);
    return formattedDate.toISOString();
}
const getBounceProducts = async (req, res) => {
    try {
        const alldata = await BounceProducts_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getBounceProducts = getBounceProducts;
const getBounceInsights = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds } = req.body;
        if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds)) {
            return res.status(400).json({ message: "FromDate, ToDate, and StationIds are required and should be valid" });
        }
        // Parse the FromDate and ToDate
        const fromDateParsed = new Date(FromDate.split('-').reverse().join('-'));
        const toDateParsed = new Date(ToDate.split('-').reverse().join('-'));
        toDateParsed.setDate(toDateParsed.getDate() + 1); // To include the end date
        if (isNaN(fromDateParsed.getTime()) || isNaN(toDateParsed.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }
        const insights = await BounceProducts_1.default.aggregate([
            {
                $match: {
                    StationId: { $in: StationIds },
                    CreatedDate: { $gte: fromDateParsed, $lt: toDateParsed }
                }
            },
            {
                $group: {
                    _id: { StationId: "$StationId", OutletLegalName: "$OutletLegalName", ProductPack: "$ProductPack" },
                    Count: { $sum: 1 },
                    TotalQty: { $sum: "$Qty" }
                }
            },
            {
                $project: {
                    _id: 0,
                    StationId: "$_id.StationId",
                    ProductPack: "$_id.ProductPack",
                    OutletLegalName: "$_id.OutletLegalName",
                    Count: 1,
                    TotalQty: 1
                }
            }
        ]);
        return res.json(insights);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getBounceInsights = getBounceInsights;
exports.default = router;
