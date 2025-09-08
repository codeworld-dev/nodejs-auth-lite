"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTargetsWithActualSales = exports.getTargets = exports.addTargets = void 0;
const express_1 = __importDefault(require("express"));
const Targets_1 = __importDefault(require("../models/Targets"));
const SaleTransHeader_1 = __importDefault(require("../models/SaleTransHeader"));
//import {Long} from 'bson';
const router = express_1.default.Router();
const addTargets = async (req, res) => {
    try {
        const { TargetId, StationId, OutletLegalName, MonthId, MonthName, MonthSaleTarget, FinancialYear } = req.body;
        // Check for missing fields
        const requiredFields = ['TargetId', 'StationId', 'OutletLegalName', 'MonthId', 'MonthName', 'MonthSaleTarget'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Data is not sending correctly",
                missingFields
            });
        }
        let targets = null;
        const createdBy = req.user ? req.user.UserName : null;
        // If TargetId equals "0", create a new record
        if (TargetId === "0") {
            // Creating a new Targets record
            const latestTarget = await Targets_1.default.findOne({}, { Targets: 1 }, { sort: { Targets: -1 } });
            const lastId = latestTarget ? parseInt(latestTarget.TargetId.slice(3)) : 0;
            const newTargetId = 'TAG' + ('0000' + (lastId + 1)).slice(-4);
            //const randomId = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
            targets = new Targets_1.default({
                //_id: randomId,
                TargetId: newTargetId,
                StationId,
                OutletLegalName,
                MonthId,
                MonthName,
                FinancialYear,
                MonthSaleTarget,
                CreatedDate: Date.now(),
                CreatedBy: createdBy
            });
            await targets.save();
            return res.status(200).send("Targets record added successfully");
        }
        // If TargetId is provided and not "0", update the existing record
        targets = await Targets_1.default.findOneAndUpdate({ TargetId }, {
            StationId,
            OutletLegalName,
            FinancialYear,
            MonthId,
            MonthName,
            MonthSaleTarget,
            UpdatedDate: Date.now(),
            UpdatedBy: createdBy
        }, { upsert: true, new: true });
        if (targets) {
            return res.status(200).send("Targets record updated successfully");
        }
        else {
            console.log("Failed to update/create Targets record");
            return res.status(500).send("Internal Server Error");
        }
    }
    catch (err) {
        // Handle errors
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.addTargets = addTargets;
function formatDate(dateString) {
    const parts = dateString.split('-');
    const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000+0000`);
    return formattedDate.toISOString();
}
const getTargets = async (req, res) => {
    try {
        const alldata = await Targets_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getTargets = getTargets;
// export const getTargetsWithActualSales = async (req: Request, res: Response) => {
//     try {
//         const { FinancialYear, StationId, MonthId } = req.body;
//         if (!FinancialYear || !StationId || !MonthId) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }
//         const targets = await Targets.findOne({ FinancialYear, StationId, MonthId });
//         if (!targets) {
//             return res.status(404).json({ message: "No target found for the given criteria" });
//         }
//         const startDate = new Date(`${FinancialYear.split('-')[0]}-${MonthId}-01`);
//         const endDate = new Date(startDate);
//         endDate.setMonth(startDate.getMonth() + 1);
//         const actualSalesData = await SaleTransHeader.aggregate([
//             {
//                 $match: {
//                     StationId,
//                     InvoiceDate: { $gte: startDate, $lt: endDate }
//                 }
//             },
//             {
//                 $group: {
//                     _id: null,
//                     totalDiscountedBillValue: { $sum: "$DiscountedBillValue" }
//                 }
//             }
//         ]);
//         const actualSales = actualSalesData.length > 0 ? actualSalesData[0].totalDiscountedBillValue : 0;
//         // Prepare response data
//         const responseData = {
//             FinancialYear,
//             StationId,
//             OutletLegalName: targets.OutletLegalName,
//             MonthId: targets.MonthId,
//             MonthName: targets.MonthName,
//             MonthSaleTarget: targets.MonthSaleTarget,
//             ActualSales: actualSales
//         };
//         return res.json(responseData);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error");
//     }
// };
const getTargetsWithActualSales = async (req, res) => {
    try {
        const { FinancialYear, StationId, MonthId } = req.body;
        if (!FinancialYear || !StationId || !MonthId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const targets = await Targets_1.default.findOne({ FinancialYear, StationId, MonthId });
        if (!targets) {
            return res.status(404).json({ message: "No target found for the given criteria" });
        }
        // Parse FinancialYear and MonthId to determine the start and end dates
        const year = parseInt(FinancialYear.split('-')[0]);
        const month = parseInt(MonthId);
        const startDate = new Date(Date.UTC(year, month - 1, 1));
        const endDate = new Date(Date.UTC(year, month, 1));
        const actualSalesData = await SaleTransHeader_1.default.aggregate([
            {
                $match: {
                    StationId,
                    InvoiceDate: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $project: {
                    _id: 0,
                    InvoiceDate: 1,
                    DiscountedBillValue: 1
                }
            }
        ]);
        const totalDiscountedBillValue = actualSalesData.reduce((sum, record) => sum + record.DiscountedBillValue, 0);
        // Prepare response data
        const responseData = {
            FinancialYear,
            StationId,
            OutletLegalName: targets.OutletLegalName,
            MonthId: targets.MonthId,
            MonthName: targets.MonthName,
            MonthSaleTarget: targets.MonthSaleTarget,
            ActualSales: totalDiscountedBillValue,
        };
        return res.json(responseData);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getTargetsWithActualSales = getTargetsWithActualSales;
exports.default = router;
