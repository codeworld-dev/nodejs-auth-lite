"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerCreditByFarmerLocalId = exports.getCustomerCredits = exports.addCustomerCredit = void 0;
const express_1 = __importDefault(require("express"));
const CustCrOB_1 = __importDefault(require("../models/CustCrOB"));
//import {Long} from 'bson';
const router = express_1.default.Router();
const addCustomerCredit = async (req, res) => {
    try {
        const { CustomerCreditsId, FarmerId, FarmerName, FarmerLocalId, Mobile, Village, OpeningCredit, FinancialYear, CustCrOBDate, CustomerType, StationId, OutletLegalName } = req.body;
        if (!FarmerId || !FarmerName || !FarmerLocalId || !Mobile || !Village || !OpeningCredit || !FinancialYear || !CustCrOBDate || !CustomerType || !OutletLegalName || !StationId) {
            return res.status(400).send("Data is not sending correctly");
        }
        let customerCredits = null;
        const createdBy = req.user ? req.user.UserName : null;
        if (CustomerCreditsId === "0") {
            // Creating a new CustomerCredit Ledger
            const latestCustomerCredit = await CustCrOB_1.default.findOne({}, { CustomerCreditsId: 1 }, { sort: { CustomerCreditsId: -1 } });
            const lastId = latestCustomerCredit ? parseInt(latestCustomerCredit.CustomerCreditsId.slice(3)) : 0;
            const newCustomerCreditsId = 'CCR' + ('0000' + (lastId + 1)).slice(-4);
            // const randomId = Long.fromNumber(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
            customerCredits = new CustCrOB_1.default({
                //_id: randomId,
                CustomerCreditsId: newCustomerCreditsId,
                FarmerId,
                FarmerName,
                FarmerLocalId,
                FinancialYear,
                Village,
                Mobile,
                StationId,
                OutletLegalName,
                OpeningCredit,
                CustCrOBDate: formatDate(CustCrOBDate), // Parse and format CustCrOBDate
                CustomerType,
                CreatedDate: Date.now(),
                CreatedBy: createdBy
            });
            await customerCredits.save();
            return res.status(200).send("CustomerCredit added successfully");
        }
        else if (CustomerCreditsId) {
            // Updating an existing customerCredits or creating a new one if not found
            customerCredits = await CustCrOB_1.default.findOneAndUpdate({ CustomerCreditsId }, {
                FinancialYear,
                OpeningCredit,
                FarmerId,
                FarmerName,
                FarmerLocalId,
                Village,
                Mobile,
                CustCrOBDate: formatDate(CustCrOBDate), // Parse and format CustCrOBDate
                CustomerType,
                StationId,
                OutletLegalName,
                UpdatedDate: Date.now(),
                UpdatedBy: createdBy
            }, { upsert: true, new: true });
            if (customerCredits) {
                return res.status(200).send("CustomerCredit updated successfully");
            }
            else {
                console.log("Failed to update/create CustCrOB");
                return res.status(401).send("Authorization Required");
            }
        }
        else {
            return res.status(400).send("CustomerCreditId is required");
        }
    }
    catch (err) {
        // Handle errors
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.addCustomerCredit = addCustomerCredit;
// Function to parse and format date
function formatDate(dateString) {
    const parts = dateString.split('-');
    const formattedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000+0000`);
    return formattedDate.toISOString();
}
const getCustomerCredits = async (req, res) => {
    try {
        const alldata = await CustCrOB_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getCustomerCredits = getCustomerCredits;
exports.default = router;
const getCustomerCreditByFarmerLocalId = async (req, res) => {
    try {
        const { FarmerLocalId } = req.params; // Assuming FarmerLocalId is passed as a URL parameter
        if (!FarmerLocalId) {
            return res.status(400).send("FarmerLocalId is required");
        }
        // Fetch the record from CustCrOB collection using FarmerLocalId
        const customerCredit = await CustCrOB_1.default.findOne({ FarmerLocalId });
        if (!customerCredit) {
            return res.status(200).send("Customer credit record not found");
        }
        return res.status(200).json(customerCredit);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getCustomerCreditByFarmerLocalId = getCustomerCreditByFarmerLocalId;
