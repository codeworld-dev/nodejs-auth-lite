"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmerLedger = exports.FarmerLatestHistory = exports.getFarmers = void 0;
const express_1 = __importDefault(require("express"));
const FieldVisit_1 = __importDefault(require("../models/FieldVisit"));
const SaleTransHeader_1 = __importDefault(require("../models/SaleTransHeader"));
const SaleTransactions_1 = __importDefault(require("../models/SaleTransactions"));
const FarmerRegistration_1 = __importDefault(require("../models/FarmerRegistration"));
const router = express_1.default.Router();
const getFarmers = async (req, res) => {
    try {
        const alldata = await FarmerRegistration_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getFarmers = getFarmers;
const FarmerLatestHistory = async (req, res) => {
    try {
        const farmerLocalId = req.body.FarmerLocalId;
        console.log("Received FarmerLocalId:", farmerLocalId);
        const LatestFarmer = await FarmerRegistration_1.default.findOne({ FarmerLocalId: farmerLocalId });
        console.log("Found Farmer:", LatestFarmer);
        if (!LatestFarmer) {
            console.log("Farmer not found for FarmerLocalId:", farmerLocalId);
            return res.status(404).json({ error: "Farmer not found" });
        }
        const LatestFarmerFieldVisit = await FieldVisit_1.default.aggregate([
            { $match: { FarmerLocalId: farmerLocalId } },
            { $sort: { CreatedDate: -1 } },
            { $limit: 1 },
            { $unset: ["_id"] }
        ]);
        console.log("Latest FarmerFieldVisit:", LatestFarmerFieldVisit);
        const LatestSaleTransHeader = await SaleTransHeader_1.default.aggregate([
            { $match: { FarmerLocalId: farmerLocalId } },
            { $sort: { CreatedDate: -1 } },
            { $limit: 1 },
            { $unset: ["_id", "HeaderId"] }
        ]);
        console.log("Latest SaleTransHeader:", LatestSaleTransHeader);
        const LatestSaleTransactions = await SaleTransactions_1.default.aggregate([
            { $match: { FarmerLocalId: farmerLocalId } },
            { $sort: { CreatedDate: -1 } },
            { $limit: 1 },
            { $unset: ["_id", "HeaderId"], }
        ]);
        console.log("Latest SaleTransactions:", LatestSaleTransactions);
        return res.json({ LatestFarmer, LatestFarmerFieldVisit, LatestSaleTransHeader, LatestSaleTransactions });
    }
    catch (err) {
        console.error("Error finding farmer:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.FarmerLatestHistory = FarmerLatestHistory;
// export const FarmerLatestHistory = async (req: Request, res: Response) => {
//     try {
//         const farmerId = req.body.FarmerId; 
//         console.log("Received FarmerId:", farmerId);
//         const LatestFarmer = await Farmer.findOne({ FarmerId: farmerId });
//         console.log("Found Farmer:", LatestFarmer);
//         if (!LatestFarmer) {
//             console.log("Farmer not found for FarmerId:", farmerId);
//             return res.status(404).json({ error: "Farmer not found" });
//         }
//         const LatestFarmerFieldVisit = await FarmerFieldVisit.aggregate([
//             { $match: { FarmerId: farmerId } },
//             { $sort: { CreatedDate: -1 } },
//             { $limit: 1 },
//             { $unset: ["_id"] }
//         ]);
//         console.log("Latest FarmerFieldVisit:", LatestFarmerFieldVisit);
//         const LatestSaleTransHeader = await SaleTransHeader.aggregate([
//             { $match: { FarmerId: farmerId } },
//             { $sort: { CreatedDate: -1 } },
//             { $limit: 1 },
//             { $unset: ["_id","HeaderId"] }
//         ]);
//         console.log("Latest SaleTransHeader:", LatestSaleTransHeader);
//         const LatestSaleTransactions = await SaleTransactions.aggregate([
//             { $match: { FarmerId: farmerId } },
//             { $sort: { CreatedDate: -1 } },
//             { $limit: 1 },
//             { $unset: ["_id","HeaderId"], }
//         ]);
//         console.log("Latest SaleTransactions:", LatestSaleTransactions);
//         return res.json({ LatestFarmer, LatestFarmerFieldVisit, LatestSaleTransHeader, LatestSaleTransactions });
//     } catch (err) {
//         console.error("Error finding farmer:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// };
// export const FarmerLedger = async (req: Request, res: Response) => {
//     try {
//         const farmerId = req.body.FarmerId; 
//         console.log("Received FarmerId:", farmerId);
//         const FarmerLedger = await FarmerRegistration.findOne({ FarmerId: farmerId });
//         console.log("Found Farmer:", FarmerLedger);
//         if (!FarmerLedger) {
//             console.log("Farmer not found for FarmerId:", farmerId);
//             return res.status(404).json({ error: "Farmer not found" });
//         }
//         const FarmerFieldVisitLedger = await FarmerFieldVisit.aggregate([
//             { $match: { FarmerId: farmerId } },
//             { $unset: ["_id"] }
//         ]);
//         console.log("Latest FarmerFieldVisit:", FarmerFieldVisitLedger);
//         const SaleTransHeaderLedger = await SaleTransHeader.aggregate([
//             { $match: { FarmerId: farmerId } },
//             { $unset: ["_id", "HeaderId"] }
//         ]);
//         console.log("Latest SaleTransHeader:", SaleTransHeaderLedger);
//         const SaleTransactionsLedger = await SaleTransactions.aggregate([
//             { $match: { FarmerId: farmerId } },
//             { $unset: ["_id", "HeaderId"] }
//         ]);
//         console.log("Latest SaleTransactions:", SaleTransactionsLedger);
//         return res.json({ FarmerLedger, FarmerFieldVisitLedger, SaleTransHeaderLedger, SaleTransactionsLedger });
//     } catch (err) {
//         console.error("Error finding farmer:", err);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// };
const FarmerLedger = async (req, res) => {
    try {
        const farmerLocalId = req.body.FarmerLocalId;
        console.log("Received FarmerLocalId:", farmerLocalId);
        const FarmerLedger = await FarmerRegistration_1.default.findOne({ FarmerLocalId: farmerLocalId });
        console.log("Found Farmer:", FarmerLedger);
        if (!FarmerLedger) {
            console.log("Farmer not found for FarmerLocalId:", farmerLocalId);
            return res.status(404).json({ error: "Farmer not found" });
        }
        const FarmerFieldVisitLedger = await FieldVisit_1.default.aggregate([
            { $match: { FarmerLocalId: farmerLocalId } },
            { $unset: ["_id"] }
        ]);
        console.log("Latest FarmerFieldVisit:", FarmerFieldVisitLedger);
        const SaleTransHeaderLedger = await SaleTransHeader_1.default.aggregate([
            { $match: { FarmerLocalId: farmerLocalId } },
            { $unset: ["_id", "HeaderId"] }
        ]);
        console.log("Latest SaleTransHeader:", SaleTransHeaderLedger);
        const SaleTransactionsLedger = await SaleTransactions_1.default.aggregate([
            { $match: { FarmerLocalId: farmerLocalId } },
            { $unset: ["_id", "HeaderId"] }
        ]);
        console.log("Latest SaleTransactions:", SaleTransactionsLedger);
        return res.json({ FarmerLedger, FarmerFieldVisitLedger, SaleTransHeaderLedger, SaleTransactionsLedger });
    }
    catch (err) {
        console.error("Error finding farmer:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.FarmerLedger = FarmerLedger;
exports.default = router;
