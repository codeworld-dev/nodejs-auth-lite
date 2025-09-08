"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayWiseCustomerCreditCollected = exports.getCustomerCreditsCollected = exports.addCreditCollected = void 0;
const express_1 = __importDefault(require("express"));
const CustomerCreditsCollected_1 = __importDefault(require("../models/CustomerCreditsCollected"));
const moment_1 = __importDefault(require("moment"));
//import {Long} from 'bson';
const router = express_1.default.Router();
const addCreditCollected = async (req, res) => {
    try {
        const { CustomerCreditsCollectedId, FarmerId, FarmerName, FarmerLocalId, Mobile, Village, AmountCollected, ModeOfPayment, FinancialYear, CustomerType, CollectedDate, StationId, OutletLegalName } = req.body;
        // Check for missing fields
        const requiredFields = ['FarmerId', 'FarmerName', 'FarmerLocalId', 'Mobile', 'Village', 'AmountCollected', 'ModeOfPayment', 'FinancialYear', 'CustomerType', 'CollectedDate', 'StationId', 'OutletLegalName'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Data is not sending correctly",
                missingFields
            });
        }
        let customerCreditsCollected = null;
        const createdBy = req.user ? req.user.UserName : null;
        // If CustomerCreditsCollectedId equals "0", create a new record
        if (CustomerCreditsCollectedId === "0") {
            // Creating a new CustomerCreditCollected record
            const latestCustomerCreditCollected = await CustomerCreditsCollected_1.default.findOne({}, { CustomerCreditsCollectedId: 1 }, { sort: { CustomerCreditsCollectedId: -1 } });
            const lastId = latestCustomerCreditCollected ? parseInt(latestCustomerCreditCollected.CustomerCreditsCollectedId.slice(3)) : 0;
            const newCustomerCreditsCollectedId = 'CCC' + ('0000' + (lastId + 1)).slice(-4);
            //const randomId = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
            customerCreditsCollected = new CustomerCreditsCollected_1.default({
                // _id: randomId,
                CustomerCreditsCollectedId: newCustomerCreditsCollectedId,
                FarmerId,
                FarmerLocalId,
                FarmerName,
                FinancialYear,
                Village,
                Mobile,
                ModeOfPayment,
                AmountCollected,
                StationId,
                OutletLegalName,
                CustomerType,
                CollectedDate: formatDate(CollectedDate),
                CreatedDate: Date.now(),
                CreatedBy: createdBy
            });
            await customerCreditsCollected.save();
            return res.status(200).send("CustomerCreditCollected record added successfully");
        }
        // If CustomerCreditsCollectedId is provided and not "0", update the existing record
        customerCreditsCollected = await CustomerCreditsCollected_1.default.findOneAndUpdate({ CustomerCreditsCollectedId }, {
            AmountCollected,
            FinancialYear,
            ModeOfPayment,
            FarmerId,
            FarmerLocalId,
            FarmerName,
            Village,
            Mobile,
            CustomerType,
            StationId,
            OutletLegalName,
            CollectedDate: formatDate(CollectedDate),
            UpdatedDate: Date.now(),
            UpdatedBy: createdBy
        }, { upsert: true, new: true });
        if (customerCreditsCollected) {
            return res.status(200).send("CustomerCreditCollected record updated successfully");
        }
        else {
            console.log("Failed to update/create CustomerCreditCollected record");
            return res.status(500).send("Internal Server Error");
        }
    }
    catch (err) {
        // Handle errors
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.addCreditCollected = addCreditCollected;
function formatDate(dateString) {
    const parts = dateString.split('-');
    const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000+0000`);
    return formattedDate.toISOString();
}
const getCustomerCreditsCollected = async (req, res) => {
    try {
        const alldata = await CustomerCreditsCollected_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getCustomerCreditsCollected = getCustomerCreditsCollected;
const DayWiseCustomerCreditCollected = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds } = req.body;
        const startDate = (0, moment_1.default)(FromDate, "DD-MM-YYYY").startOf('day').toDate();
        const endDate = (0, moment_1.default)(ToDate, "DD-MM-YYYY").endOf('day').toDate();
        const alldata = await CustomerCreditsCollected_1.default.find({
            CollectedDate: { $gte: startDate, $lte: endDate },
            StationId: { $in: StationIds }
        }).select({
            StationId: 1,
            OutletLegalName: 1,
            AmountCollected: 1,
            CollectedDate: 1,
            FarmerName: 1,
            FarmerLocalId: 1,
            _id: 0
        });
        return res.json(alldata);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.DayWiseCustomerCreditCollected = DayWiseCustomerCreditCollected;
exports.default = router;
