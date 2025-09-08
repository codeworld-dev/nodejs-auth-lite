"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGRNHeadersByDate = exports.getGRNHeaders = void 0;
const express_1 = __importDefault(require("express"));
const GRNHeader_1 = __importDefault(require("../models/GRNHeader"));
const router = express_1.default.Router();
const getGRNHeaders = async (req, res) => {
    try {
        const alldata = await GRNHeader_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getGRNHeaders = getGRNHeaders;
const getGRNHeadersByDate = async (req, res) => {
    const { FromDate, ToDate, DeliveryLocationIds } = req.body;
    if (!FromDate || !ToDate || !DeliveryLocationIds) {
        return res.status(400).send("FromDate, ToDate, and DeliveryLocationIds are required");
    }
    try {
        //console.log("Request Body:", req.body);
        const fromDateParts = FromDate.split('-');
        const toDateParts = ToDate.split('-');
        const fromDate = new Date(`${fromDateParts[2]}-${fromDateParts[1]}-${fromDateParts[0]}`);
        const toDate = new Date(`${toDateParts[2]}-${toDateParts[1]}-${toDateParts[0]}`);
        toDate.setHours(23, 59, 59, 999);
        const locationIds = Array.isArray(DeliveryLocationIds)
            ? DeliveryLocationIds
            : [DeliveryLocationIds];
        const data = await GRNHeader_1.default.find({
            GRNDate: {
                $gte: fromDate,
                $lte: toDate
            },
            DeliveryLocationId: { $in: locationIds }
        }).select('SupplierName InvoiceNumber InvoiceAmount InvoiceDate DeliveryLocationId DeliveryLocationName');
        //        console.log("Query Results:", data);
        if (data.length === 0) {
            console.log("No records found for the specified criteria.");
            return res.status(404).send("No records found for the specified criteria.");
        }
        const result = data.map((item) => ({
            Date: item.InvoiceDate.toISOString().split('T')[0],
            StationId: item.DeliveryLocationId,
            StationName: item.DeliveryLocationName,
            SupplierName: item.SupplierName,
            InvoiceNumber: item.InvoiceNumber,
            InvoiceValue: item.InvoiceAmount,
            InvoiceDate: item.InvoiceDate
        }));
        return res.json(result);
    }
    catch (err) {
        console.log("Error:", err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getGRNHeadersByDate = getGRNHeadersByDate;
exports.default = router;
