"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayWiseOutletExpenses = exports.getOutlets = void 0;
const express_1 = __importDefault(require("express"));
const moment_1 = __importDefault(require("moment"));
const OutletExpenses_1 = __importDefault(require("../models/OutletExpenses"));
const router = express_1.default.Router();
const getOutlets = async (req, res) => {
    try {
        const alldata = await OutletExpenses_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getOutlets = getOutlets;
const DayWiseOutletExpenses = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds } = req.body;
        const startDate = (0, moment_1.default)(FromDate, "DD-MM-YYYY").startOf('day').toISOString();
        const endDate = (0, moment_1.default)(ToDate, "DD-MM-YYYY").endOf('day').toISOString();
        const alldata = await OutletExpenses_1.default.find({
            CollectedDate: { $gte: startDate, $lte: endDate },
            StationId: { $in: StationIds }
        }).select({
            StationId: 1,
            StationName: 1,
            ExpenseType: 1,
            ExpenseAmount: 1,
            ExpenseDate: 1,
            Remarks: 1,
            _id: 0
        });
        return res.json(alldata);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.DayWiseOutletExpenses = DayWiseOutletExpenses;
exports.default = router;
