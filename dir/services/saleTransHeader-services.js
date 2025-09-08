"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GettingCreditsHistory = exports.getPaymentDueDatesWithDates = exports.CalculateAgeFarmerByLocalId = exports.calculateAgeFarmerCredits = exports.calculateAgeFarmerCredits1 = exports.getPeakHour = exports.getAveragePeakHour = exports.getSalesByHour = exports.getSalesByHourFinalDraftwithout5 = exports.CurrentSale = exports.TotalDiscountedBillValueByDay = exports.ListOfOutletsDiscountedBillValueByDay = exports.totalCreditOutside = exports.totalCreditOutside27Jan = exports.CustomerDayWiseTransactions = exports.ListOfOutletsClosingBalanceByFinancialYear = exports.allCustomersClosingBalance23Sec = exports.allCustomersClosingBalancetesting = exports.allCustomersClosingBalance = exports.allCustomersClosingBalance13FebLatest = exports.allCustomersClosingBalance43sec = exports.allCustomersClosingBalance17Jan = exports.customerClosingBalance = exports.SaleTransHeaderWithDates = exports.getSaleTransHeader = void 0;
const express_1 = __importDefault(require("express"));
const CustCrOB_1 = __importDefault(require("../models/CustCrOB"));
const CustomerCreditsCollected_1 = __importDefault(require("../models/CustomerCreditsCollected"));
const SaleTransHeader_1 = __importDefault(require("../models/SaleTransHeader"));
const moment_1 = __importDefault(require("moment"));
const Stations_1 = __importDefault(require("../models/Stations"));
const router = express_1.default.Router();
const getSaleTransHeader = async (req, res) => {
    try {
        const alldata = await SaleTransHeader_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getSaleTransHeader = getSaleTransHeader;
const SaleTransHeaderWithDates = async (req, res) => {
    const { FromDate, ToDate, StationIds } = req.body;
    try {
        // Input validation
        if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0) {
            res.status(400).send("FromDate, ToDate, and StationIds are required and must be non-empty arrays.");
            return;
        }
        // Parse and validate dates using Moment.js
        const fromDate = (0, moment_1.default)(FromDate, "DD-MM-YYYY", true).startOf('day');
        const toDate = (0, moment_1.default)(ToDate, "DD-MM-YYYY", true).endOf('day');
        if (!fromDate.isValid() || !toDate.isValid()) {
            res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
            return;
        }
        // Query for sale transactions
        const alldata = await SaleTransHeader_1.default.find({
            InvoiceDate: {
                $gte: fromDate.toDate(),
                $lte: toDate.toDate(),
            },
            StationId: { $in: StationIds }
        });
        res.json(alldata);
    }
    catch (error) {
        console.error("Error in SaleTransactionsWithDates:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.SaleTransHeaderWithDates = SaleTransHeaderWithDates;
const customerClosingBalance = async (req, res) => {
    try {
        const { FarmerLocalId } = req.params;
        if (!FarmerLocalId) {
            return res.status(400).send("FarmerLocalId is required");
        }
        const specificStartDate = new Date('2024-07-06'); // Hardcoded start date
        // Retrieve Opening Balance for the specific customer
        const openingBalanceDoc = await CustCrOB_1.default.findOne({ FarmerLocalId });
        const openingBalance = openingBalanceDoc ? openingBalanceDoc.OpeningCredit : 0;
        console.log(`Opening Balance: ${openingBalance}`);
        // Retrieve Credits in sales for the specific customer within the financial year starting from the specific start date
        const salesCredits = await SaleTransHeader_1.default.find({
            FarmerLocalId,
            CreatedDate: { $gte: specificStartDate },
            Credit: { $gt: 0 }
        });
        const totalCredit = salesCredits.reduce((acc, doc) => acc + doc.Credit, 0);
        console.log(`Total Credit: ${totalCredit}`);
        // Retrieve Amounts collected for the specific customer without date restriction
        const paymentsCollected = await CustomerCreditsCollected_1.default.find({ FarmerLocalId });
        const totalPayments = paymentsCollected.reduce((acc, doc) => acc + doc.AmountCollected, 0);
        console.log(`Total Payments: ${totalPayments}`);
        // Retrieve Customer Details from sales records
        const customerDetailsDoc = await SaleTransHeader_1.default.findOne({ FarmerLocalId });
        const customerDetails = customerDetailsDoc ? {
            FarmerName: customerDetailsDoc.CustomerName,
            MobileNo: customerDetailsDoc.MobileNo,
            VillageName: customerDetailsDoc.VillageName
        } : {};
        console.log(`Customer Details: ${JSON.stringify(customerDetails)}`);
        // Calculate Closing Balance for the customer
        const closingBalance = openingBalance + totalCredit - totalPayments;
        // Prepare the result
        const result = {
            FarmerLocalId,
            ...customerDetails,
            OpeningBalance: openingBalance,
            TotalCredit: totalCredit,
            AmountCollected: totalPayments,
            ClosingBalance: closingBalance,
            CreditRecords: salesCredits,
            AmountCollectedRecords: paymentsCollected
        };
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.customerClosingBalance = customerClosingBalance;
//With HardCodedDate
// export const allCustomersClosingBalance = async (req: Request, res: Response) => {
//     try {
//         const { FinancialYear, StationIds } = req.body; // Assuming you are passing these in the request body
//         const specificStartDate = new Date('2024-07-06'); // Hardcoded start date
//         if (!FinancialYear || !StationIds) {
//             return res.status(400).send("Financial year and Station IDs are required");
//         }
//         // Retrieve Opening Balances for all customers
//         const openingBalances = await CustCrOB.find({ StationId: { $in: StationIds }, FinancialYear });
//         const openingBalanceMap = openingBalances.reduce((acc, doc) => {
//             acc[doc.FarmerLocalId] = doc.OpeningCredit;
//             return acc;
//         }, {} as Record<string, number>);
//         console.log(`Opening Balances: ${JSON.stringify(openingBalanceMap)}`);
//         // Retrieve Credits in sales for all customers within the financial year and station IDs starting from the specific start date
//         const salesCredits = await SaleTransHeader.find({
//             StationId: { $in: StationIds },
//             FinancialYear,
//             CreatedDate: { $gte: specificStartDate }
//         });
//         const creditMap = salesCredits.reduce((acc, doc) => {
//             if (!acc[doc.FarmerLocalId]) acc[doc.FarmerLocalId] = 0;
//             acc[doc.FarmerLocalId] += doc.Credit;
//             return acc;
//         }, {} as Record<string, number>);
//         console.log(`Sales Credits: ${JSON.stringify(creditMap)}`);
//         // Retrieve Amounts collected for all customers within the financial year and station IDs starting from the specific start date
//         const paymentsCollected = await CustomerCreditsCollected.find({
//             StationId: { $in: StationIds },
//             FinancialYear,
//             Date: { $gte: specificStartDate }
//         });
//         const paymentMap = paymentsCollected.reduce((acc, doc) => {
//             if (!acc[doc.FarmerLocalId]) acc[doc.FarmerLocalId] = 0;
//             acc[doc.FarmerLocalId] += doc.AmountCollected;
//             return acc;
//         }, {} as Record<string, number>);
//         console.log(`Payments Collected: ${JSON.stringify(paymentMap)}`);
//         // Retrieve Customer Details from SaleTransHeader
//         const customerDetailsMap = salesCredits.reduce((acc, doc) => {
//             if (!acc[doc.FarmerLocalId]) {
//                 acc[doc.FarmerLocalId] = {
//                     FarmerName: doc.CustomerName,
//                     MobileNo: doc.MobileNo,
//                     VillageName: doc.VillageName
//                 };
//             }
//             return acc;
//         }, {} as Record<string, { FarmerName: string, MobileNo: string, VillageName: string }>);
//         console.log(`Customer Details: ${JSON.stringify(customerDetailsMap)}`);
//         // Retrieve Customer Names
//         const customerIds = Array.from(new Set([
//             ...Object.keys(openingBalanceMap),
//             ...Object.keys(creditMap),
//             ...Object.keys(paymentMap)
//         ]));
//         // Calculate Closing Balances for each customer
//         const result = customerIds.map(FarmerLocalId => {
//             const openingBalance = openingBalanceMap[FarmerLocalId] || 0;
//             const totalCredit = creditMap[FarmerLocalId] || 0;
//             const totalPayments = paymentMap[FarmerLocalId] || 0;
//             const closingBalance = openingBalance + totalCredit - totalPayments;
//             // Credit Details
//             const creditDetails = totalCredit > 0 ? { CreditRecords: salesCredits.filter(doc => doc.FarmerLocalId === FarmerLocalId) } : null;
//             // Amount Collected Details
//             const amountCollectedDetails = totalPayments > 0 ? { AmountCollectedRecords: paymentsCollected.filter(doc => doc.FarmerLocalId === FarmerLocalId) } : null;
//             const customerDetails = customerDetailsMap[FarmerLocalId] || {};
//             return {
//                 FarmerLocalId: FarmerLocalId,
//                 FarmerName: customerDetails.FarmerName,
//                 MobileNo: customerDetails.MobileNo,
//                 VillageName: customerDetails.VillageName,
//                 OpeningBalance: openingBalance,
//                 TotalCredit: totalCredit,
//                 AmountCollected: totalPayments,
//                 ClosingBalance: closingBalance,
//                 ...creditDetails,
//                 ...amountCollectedDetails
//             };
//         });
//         res.status(200).json(result);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error");
//     }
// };
////FarmerReg
// export const allCustomersClosingBalance = async (req: Request, res: Response) => {
//     try {
//         const { FinancialYear, StationIds } = req.body; // Assuming you are passing these in the request body
//         const specificStartDate = new Date('2024-07-06'); // Hardcoded start date
//         if (!FinancialYear || !StationIds) {
//             return res.status(400).send("Financial year and Station IDs are required");
//         }
//         // Retrieve Opening Balances for all customers
//         const openingBalances = await CustCrOB.find({ StationId: { $in: StationIds }, FinancialYear });
//         const openingBalanceMap = openingBalances.reduce((acc, doc) => {
//             acc[doc.FarmerLocalId] = doc.OpeningCredit;
//             return acc;
//         }, {} as Record<string, number>);
//         console.log(`Opening Balances: ${JSON.stringify(openingBalanceMap)}`);
//         // Retrieve Credits in sales for all customers within the financial year and station IDs starting from the specific start date
//         const salesCredits = await SaleTransHeader.find({
//             StationId: { $in: StationIds },
//             FinancialYear,
//             Date: { $gte: specificStartDate }
//         });
//         const creditMap = salesCredits.reduce((acc, doc) => {
//             if (!acc[doc.FarmerLocalId]) acc[doc.FarmerLocalId] = 0;
//             acc[doc.FarmerLocalId] += doc.Credit;
//             return acc;
//         }, {} as Record<string, number>);
//         console.log(`Sales Credits: ${JSON.stringify(creditMap)}`);
//         // Retrieve Amounts collected for all customers within the financial year and station IDs starting from the specific start date
//         const paymentsCollected = await CustomerCreditsCollected.find({
//             StationId: { $in: StationIds },
//             FinancialYear,
//             Date: { $gte: specificStartDate }
//         });
//         const paymentMap = paymentsCollected.reduce((acc, doc) => {
//             if (!acc[doc.FarmerLocalId]) acc[doc.FarmerLocalId] = 0;
//             acc[doc.FarmerLocalId] += doc.AmountCollected;
//             return acc;
//         }, {} as Record<string, number>);
//         console.log(`Payments Collected: ${JSON.stringify(paymentMap)}`);
//         // Retrieve Customer Details from FarmerRegistration collection
//         const customerIds = Array.from(new Set([
//             ...Object.keys(openingBalanceMap),
//             ...Object.keys(creditMap),
//             ...Object.keys(paymentMap)
//         ]));
//         const farmerDetails = await FarmerRegistration.find({ FarmerLocalId: { $in: customerIds } });
//         const customerDetailsMap = farmerDetails.reduce((acc, doc) => {
//             acc[doc.FarmerLocalId] = {
//                 FarmerName: doc.FarmerName,
//                 MobileNo: doc.Mobile,
//                 VillageName: doc.VillageValue
//             };
//             return acc;
//         }, {} as Record<string, { FarmerName: string, MobileNo: string, VillageName: string }>);
//         console.log(`Customer Details: ${JSON.stringify(customerDetailsMap)}`);
//         // Calculate Closing Balances for each customer
//         const result = customerIds.map(FarmerLocalId => {
//             const openingBalance = openingBalanceMap[FarmerLocalId] || 0;
//             const totalCredit = creditMap[FarmerLocalId] || 0;
//             const totalPayments = paymentMap[FarmerLocalId] || 0;
//             const closingBalance = openingBalance + totalCredit - totalPayments;
//             // Credit Details
//             const creditDetails = totalCredit > 0 ? { CreditRecords: salesCredits.filter(doc => doc.FarmerLocalId === FarmerLocalId) } : null;
//             // Amount Collected Details
//             const amountCollectedDetails = totalPayments > 0 ? { AmountCollectedRecords: paymentsCollected.filter(doc => doc.FarmerLocalId === FarmerLocalId) } : null;
//             const customerDetails = customerDetailsMap[FarmerLocalId] || {};
//             return {
//                 FarmerLocalId: FarmerLocalId,
//                 FarmerName: customerDetails.FarmerName,
//                 MobileNo: customerDetails.MobileNo,
//                 VillageName: customerDetails.VillageName,
//                 OpeningBalance: openingBalance,
//                 TotalCredit: totalCredit,
//                 AmountCollected: totalPayments,
//                 ClosingBalance: closingBalance,
//                 ...creditDetails,
//                 ...amountCollectedDetails
//             };
//         });
//         res.status(200).json(result);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error");
//     }
// };
///// CominedFarmerLocalIds 
// export const allCustomersClosingBalance = async (req: Request, res: Response) => {
//     try {
//         const { FinancialYear, StationIds } = req.body; // Assuming you are passing these in the request body
//         const specificStartDate = new Date('2024-07-06'); // Hardcoded start date
//         if (!FinancialYear || !StationIds) {
//             return res.status(400).send("Financial year and Station IDs are required");
//         }
//         // Retrieve Opening Balances for all customers without date restriction
//         const openingBalances = await CustCrOB.find({ StationId: { $in: StationIds }, FinancialYear });
//         const openingBalanceMap = openingBalances.reduce((acc, doc) => {
//             acc[doc.FarmerLocalId] = doc.OpeningCredit;
//             return acc;
//         }, {} as Record<string, number>);
//         console.log(`Opening Balances: ${JSON.stringify(openingBalanceMap)}`);
//         // Retrieve Credits in sales for all customers within the financial year and station IDs starting from the specific start date
//         const salesCredits = await SaleTransHeader.find({
//             StationId: { $in: StationIds },
//             FinancialYear,
//             CreatedDate: { $gte: specificStartDate }
//         });
//         const creditMap = salesCredits.reduce((acc, doc) => {
//             if (!acc[doc.FarmerLocalId]) acc[doc.FarmerLocalId] = 0;
//             acc[doc.FarmerLocalId] += doc.Credit;
//             return acc;
//         }, {} as Record<string, number>);
//         console.log(`Sales Credits: ${JSON.stringify(creditMap)}`);
//         // Retrieve Amounts collected for all customers within the financial year and station IDs without date restriction
//         const paymentsCollected = await CustomerCreditsCollected.find({
//             StationId: { $in: StationIds },
//             FinancialYear
//         });
//         const paymentMap = paymentsCollected.reduce((acc, doc) => {
//             if (!acc[doc.FarmerLocalId]) acc[doc.FarmerLocalId] = 0;
//             acc[doc.FarmerLocalId] += doc.AmountCollected;
//             return acc;
//         }, {} as Record<string, number>);
//         console.log(`Payments Collected: ${JSON.stringify(paymentMap)}`);
//         // Combine all documents to extract unique FarmerLocalIds
//         const allDocs = [...openingBalances, ...salesCredits, ...paymentsCollected];
//         const uniqueFarmerLocalIds = Array.from(new Set(allDocs.map(doc => doc.FarmerLocalId)));
//         // Retrieve Customer Details from FarmerRegistration collection
//         const farmerDetails = await FarmerRegistration.find({ FarmerLocalId: { $in: uniqueFarmerLocalIds } });
//         const customerDetailsMap = farmerDetails.reduce((acc, doc) => {
//             acc[doc.FarmerLocalId] = {
//                 FarmerName: doc.FarmerName,
//                 MobileNo: doc.Mobile,
//                 VillageName: doc.VillageValue
//             };
//             return acc;
//         }, {} as Record<string, { FarmerName: string, MobileNo: string, VillageName: string }>);
//         console.log(`Customer Details: ${JSON.stringify(customerDetailsMap)}`);
//         // Calculate Closing Balances for each customer
//         const result = uniqueFarmerLocalIds.map(FarmerLocalId => {
//             const openingBalance = openingBalanceMap[FarmerLocalId] || 0;
//             const totalCredit = creditMap[FarmerLocalId] || 0;
//             const totalPayments = paymentMap[FarmerLocalId] || 0;
//             const closingBalance = openingBalance + totalCredit - totalPayments;
//             // Credit Details
//             const creditDetails = totalCredit > 0 ? { CreditRecords: salesCredits.filter(doc => doc.FarmerLocalId === FarmerLocalId) } : null;
//             // Amount Collected Details
//             const amountCollectedDetails = totalPayments > 0 ? { AmountCollectedRecords: paymentsCollected.filter(doc => doc.FarmerLocalId === FarmerLocalId) } : null;
//             const customerDetails = customerDetailsMap[FarmerLocalId] || {};
//             return {
//                 FarmerLocalId: FarmerLocalId,
//                 FarmerName: customerDetails.FarmerName,
//                 MobileNo: customerDetails.MobileNo,
//                 VillageName: customerDetails.VillageName,
//                 OpeningBalance: openingBalance,
//                 TotalCredit: totalCredit,
//                 AmountCollected: totalPayments,
//                 ClosingBalance: closingBalance,
//                 ...creditDetails,
//                 ...amountCollectedDetails
//             };
//         });
//         res.status(200).json(result);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error");
//     }
// };
////withoutFilyterForCutomerDetails
const allCustomersClosingBalance17Jan = async (req, res) => {
    try {
        const { FinancialYear, StationIds } = req.body; // Assuming you are passing these in the request body
        const specificStartDate = new Date('2024-07-06'); // Hardcoded start date
        if (!FinancialYear || !StationIds) {
            return res.status(400).send("Financial year and Station IDs are required");
        }
        // Retrieve Opening Balances for all customers without date restriction
        const openingBalances = await CustCrOB_1.default.find({ StationId: { $in: StationIds }, FinancialYear });
        const openingBalanceMap = openingBalances.reduce((acc, doc) => {
            acc[doc.FarmerLocalId] = doc.OpeningCredit;
            return acc;
        }, {});
        // console.log(`Opening Balances: ${JSON.stringify(openingBalanceMap)}`);
        // Retrieve all sales records for the given financial year and station IDs to get customer details
        const allSalesRecords = await SaleTransHeader_1.default.find({
            StationId: { $in: StationIds },
            FinancialYear
        });
        // Retrieve Credits in sales for all customers within the financial year and station IDs starting from the specific start date
        const salesCredits = await SaleTransHeader_1.default.find({
            StationId: { $in: StationIds },
            FinancialYear,
            CreatedDate: { $gte: specificStartDate },
            Credit: { $ne: null }
        });
        const creditMap = salesCredits.reduce((acc, doc) => {
            if (!acc[doc.FarmerLocalId])
                acc[doc.FarmerLocalId] = 0;
            // Check the TransactionType: add or subtract based on type
            if (doc.TransactionType === 0) {
                acc[doc.FarmerLocalId] += doc.Credit; // Add credit if TransactionType is 0
            }
            else if (doc.TransactionType === 1) {
                acc[doc.FarmerLocalId] -= doc.Credit; // Subtract credit if TransactionType is 1
            }
            return acc;
        }, {});
        //console.log(`Sales Credits: ${JSON.stringify(creditMap)}`);
        // Retrieve Amounts collected for all customers within the financial year and station IDs without date restriction
        const paymentsCollected = await CustomerCreditsCollected_1.default.find({
            StationId: { $in: StationIds },
            FinancialYear
        });
        const paymentMap = paymentsCollected.reduce((acc, doc) => {
            if (!acc[doc.FarmerLocalId])
                acc[doc.FarmerLocalId] = 0;
            acc[doc.FarmerLocalId] += doc.AmountCollected;
            return acc;
        }, {});
        console.log(`Payments Collected: ${JSON.stringify(paymentMap)}`);
        // Combine all documents to extract unique FarmerLocalIds
        const allDocs = [...openingBalances, ...salesCredits, ...paymentsCollected];
        const uniqueFarmerLocalIds = Array.from(new Set(allDocs.map(doc => doc.FarmerLocalId)));
        // Retrieve Customer Details from all sales records
        const customerDetailsMap = allSalesRecords.reduce((acc, doc) => {
            if (!acc[doc.FarmerLocalId]) {
                acc[doc.FarmerLocalId] = {
                    FarmerName: doc.CustomerName,
                    MobileNo: doc.MobileNo,
                    VillageName: doc.VillageName,
                    StationId: doc.StationId,
                    OutletLegalName: doc.OutletLegalName
                };
            }
            return acc;
        }, {});
        //console.log(`Customer Details: ${JSON.stringify(customerDetailsMap)}`);
        const openingDetailsMap = openingBalances.reduce((acc, doc) => {
            if (!acc[doc.FarmerLocalId]) {
                acc[doc.FarmerLocalId] = {
                    FarmerName: doc.FarmerName,
                    MobileNo: doc.Mobile,
                    VillageName: doc.Village,
                    StationId: doc.StationId,
                    OutletLegalName: doc.OutletLegalName
                };
            }
            return acc;
        }, {});
        //console.log(`Customer Details: ${JSON.stringify(customerDetailsMap)}`);
        // Calculate Closing Balances for each customer
        const result = uniqueFarmerLocalIds.map(FarmerLocalId => {
            const openingBalance = openingBalanceMap[FarmerLocalId] || 0;
            const totalCredit = creditMap[FarmerLocalId] || 0;
            const totalPayments = paymentMap[FarmerLocalId] || 0;
            const closingBalance = openingBalance + totalCredit - totalPayments;
            // Credit Details
            const creditDetails = totalCredit > 0 ? { CreditRecords: salesCredits.filter(doc => doc.FarmerLocalId === FarmerLocalId) } : null;
            // Amount Collected Details
            const amountCollectedDetails = totalPayments > 0 ? { AmountCollectedRecords: paymentsCollected.filter(doc => doc.FarmerLocalId === FarmerLocalId) } : null;
            // const customerDetails = customerDetailsMap[FarmerLocalId] || {};
            let customerDetails = customerDetailsMap[FarmerLocalId];
            if (!customerDetails) {
                customerDetails = openingDetailsMap[FarmerLocalId] || {};
            }
            const typeOfSale = allSalesRecords
                .filter(doc => doc.FarmerLocalId === FarmerLocalId)
                .map(doc => doc.TypeOfSale)
                .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
                .join(", ") || "Unknown";
            return {
                FarmerLocalId: FarmerLocalId,
                StationId: customerDetails.StationId,
                OutletLegalName: customerDetails.OutletLegalName,
                FarmerName: customerDetails.FarmerName,
                MobileNo: customerDetails.MobileNo,
                VillageName: customerDetails.VillageName,
                TypeOfSale: typeOfSale,
                OpeningBalance: openingBalance,
                TotalCredit: totalCredit,
                AmountCollected: totalPayments,
                ClosingBalance: closingBalance,
                ...creditDetails,
                ...amountCollectedDetails
            };
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.allCustomersClosingBalance17Jan = allCustomersClosingBalance17Jan;
const allCustomersClosingBalance43sec = async (req, res) => {
    try {
        const { FinancialYear, StationIds } = req.body; // Assuming you are passing these in the request body
        const specificStartDate = new Date('2024-07-06'); // Hardcoded start date
        if (!FinancialYear || !StationIds) {
            return res.status(400).send("Financial year and Station IDs are required");
        }
        // Retrieve Opening Balances for all customers without date restriction
        const openingBalances = await CustCrOB_1.default.find({ StationId: { $in: StationIds }, FinancialYear }).lean();
        const openingBalanceMap = openingBalances.reduce((acc, doc) => {
            acc[doc.FarmerLocalId] = doc.OpeningCredit || 0;
            return acc;
        }, {});
        // Retrieve all sales records for the given financial year and station IDs
        const allSalesRecords = await SaleTransHeader_1.default.find({
            StationId: { $in: StationIds },
            FinancialYear,
        }).lean();
        // Retrieve Credits in sales for all customers within the specific start date
        const salesCredits = await SaleTransHeader_1.default.find({
            StationId: { $in: StationIds },
            FinancialYear,
            CreatedDate: { $gte: specificStartDate },
            Credit: { $ne: null },
        }).lean();
        const creditMap = salesCredits.reduce((acc, doc) => {
            if (!acc[doc.FarmerLocalId])
                acc[doc.FarmerLocalId] = 0;
            acc[doc.FarmerLocalId] += doc.TransactionType === 0 ? doc.Credit : -doc.Credit;
            return acc;
        }, {});
        // Retrieve Amounts collected for all customers
        const paymentsCollected = await CustomerCreditsCollected_1.default.find({
            StationId: { $in: StationIds },
            FinancialYear,
        }).lean();
        const paymentMap = paymentsCollected.reduce((acc, doc) => {
            acc[doc.FarmerLocalId] = (acc[doc.FarmerLocalId] || 0) + doc.AmountCollected;
            return acc;
        }, {});
        // Extract unique FarmerLocalIds from all records
        const uniqueFarmerLocalIds = Array.from(new Set([
            ...openingBalances.map(doc => doc.FarmerLocalId),
            ...salesCredits.map(doc => doc.FarmerLocalId),
            ...paymentsCollected.map(doc => doc.FarmerLocalId),
        ]));
        // Prepare a map of customer details from both sales and opening balances
        const customerDetailsMap = allSalesRecords.reduce((acc, doc) => {
            acc[doc.FarmerLocalId] = acc[doc.FarmerLocalId] || {
                FarmerName: doc.CustomerName,
                MobileNo: doc.MobileNo,
                VillageName: doc.VillageName,
                StationId: doc.StationId,
                OutletLegalName: doc.OutletLegalName,
            };
            return acc;
        }, {});
        openingBalances.forEach(doc => {
            if (!customerDetailsMap[doc.FarmerLocalId]) {
                customerDetailsMap[doc.FarmerLocalId] = {
                    FarmerName: doc.FarmerName,
                    MobileNo: doc.Mobile,
                    VillageName: doc.Village,
                    StationId: doc.StationId,
                    OutletLegalName: doc.OutletLegalName,
                };
            }
        });
        // Generate results
        const result = uniqueFarmerLocalIds.map(FarmerLocalId => {
            const openingBalance = openingBalanceMap[FarmerLocalId] || 0;
            const totalCredit = creditMap[FarmerLocalId] || 0;
            const totalPayments = paymentMap[FarmerLocalId] || 0;
            const closingBalance = openingBalance + totalCredit - totalPayments;
            const customerDetails = customerDetailsMap[FarmerLocalId] || {};
            const typeOfSale = allSalesRecords
                .filter(doc => doc.FarmerLocalId === FarmerLocalId)
                .map(doc => doc.TypeOfSale)
                .filter((value, index, self) => self.indexOf(value) === index)
                .join(", ") || "Unknown";
            return {
                FarmerLocalId,
                StationId: customerDetails.StationId,
                OutletLegalName: customerDetails.OutletLegalName,
                FarmerName: customerDetails.FarmerName,
                MobileNo: customerDetails.MobileNo,
                VillageName: customerDetails.VillageName,
                TypeOfSale: typeOfSale,
                OpeningBalance: openingBalance,
                TotalCredit: totalCredit,
                AmountCollected: totalPayments,
                ClosingBalance: closingBalance,
                CreditRecords: salesCredits.filter(doc => doc.FarmerLocalId === FarmerLocalId),
                AmountCollectedRecords: paymentsCollected.filter(doc => doc.FarmerLocalId === FarmerLocalId),
            };
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.allCustomersClosingBalance43sec = allCustomersClosingBalance43sec;
const allCustomersClosingBalance13FebLatest = async (req, res) => {
    try {
        const { FinancialYear, StationIds } = req.body; // Assuming you are passing these in the request body
        const specificStartDate = new Date('2024-07-06'); // Hardcoded start date
        if (!FinancialYear || !StationIds) {
            return res.status(400).send("Financial year and Station IDs are required");
        }
        // Aggregate Opening Balances, Sales Records, Credits, and Payments in parallel
        const [openingBalances, allSalesRecords, salesCredits, paymentsCollected] = await Promise.all([
            CustCrOB_1.default.aggregate([
                { $match: { StationId: { $in: StationIds }, FinancialYear } },
                { $project: { FarmerLocalId: 1, OpeningCredit: 1 } },
            ]),
            SaleTransHeader_1.default.aggregate([
                { $match: { StationId: { $in: StationIds }, FinancialYear, Credit: { $gt: 0 } } },
                { $project: { FarmerLocalId: 1, CustomerName: 1, MobileNo: 1, VillageName: 1, StationId: 1, OutletLegalName: 1, TypeOfSale: 1 } },
            ]),
            SaleTransHeader_1.default.aggregate([
                { $match: { StationId: { $in: StationIds }, FinancialYear, CreatedDate: { $gte: specificStartDate }, Credit: { $gt: 0 } } },
                { $group: { _id: "$FarmerLocalId", totalCredit: { $sum: { $cond: [{ $eq: ["$TransactionType", 0] }, "$Credit", { $multiply: ["$Credit", -1] }] } } } },
                { $project: { FarmerLocalId: "$_id", totalCredit: 1, _id: 0 } },
            ]),
            CustomerCreditsCollected_1.default.aggregate([
                { $match: { StationId: { $in: StationIds }, FinancialYear } },
                { $group: { _id: "$FarmerLocalId", totalPayments: { $sum: "$AmountCollected" } } },
                { $project: { FarmerLocalId: "$_id", totalPayments: 1, _id: 0 } },
            ])
        ]);
        // Map opening balances, credits, and payments
        const openingBalanceMap = openingBalances.reduce((acc, doc) => {
            acc[doc.FarmerLocalId] = doc.OpeningCredit || 0;
            return acc;
        }, {});
        const creditMap = salesCredits.reduce((acc, doc) => {
            acc[doc.FarmerLocalId] = doc.totalCredit || 0;
            return acc;
        }, {});
        const paymentMap = paymentsCollected.reduce((acc, doc) => {
            acc[doc.FarmerLocalId] = doc.totalPayments || 0;
            return acc;
        }, {});
        // Prepare customer details map
        const customerDetailsMap = allSalesRecords.reduce((acc, doc) => {
            acc[doc.FarmerLocalId] = acc[doc.FarmerLocalId] || {
                FarmerName: doc.CustomerName,
                MobileNo: doc.MobileNo,
                VillageName: doc.VillageName,
                StationId: doc.StationId,
                OutletLegalName: doc.OutletLegalName,
                //PaymentDueDate:doc.PaymentDueDate
            };
            return acc;
        }, {});
        const OBDetailsMap = openingBalances.reduce((acc, doc) => {
            acc[doc.FarmerLocalId] = acc[doc.FarmerLocalId] || {
                FarmerName: doc.FarmerName,
                MobileNo: doc.MobileNo,
                VillageName: doc.Village,
                StationId: doc.StationId,
                OutletLegalName: doc.OutletLegalName,
                //PaymentDueDate:doc.PaymentDueDate
            };
            return acc;
        }, {});
        const uniqueFarmerLocalIds = Array.from(new Set([
            ...openingBalances.map(doc => doc.FarmerLocalId),
            ...allSalesRecords.map(doc => doc.FarmerLocalId),
        ]));
        // const result = uniqueFarmerLocalIds 
        //     .map(doc => doc.FarmerLocalId)
        //     .filter((value, index, self) => self.indexOf(value) === index) // Ensure unique FarmerLocalIds
        //     .map(FarmerLocalId => {
        //         const openingBalance = openingBalanceMap[FarmerLocalId] || 0;
        //         const totalCredit = creditMap[FarmerLocalId] || 0;
        //         const totalPayments = paymentMap[FarmerLocalId] || 0;
        //         const closingBalance = openingBalance + totalCredit - totalPayments;
        const result = Array.from(uniqueFarmerLocalIds).map(FarmerLocalId => {
            const openingBalance = openingBalanceMap[FarmerLocalId] || 0;
            const totalCredit = creditMap[FarmerLocalId] || 0;
            const totalPayments = paymentMap[FarmerLocalId] || 0;
            const closingBalance = openingBalance + totalCredit - totalPayments;
            const customerDetails = customerDetailsMap[FarmerLocalId] || OBDetailsMap[FarmerLocalId];
            const typeOfSale = allSalesRecords
                .filter(doc => doc.FarmerLocalId === FarmerLocalId)
                .map(doc => doc.TypeOfSale)
                .filter((value, index, self) => self.indexOf(value) === index)
                .join(", ") || "Unknown";
            return {
                FarmerLocalId,
                StationId: customerDetails.StationId,
                OutletLegalName: customerDetails.OutletLegalName,
                FarmerName: customerDetails.FarmerName,
                MobileNo: customerDetails.MobileNo,
                VillageName: customerDetails.VillageName,
                //PaymentDueDate:customerDetails.PaymentDueDate,
                TypeOfSale: typeOfSale,
                OpeningBalance: openingBalance,
                TotalCredit: totalCredit,
                AmountCollected: totalPayments,
                ClosingBalance: closingBalance,
                CreditRecords: salesCredits.filter(doc => doc.FarmerLocalId === FarmerLocalId),
                AmountCollectedRecords: paymentsCollected.filter(doc => doc.FarmerLocalId === FarmerLocalId),
            };
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.allCustomersClosingBalance13FebLatest = allCustomersClosingBalance13FebLatest;
const allCustomersClosingBalance = async (req, res) => {
    try {
        const { FinancialYear, StationIds } = req.body;
        const specificStartDate = new Date('2024-07-06');
        if (!FinancialYear || !StationIds) {
            return res.status(400).send("Financial year and Station IDs are required");
        }
        // Aggregate Opening Balances, Sales Records, Credits, and Payments in parallel
        const [openingBalances, allSalesRecords, salesCredits, paymentsCollected] = await Promise.all([
            CustCrOB_1.default.aggregate([
                { $match: { StationId: { $in: StationIds }, FinancialYear } },
                { $project: { FarmerLocalId: 1, OpeningCredit: 1, FarmerName: 1, Mobile: 1, Village: 1, StationId: 1, OutletLegalName: 1 } },
            ]),
            SaleTransHeader_1.default.aggregate([
                { $match: { StationId: { $in: StationIds }, FinancialYear, Credit: { $gt: 0 } } },
                { $project: { FarmerLocalId: 1, CustomerName: 1, MobileNo: 1, VillageName: 1, StationId: 1, OutletLegalName: 1, TypeOfSale: 1 } },
            ]),
            SaleTransHeader_1.default.aggregate([
                { $match: { StationId: { $in: StationIds }, FinancialYear, CreatedDate: { $gte: specificStartDate }, Credit: { $gt: 0 } } },
                { $group: { _id: "$FarmerLocalId", totalCredit: { $sum: { $cond: [{ $eq: ["$TransactionType", 0] }, "$Credit", { $multiply: ["$Credit", -1] }] } } } },
                { $project: { FarmerLocalId: "$_id", totalCredit: 1, _id: 0 } },
            ]),
            CustomerCreditsCollected_1.default.aggregate([
                { $match: { StationId: { $in: StationIds }, FinancialYear } },
                { $group: { _id: "$FarmerLocalId", totalPayments: { $sum: "$AmountCollected" } } },
                { $project: { FarmerLocalId: "$_id", totalPayments: 1, _id: 0 } },
            ])
        ]);
        // Maps for quick lookup
        const openingBalanceMap = Object.fromEntries(openingBalances.map(doc => [doc.FarmerLocalId, doc.OpeningCredit || 0]));
        const creditMap = Object.fromEntries(salesCredits.map(doc => [doc.FarmerLocalId, doc.totalCredit || 0]));
        const paymentMap = Object.fromEntries(paymentsCollected.map(doc => [doc.FarmerLocalId, doc.totalPayments || 0]));
        // Customer details map from Sales Records
        const customerDetailsMap = Object.fromEntries(allSalesRecords.map(doc => [
            doc.FarmerLocalId,
            { FarmerName: doc.CustomerName, MobileNo: doc.MobileNo, VillageName: doc.VillageName, StationId: doc.StationId, OutletLegalName: doc.OutletLegalName }
        ]));
        // Customer details map from Opening Balances
        const OBDetailsMap = Object.fromEntries(openingBalances.map(doc => [
            doc.FarmerLocalId,
            { FarmerName: doc.FarmerName, MobileNo: doc.Mobile, VillageName: doc.Village, StationId: doc.StationId, OutletLegalName: doc.OutletLegalName }
        ]));
        const uniqueFarmerLocalIds = Array.from(new Set([...openingBalances.map(doc => doc.FarmerLocalId), ...allSalesRecords.map(doc => doc.FarmerLocalId)]));
        const result = uniqueFarmerLocalIds.map(FarmerLocalId => {
            const openingBalance = openingBalanceMap[FarmerLocalId] || 0;
            const totalCredit = creditMap[FarmerLocalId] || 0;
            const totalPayments = paymentMap[FarmerLocalId] || 0;
            const closingBalance = openingBalance + totalCredit - totalPayments;
            // Get details from Sales or fallback to OpeningBalances
            const customerDetails = customerDetailsMap[FarmerLocalId] || OBDetailsMap[FarmerLocalId] || {
                FarmerName: "Unknown",
                MobileNo: "Unknown",
                VillageName: "Unknown",
                StationId: "Unknown",
                OutletLegalName: "Unknown"
            };
            const typeOfSale = allSalesRecords
                .filter(doc => doc.FarmerLocalId === FarmerLocalId)
                .map(doc => doc.TypeOfSale)
                .filter((value, index, self) => self.indexOf(value) === index)
                .join(", ") || "Unknown";
            return {
                FarmerLocalId,
                StationId: customerDetails.StationId,
                OutletLegalName: customerDetails.OutletLegalName,
                FarmerName: customerDetails.FarmerName,
                MobileNo: customerDetails.MobileNo,
                VillageName: customerDetails.VillageName,
                TypeOfSale: typeOfSale,
                OpeningBalance: openingBalance,
                TotalCredit: totalCredit,
                AmountCollected: totalPayments,
                ClosingBalance: closingBalance,
                CreditRecords: salesCredits.filter(doc => doc.FarmerLocalId === FarmerLocalId),
                AmountCollectedRecords: paymentsCollected.filter(doc => doc.FarmerLocalId === FarmerLocalId),
            };
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.allCustomersClosingBalance = allCustomersClosingBalance;
const allCustomersClosingBalancetesting = async (req, res) => {
    try {
        const { FinancialYear, StationIds } = req.body;
        const specificStartDate = new Date('2024-07-06');
        if (!FinancialYear || !StationIds) {
            return res.status(400).send("Financial year and Station IDs are required");
        }
        // Fetch data in parallel
        const [openingBalances, allSalesRecords, salesCredits, paymentsCollected] = await Promise.all([
            CustCrOB_1.default.aggregate([
                { $match: { StationId: { $in: StationIds }, FinancialYear } },
                { $project: { FarmerLocalId: 1, OpeningCredit: 1 } },
            ]),
            SaleTransHeader_1.default.aggregate([
                { $match: { StationId: { $in: StationIds }, FinancialYear } },
                { $project: { FarmerLocalId: 1, CustomerName: 1, MobileNo: 1, VillageName: 1, StationId: 1, OutletLegalName: 1, TypeOfSale: 1 } },
            ]),
            SaleTransHeader_1.default.aggregate([
                { $match: { StationId: { $in: StationIds }, FinancialYear, CreatedDate: { $gte: specificStartDate }, Credit: { $ne: null } } },
                { $group: { _id: "$FarmerLocalId", totalCredit: { $sum: { $cond: [{ $eq: ["$TransactionType", 0] }, "$Credit", { $multiply: ["$Credit", -1] }] } } } },
                { $project: { FarmerLocalId: "$_id", totalCredit: 1, _id: 0 } },
            ]),
            CustomerCreditsCollected_1.default.aggregate([
                { $match: { StationId: { $in: StationIds }, FinancialYear } },
                { $group: { _id: "$FarmerLocalId", totalPayments: { $sum: "$AmountCollected" } } },
                { $project: { FarmerLocalId: "$_id", totalPayments: 1, _id: 0 } },
            ])
        ]);
        const openingBalanceMap = Object.fromEntries(openingBalances.map(doc => [String(doc.FarmerLocalId), doc.OpeningCredit || 0]));
        const creditMap = Object.fromEntries(salesCredits.map(doc => [String(doc.FarmerLocalId), doc.totalCredit || 0]));
        const paymentMap = Object.fromEntries(paymentsCollected.map(doc => [String(doc.FarmerLocalId), doc.totalPayments || 0]));
        const customerDetailsMap = Object.fromEntries(allSalesRecords.map(doc => [
            String(doc.FarmerLocalId),
            {
                FarmerName: doc.CustomerName,
                MobileNo: doc.MobileNo,
                VillageName: doc.VillageName,
                StationId: doc.StationId,
                OutletLegalName: doc.OutletLegalName,
            }
        ]));
        const result = Array.from(new Set(allSalesRecords.map(doc => String(doc.FarmerLocalId))))
            .map(FarmerLocalId => {
            const openingBalance = openingBalanceMap[FarmerLocalId] || 0;
            const totalCredit = creditMap[FarmerLocalId] || 0;
            const totalPayments = paymentMap[FarmerLocalId] || 0;
            const closingBalance = openingBalance + totalCredit - totalPayments;
            const customerDetails = customerDetailsMap[FarmerLocalId] || {};
            const typeOfSale = allSalesRecords
                .filter(doc => String(doc.FarmerLocalId) === FarmerLocalId)
                .map(doc => doc.TypeOfSale)
                .filter((value, index, self) => self.indexOf(value) === index)
                .join(", ") || "Unknown";
            return {
                FarmerLocalId,
                StationId: customerDetails.StationId || "",
                OutletLegalName: customerDetails.OutletLegalName || "",
                FarmerName: customerDetails.FarmerName || "",
                MobileNo: customerDetails.MobileNo || "",
                VillageName: customerDetails.VillageName || "",
                TypeOfSale: typeOfSale,
                OpeningBalance: openingBalance,
                TotalCredit: totalCredit,
                AmountCollected: totalPayments,
                ClosingBalance: closingBalance,
                CreditRecords: salesCredits.filter(doc => String(doc.FarmerLocalId) === FarmerLocalId),
                AmountCollectedRecords: paymentsCollected.filter(doc => String(doc.FarmerLocalId) === FarmerLocalId),
            };
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.allCustomersClosingBalancetesting = allCustomersClosingBalancetesting;
const allCustomersClosingBalance23Sec = async (req, res) => {
    try {
        const { FinancialYear, StationIds } = req.body; // Assuming you are passing these in the request body
        const specificStartDate = new Date('2024-07-06'); // Hardcoded start date
        if (!FinancialYear || !StationIds) {
            return res.status(400).send("Financial year and Station IDs are required");
        }
        // Single query to fetch all necessary data
        const [data] = await Promise.all([
            SaleTransHeader_1.default.aggregate([
                {
                    $match: {
                        StationId: { $in: StationIds },
                        FinancialYear,
                    },
                },
                {
                    $lookup: {
                        from: "CustCrOB",
                        let: { farmerId: "$FarmerLocalId", stationId: "$StationId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$FarmerLocalId", "$$farmerId"] },
                                            { $eq: ["$StationId", "$$stationId"] },
                                            { $eq: ["$FinancialYear", FinancialYear] },
                                        ],
                                    },
                                },
                            },
                            { $project: { OpeningCredit: 1 } },
                        ],
                        as: "OpeningBalances",
                    },
                },
                {
                    $lookup: {
                        from: "CustomerCreditsCollected",
                        let: { farmerId: "$FarmerLocalId", stationId: "$StationId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$FarmerLocalId", "$$farmerId"] },
                                            { $eq: ["$StationId", "$$stationId"] },
                                            { $eq: ["$FinancialYear", FinancialYear] },
                                        ],
                                    },
                                },
                            },
                            { $group: { _id: "$FarmerLocalId", totalPayments: { $sum: "$AmountCollected" } } },
                        ],
                        as: "Payments",
                    },
                },
                {
                    $lookup: {
                        from: "SaleTransHeader",
                        let: { farmerId: "$FarmerLocalId", stationId: "$StationId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$FarmerLocalId", "$$farmerId"] },
                                            { $eq: ["$StationId", "$$stationId"] },
                                            { $eq: ["$FinancialYear", FinancialYear] },
                                            { $gte: ["$CreatedDate", specificStartDate] },
                                            { $ne: ["$Credit", null] },
                                        ],
                                    },
                                },
                            },
                            {
                                $group: {
                                    _id: "$FarmerLocalId",
                                    totalCredit: {
                                        $sum: {
                                            $cond: [
                                                { $eq: ["$TransactionType", 0] },
                                                "$Credit",
                                                { $multiply: ["$Credit", -1] },
                                            ],
                                        },
                                    },
                                },
                            },
                        ],
                        as: "Credits",
                    },
                },
                {
                    $addFields: {
                        OpeningCredit: { $arrayElemAt: ["$OpeningBalances.OpeningCredit", 0] },
                        TotalPayments: { $arrayElemAt: ["$Payments.totalPayments", 0] },
                        TotalCredit: { $arrayElemAt: ["$Credits.totalCredit", 0] },
                    },
                },
                {
                    $project: {
                        FarmerLocalId: 1,
                        CustomerName: 1,
                        MobileNo: 1,
                        VillageName: 1,
                        StationId: 1,
                        OutletLegalName: 1,
                        TypeOfSale: 1,
                        OpeningCredit: { $ifNull: ["$OpeningCredit", 0] },
                        TotalCredit: { $ifNull: ["$TotalCredit", 0] },
                        TotalPayments: { $ifNull: ["$TotalPayments", 0] },
                    },
                },
            ]),
        ]);
        // Process data and calculate the closing balances
        const result = data.map(doc => ({
            FarmerLocalId: doc.FarmerLocalId,
            StationId: doc.StationId,
            OutletLegalName: doc.OutletLegalName,
            FarmerName: doc.CustomerName,
            MobileNo: doc.MobileNo,
            VillageName: doc.VillageName,
            TypeOfSale: doc.TypeOfSale || "Unknown",
            OpeningBalance: doc.OpeningCredit,
            TotalCredit: doc.TotalCredit,
            AmountCollected: doc.TotalPayments,
            ClosingBalance: doc.OpeningCredit + doc.TotalCredit - doc.TotalPayments,
        }));
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.allCustomersClosingBalance23Sec = allCustomersClosingBalance23Sec;
// WithoutSpecificDate
// export const allCustomersClosingBalance = async (req: Request, res: Response) => {
//     try {
//         const { FinancialYear, StationIds } = req.body; // Assuming you are passing these in the request body
//         if (!FinancialYear || !StationIds) {
//             return res.status(400).send("Financial year and Station IDs are required");
//         }
//         // Retrieve Opening Balances for all customers
//         const openingBalances = await CustCrOB.find({ StationId: { $in: StationIds }, FinancialYear });
//         const openingBalanceMap = openingBalances.reduce((acc, doc) => {
//             acc[doc.FarmerLocalId] = doc.OpeningCredit;
//             return acc;
//         }, {} as Record<string, number>);
//         console.log(`Opening Balances: ${JSON.stringify(openingBalanceMap)}`);
//         // Retrieve Credits in sales for all customers within the financial year and station IDs
//         const salesCredits = await SaleTransHeader.find({ StationId: { $in: StationIds }, FinancialYear });
//         const creditMap = salesCredits.reduce((acc, doc) => {
//             if (!acc[doc.FarmerLocalId]) acc[doc.FarmerLocalId] = 0;
//             acc[doc.FarmerLocalId] += doc.Credit;
//             return acc;
//         }, {} as Record<string, number>);
//         console.log(`Sales Credits: ${JSON.stringify(creditMap)}`);
//         // Retrieve Amounts collected for all customers within the financial year and station IDs
//         const paymentsCollected = await CustomerCreditsCollected.find({ StationId: { $in: StationIds }, FinancialYear });
//         const paymentMap = paymentsCollected.reduce((acc, doc) => {
//             if (!acc[doc.FarmerLocalId]) acc[doc.FarmerLocalId] = 0;
//             acc[doc.FarmerLocalId] += doc.AmountCollected;
//             return acc;
//         }, {} as Record<string, number>);
//         console.log(`Payments Collected: ${JSON.stringify(paymentMap)}`);
//         // Retrieve Customer Details from SaleTransHeader
//         const customerDetailsMap = salesCredits.reduce((acc, doc) => {
//             if (!acc[doc.FarmerLocalId]) {
//                 acc[doc.FarmerLocalId] = {
//                     FarmerName: doc.CustomerName,
//                     MobileNo: doc.MobileNo,
//                     VillageName: doc.VillageName,
//                     StationId : doc.StationId,
//                     OutletLegalName : doc.OutletLegalName
//                 };
//             }
//             return acc;
//         }, {} as Record<string, { FarmerName: string, MobileNo: string, VillageName: string,StationId:string,OutletLegalName:string }>);
//         console.log(`Customer Details: ${JSON.stringify(customerDetailsMap)}`);
//         // Retrieve Customer Names
//         const customerIds = Array.from(new Set([
//             ...Object.keys(openingBalanceMap),
//             ...Object.keys(creditMap),
//             ...Object.keys(paymentMap)
//         ]));
//         // Calculate Closing Balances for each customer
//         const result = customerIds.map(FarmerLocalId => {
//             const openingBalance = openingBalanceMap[FarmerLocalId] || 0;
//             const totalCredit = creditMap[FarmerLocalId] || 0;
//             const totalPayments = paymentMap[FarmerLocalId] || 0;
//             const closingBalance = openingBalance + totalCredit - totalPayments;
//             // Credit Details
//             const creditDetails = totalCredit > 0 ? { CreditRecords: salesCredits.filter(doc => doc.FarmerLocalId === FarmerLocalId) } : null;
//             // Amount Collected Details
//             const amountCollectedDetails = totalPayments > 0 ? { AmountCollectedRecords: paymentsCollected.filter(doc => doc.FarmerLocalId === FarmerLocalId) } : null;
//             const customerDetails = customerDetailsMap[FarmerLocalId] || {};
//             return {
//                 FarmerLocalId: FarmerLocalId,
//                 FarmerName: customerDetails.FarmerName,
//                 MobileNo: customerDetails.MobileNo,
//                 VillageName: customerDetails.VillageName,
//                 StationId : customerDetails.StationId,
//                 OutletLegalName : customerDetails.OutletLegalName,
//                 OpeningBalance: openingBalance,
//                 TotalCredit: totalCredit,
//                 AmountCollected: totalPayments,
//                 ClosingBalance: closingBalance,
//                 ...creditDetails,
//                 ...amountCollectedDetails
//             };
//         });
//         res.status(200).json(result);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error");
//     }
// };
const ListOfOutletsClosingBalanceByFinancialYear = async (req, res) => {
    try {
        const { FinancialYear, StationIds, Date: dateString } = req.body;
        if (!FinancialYear || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0 || !dateString) {
            return res.status(400).send("Financial year, station IDs, and date are required");
        }
        // Parse the incoming date string in DD-MM-YYYY format to a JavaScript Date object
        const targetDate = moment_1.default.utc(dateString, 'DD-MM-YYYY').startOf('day').toDate();
        console.log(targetDate);
        const stationResults = [];
        // Loop through each station
        for (const stationId of StationIds) {
            // Retrieve Opening Balance for the station up to the target date
            const openingBalances = await CustCrOB_1.default.find({
                FinancialYear,
                StationId: stationId,
                CustCrOBDate: { $lte: (0, moment_1.default)(targetDate).toISOString() } // Convert the target date to ISO string for comparison
            });
            const totalOpeningBalance = openingBalances.reduce((sum, doc) => sum + doc.OpeningCredit, 0);
            const specificStartDate = new Date('2024-07-06');
            // Retrieve Credits in sales for the station within the financial year up to the target date
            const salesCredits = await SaleTransHeader_1.default.find({
                FinancialYear,
                StationId: stationId,
                Credit: { $gt: 0 },
                InvoiceDate: { $gte: specificStartDate, $lte: targetDate, },
                //InvoiceDate: { $lte: targetDate } // Compare as ISODate
            });
            const totalCredit = salesCredits.reduce((sum, doc) => sum + doc.Credit, 0);
            console.log(`Total Credit for Station ${stationId}:`, totalCredit);
            // Retrieve Amounts collected for the station within the financial year up to the target date
            const paymentsCollected = await CustomerCreditsCollected_1.default.find({
                FinancialYear,
                StationId: stationId,
                CollectedDate: { $lte: (0, moment_1.default)(targetDate).toISOString() } // Convert the target date to ISO string for comparison
            });
            const totalPayments = paymentsCollected.reduce((sum, doc) => sum + doc.AmountCollected, 0);
            // Calculate Total Credit Outside for the station
            const totalCreditOutside = totalOpeningBalance + totalCredit - totalPayments;
            // Store results for the station
            stationResults.push({
                StationId: stationId,
                TotalOpeningBalance: totalOpeningBalance,
                TotalCredit: totalCredit,
                TotalAmountCollected: totalPayments,
                TotalCreditOutside: totalCreditOutside
            });
        }
        res.status(200).json(stationResults);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.ListOfOutletsClosingBalanceByFinancialYear = ListOfOutletsClosingBalanceByFinancialYear;
const CustomerDayWiseTransactions = async (req, res) => {
    try {
        const { FarmerLocalId, FinancialYear } = req.body;
        // Parse the Financial Year range
        const [startYear, endYear] = FinancialYear.split('-').map(Number);
        // Define projection to exclude _id field
        const projection = { _id: 0, CreatedBy: 0, CreatedDate: 0, __v: 0 };
        // Retrieve Opening Balance for the given Financial Year and CustomerId
        const openingBalanceDoc = await CustCrOB_1.default.findOne({ FarmerLocalId, FinancialYear }, projection);
        // Retrieve Credit from SaleTransHeader for the given Financial Year and CustomerId
        const creditDocs = await SaleTransHeader_1.default.find({ FarmerLocalId, FinancialYear }, projection);
        // Retrieve Amount Collected from CustomerCreditsCollected for the given Financial Year and CustomerId
        const paymentDocs = await CustomerCreditsCollected_1.default.find({ FarmerLocalId, FinancialYear }, projection);
        // Calculate Opening Balance, Total Credit, Total Payments, and Closing Balance
        const OpeningBalance = openingBalanceDoc ? openingBalanceDoc.OpeningCredit : 0;
        const TotalCredit = creditDocs.reduce((sum, doc) => sum + doc.Credit, 0);
        const TotalPayments = paymentDocs.reduce((sum, doc) => sum + doc.AmountCollected, 0);
        const ClosingBalance = OpeningBalance + TotalCredit - TotalPayments;
        // Construct the response object
        const response = {
            OpeningBalance,
            TotalCredit,
            TotalPayments,
            ClosingBalance,
            CustCrOBRecords: openingBalanceDoc,
            SaleTransHeaderRecords: creditDocs,
            CustomerCreditsCollectedRecords: paymentDocs
        };
        // Send the response
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.CustomerDayWiseTransactions = CustomerDayWiseTransactions;
const totalCreditOutside27Jan = async (req, res) => {
    try {
        const { FinancialYear, Date: dateString } = req.body;
        if (!FinancialYear || !dateString) {
            return res.status(400).json({ error: "Financial year and date are required" });
        }
        // Parse the incoming date string in DD-MM-YYYY format to a JavaScript Date object
        const targetDate = moment_1.default.utc(dateString, 'DD-MM-YYYY').startOf('day').toDate();
        if (!targetDate || !moment_1.default.utc(targetDate).isValid()) {
            return res.status(400).json({ error: "Invalid date format, expected DD-MM-YYYY" });
        }
        console.log(`Target Date: ${targetDate}`); // Debugging line to check the target date
        const specificStartDate = new Date('2024-07-06');
        // Retrieve Opening Balances for all customers up to and including the target date
        const openingBalances = await CustCrOB_1.default.find({
            FinancialYear,
            CustCrOBDate: { $lte: (0, moment_1.default)(targetDate).toISOString() } // Use $lte to include the target date
        });
        const totalOpeningBalance = openingBalances.reduce((sum, doc) => sum + doc.OpeningCredit, 0);
        console.log(`Total Opening Balance up to ${dateString}: ${totalOpeningBalance}`);
        // Retrieve Credits in sales for all customers within the financial year up to and including the target date
        const salesCredits = await SaleTransHeader_1.default.find({
            FinancialYear,
            InvoiceDate: { $gte: specificStartDate, $lte: targetDate, },
            Credit: { $gt: 0 }
            //  InvoiceDate: {$lte: targetDate } // Use $lte to include the target date
        });
        console.log(targetDate);
        const totalCredit = salesCredits.reduce((sum, doc) => sum + doc.Credit, 0);
        console.log(`Total Credit up to ${dateString}: ${totalCredit}`);
        // Retrieve Amounts collected for all customers within the financial year up to and including the target date
        const paymentsCollected = await CustomerCreditsCollected_1.default.find({
            FinancialYear,
            CollectedDate: { $lte: (0, moment_1.default)(targetDate).toISOString() } // Use $lte to include the target date
        });
        const totalPayments = paymentsCollected.reduce((sum, doc) => sum + doc.AmountCollected, 0);
        console.log(`Total Amount Collected up to ${dateString}: ${totalPayments}`);
        // Calculate Total Credit Outside
        const totalCreditOutside = totalOpeningBalance + totalCredit - totalPayments;
        console.log(`Total Credit Outside up to ${dateString}: ${totalCreditOutside}`);
        res.status(200).json({
            //records:salesCredits,
            TotalOpeningBalance: totalOpeningBalance,
            TotalCredit: totalCredit,
            TotalAmountCollected: totalPayments,
            TotalCreditOutside: totalCreditOutside
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.totalCreditOutside27Jan = totalCreditOutside27Jan;
const totalCreditOutside = async (req, res) => {
    try {
        const { FinancialYear, Date: dateString } = req.body;
        if (!FinancialYear || !dateString) {
            return res.status(400).json({ error: "Financial year and date are required" });
        }
        // Parse the incoming date string in DD-MM-YYYY format to a JavaScript Date object
        const targetDate = moment_1.default.utc(dateString, 'DD-MM-YYYY').startOf('day').toDate();
        if (!targetDate || !moment_1.default.utc(targetDate).isValid()) {
            return res.status(400).json({ error: "Invalid date format, expected DD-MM-YYYY" });
        }
        console.log(`Target Date: ${targetDate}`); // Debugging line to check the target date
        const specificStartDate = new Date('2024-07-06');
        // Retrieve Opening Balances for all customers up to and including the target date
        const openingBalances = await CustCrOB_1.default.find({
            FinancialYear,
            CustCrOBDate: { $lte: (0, moment_1.default)(targetDate).toISOString() }, // Use $lte to include the target date
        });
        const totalOpeningBalance = openingBalances.reduce((sum, doc) => sum + doc.OpeningCredit, 0);
        console.log(`Total Opening Balance up to ${dateString}: ${totalOpeningBalance}`);
        // Retrieve Credits in sales for all customers within the financial year up to and including the target date
        const salesCredits = await SaleTransHeader_1.default.find({
            FinancialYear,
            InvoiceDate: { $gte: specificStartDate, $lte: targetDate },
            Credit: { $gt: 0 },
        });
        // Calculate total credit considering TransactionType
        const totalCredit = salesCredits.reduce((sum, doc) => {
            // Add if TransactionType is 0, subtract if TransactionType is 1
            return doc.TransactionType === 0
                ? sum + doc.Credit
                : doc.TransactionType === 1
                    ? sum - doc.Credit
                    : sum;
        }, 0);
        console.log(`Total Credit (adjusted by TransactionType) up to ${dateString}: ${totalCredit}`);
        // Retrieve Amounts collected for all customers within the financial year up to and including the target date
        const paymentsCollected = await CustomerCreditsCollected_1.default.find({
            FinancialYear,
            CollectedDate: { $lte: (0, moment_1.default)(targetDate).toISOString() }, // Use $lte to include the target date
        });
        const totalPayments = paymentsCollected.reduce((sum, doc) => sum + doc.AmountCollected, 0);
        console.log(`Total Amount Collected up to ${dateString}: ${totalPayments}`);
        // Calculate Total Credit Outside
        const totalCreditOutside = totalOpeningBalance + totalCredit - totalPayments;
        console.log(`Total Credit Outside up to ${dateString}: ${totalCreditOutside}`);
        res.status(200).json({
            TotalOpeningBalance: totalOpeningBalance,
            TotalCredit: totalCredit,
            TotalAmountCollected: totalPayments,
            TotalCreditOutside: totalCreditOutside,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.totalCreditOutside = totalCreditOutside;
const ListOfOutletsDiscountedBillValueByDay = async (req, res) => {
    try {
        const { FinancialYear, StationIds } = req.body;
        if (!FinancialYear || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send("Financial year and station IDs are required");
        }
        // Initialize result object to store data for each station
        const stationResults = {};
        // Loop through each station
        for (const stationId of StationIds) {
            // Retrieve SaleTransHeader data for the station within the financial year
            const saleTransHeaders = await SaleTransHeader_1.default.find({
                FinancialYear,
                StationId: stationId
            });
            // Iterate over each SaleTransHeader to calculate the sum of DiscountedBillValue daywise
            saleTransHeaders.forEach(header => {
                const date = header.InvoiceDate.toISOString().split('T')[0]; // Extract date without time
                const discountedBillValue = header.DiscountedBillValue;
                // Initialize or update the sum for the specific date for the station
                if (!stationResults[stationId]) {
                    stationResults[stationId] = {};
                }
                if (!stationResults[stationId][date]) {
                    stationResults[stationId][date] = 0;
                }
                stationResults[stationId][date] += discountedBillValue;
            });
        }
        res.status(200).json(stationResults);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.ListOfOutletsDiscountedBillValueByDay = ListOfOutletsDiscountedBillValueByDay;
const TotalDiscountedBillValueByDay = async (req, res) => {
    try {
        const { FinancialYear, StationIds } = req.body;
        if (!FinancialYear || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send("Financial year and station IDs are required");
        }
        const dailyDiscountedBillValue = {};
        for (const stationId of StationIds) {
            const saleTransHeaders = await SaleTransHeader_1.default.find({
                FinancialYear,
                StationId: stationId
            });
            saleTransHeaders.forEach(header => {
                const date = header.InvoiceDate.toISOString().split('T')[0];
                const discountedBillValue = header.DiscountedBillValue;
                if (!dailyDiscountedBillValue[date]) {
                    dailyDiscountedBillValue[date] = 0;
                }
                dailyDiscountedBillValue[date] += discountedBillValue;
            });
        }
        const formattedResults = Object.keys(dailyDiscountedBillValue).map(date => ({
            Date: date,
            Amount: dailyDiscountedBillValue[date]
        }));
        res.status(200).json(formattedResults);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};
exports.TotalDiscountedBillValueByDay = TotalDiscountedBillValueByDay;
const CurrentSale = async (req, res) => {
    try {
        const { FinancialYear, StationIds, Org } = req.body;
        console.log("Received FinancialYear:", FinancialYear);
        console.log("Received StationIds:", StationIds);
        console.log("Received Org:", Org);
        if (!FinancialYear || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0 || Org === undefined) {
            return res.status(400).send("Financial year, station IDs, and Org flag are required");
        }
        const result = []; // Define result structure as an array of objects
        const dailyDiscountedBillValue = {};
        if (Org) {
            // Org is true - calculate overall discounted bill value
            const saleTransHeaders = await SaleTransHeader_1.default.find({
                FinancialYear,
                StationId: { $in: StationIds }
            });
            saleTransHeaders.forEach(header => {
                const date = header.InvoiceDate.toISOString().split('T')[0];
                const discountedBillValue = header.DiscountedBillValue;
                if (!dailyDiscountedBillValue[date]) {
                    dailyDiscountedBillValue[date] = {};
                }
                if (!dailyDiscountedBillValue[date]["overall"]) {
                    dailyDiscountedBillValue[date]["overall"] = 0;
                }
                dailyDiscountedBillValue[date]["overall"] += discountedBillValue;
            });
            for (const date in dailyDiscountedBillValue) {
                result.push({
                    Date: date,
                    Amount: dailyDiscountedBillValue[date]["overall"]
                });
            }
        }
        else {
            // Org is false - calculate station-wise discounted bill value
            for (const stationId of StationIds) {
                const saleTransHeaders = await SaleTransHeader_1.default.find({
                    FinancialYear,
                    StationId: stationId
                });
                saleTransHeaders.forEach(header => {
                    const date = header.InvoiceDate.toISOString().split('T')[0];
                    const discountedBillValue = header.DiscountedBillValue;
                    if (!dailyDiscountedBillValue[date]) {
                        dailyDiscountedBillValue[date] = {};
                    }
                    if (!dailyDiscountedBillValue[date][stationId]) {
                        dailyDiscountedBillValue[date][stationId] = 0;
                    }
                    dailyDiscountedBillValue[date][stationId] += discountedBillValue;
                });
                for (const date in dailyDiscountedBillValue) {
                    if (dailyDiscountedBillValue[date][stationId] !== undefined) {
                        result.push({
                            Date: date,
                            StationId: stationId,
                            Amount: dailyDiscountedBillValue[date][stationId]
                        });
                    }
                }
            }
        }
        console.log("Result:", result);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.CurrentSale = CurrentSale;
const getSalesByHourFinalDraftwithout5 = async (req, res) => {
    try {
        const { FromDate, ToDate, ListOfStationIds } = req.body;
        // Validate input
        if (!FromDate || !ToDate) {
            return res.status(400).json({ error: "FromDate and ToDate are required" });
        }
        if (!ListOfStationIds || !ListOfStationIds.length) {
            return res.status(400).json({ error: "ListOfStationIds is required" });
        }
        // Parse date ranges
        const start = (0, moment_1.default)(FromDate, "DD-MM-YYYY").startOf('day').toDate();
        const end = (0, moment_1.default)(ToDate, "DD-MM-YYYY").endOf('day').toDate();
        // Calculate the number of days in the range
        const numOfDays = (0, moment_1.default)(end).diff((0, moment_1.default)(start), 'days') + 1;
        // Aggregating sales data by station, date, and hour
        const salesData = await SaleTransHeader_1.default.aggregate([
            {
                $match: {
                    CreatedDate: {
                        $gte: start,
                        $lte: end
                    },
                    TransactionType: 0, // Filter by TransactionType 0
                    StationId: { $in: ListOfStationIds } // Filter by station IDs
                }
            },
            {
                $group: {
                    _id: {
                        stationId: "$StationId",
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$CreatedDate" } }, // Group by date
                        hour: { $hour: "$CreatedDate" } // Group by hour of the day (0-23)
                    },
                    salesCount: { $sum: 1 } // Count sales for each day, hour, and station
                }
            },
            {
                $sort: { "_id.stationId": 1, "_id.date": 1, "_id.hour": 1 } // Sort by station, date, and hour
            }
        ]);
        // If no data, return an appropriate message
        if (!salesData.length) {
            return res.status(404).json({ error: "No sales data found for the given criteria" });
        }
        // Process sales data to calculate average sales and daily sales count
        const stationWiseAverageSales = [];
        // Organize sales by station and hour, with daily sales counts
        const stationSales = {};
        salesData.forEach(item => {
            const stationId = item._id.stationId;
            const hour = item._id.hour;
            const date = item._id.date;
            const salesCount = item.salesCount;
            if (!stationSales[stationId]) {
                stationSales[stationId] = {};
            }
            if (!stationSales[stationId][hour]) {
                stationSales[stationId][hour] = { totalSales: 0, count: 0, dailySales: [] };
            }
            // Add sales count for each day
            stationSales[stationId][hour].dailySales.push({ date: date, salesCount: salesCount });
            // Increment total sales and count
            stationSales[stationId][hour].totalSales += salesCount;
            stationSales[stationId][hour].count += 1;
        });
        // Prepare the response format
        Object.keys(stationSales).forEach(stationId => {
            for (let hour = 0; hour < 24; hour++) {
                const hourData = stationSales[stationId][hour] || { totalSales: 0, count: 0, dailySales: [] };
                const averageSales = hourData.count > 0 ? (hourData.totalSales / numOfDays) : 0;
                // Format the hour into 12-hour AM/PM format
                const formattedHour = (hour % 12 || 12) + (hour >= 12 ? ' PM' : ' AM');
                // Push average sales and daily sales counts into the result array
                stationWiseAverageSales.push({
                    stationId: stationId,
                    hour: formattedHour,
                    averageSales: parseFloat(averageSales.toFixed(2)),
                    dailySales: hourData.dailySales // Array of daily sales counts
                });
            }
        });
        // Return the result
        return res.json(stationWiseAverageSales);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getSalesByHourFinalDraftwithout5 = getSalesByHourFinalDraftwithout5;
const getSalesByHour = async (req, res) => {
    try {
        const { FromDate, ToDate, ListOfStationIds } = req.body;
        // Validate input
        if (!FromDate || !ToDate) {
            return res.status(400).json({ error: "FromDate and ToDate are required" });
        }
        if (!ListOfStationIds || !ListOfStationIds.length) {
            return res.status(400).json({ error: "ListOfStationIds is required" });
        }
        // Parse date ranges
        const start = (0, moment_1.default)(FromDate, "DD-MM-YYYY").startOf('day').toDate();
        const end = (0, moment_1.default)(ToDate, "DD-MM-YYYY").endOf('day').toDate();
        // Calculate the number of days in the range
        const numOfDays = (0, moment_1.default)(end).diff((0, moment_1.default)(start), 'days') + 1;
        // Aggregating sales data by station, date, and hour (adjusted by +5:30 timezone offset)
        const salesData = await SaleTransHeader_1.default.aggregate([
            {
                $match: {
                    CreatedDate: {
                        $gte: start,
                        $lte: end
                    },
                    TransactionType: 0, // Filter by TransactionType 0
                    StationId: { $in: ListOfStationIds } // Filter by station IDs
                }
            },
            {
                // Add 5 hours and 30 minutes to CreatedDate
                $addFields: {
                    adjustedCreatedDate: {
                        $add: ["$CreatedDate", 5 * 60 * 60 * 1000 + 30 * 60 * 1000] // 5 hours and 30 minutes in milliseconds
                    }
                }
            },
            {
                $group: {
                    _id: {
                        stationId: "$StationId",
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$adjustedCreatedDate" } }, // Group by adjusted date
                        hour: { $hour: "$adjustedCreatedDate" } // Group by adjusted hour of the day (0-23)
                    },
                    salesCount: { $sum: 1 } // Count sales for each day, hour, and station
                }
            },
        ]);
        // If no data, return an appropriate message
        if (!salesData.length) {
            return res.status(200).json({ error: "No sales data found for the given criteria" });
        }
        const stationDetails = await Stations_1.default.find({
            StationId: { $in: ListOfStationIds }
        }).select('StationId OutletLegalName').lean();
        // Create a map for fast lookup of OutletLegalName by StationId
        const stationNameMap = stationDetails.reduce((map, station) => {
            map[station.StationId] = station.OutletLegalName;
            return map;
        }, {});
        // Process sales data to calculate average sales and daily sales count
        const stationWiseAverageSales = [];
        // Organize sales by station and hour, with daily sales counts
        const stationSales = {};
        salesData.forEach(item => {
            const stationId = item._id.stationId;
            const hour = item._id.hour;
            const date = item._id.date;
            const salesCount = item.salesCount;
            if (!stationSales[stationId]) {
                stationSales[stationId] = {};
            }
            if (!stationSales[stationId][hour]) {
                stationSales[stationId][hour] = { totalSales: 0, count: 0, dailySales: [] };
            }
            // Add sales count for each day
            stationSales[stationId][hour].dailySales.push({ date: date, salesCount: salesCount });
            // Increment total sales and count
            stationSales[stationId][hour].totalSales += salesCount;
            stationSales[stationId][hour].count += 1;
        });
        // Prepare the response format
        Object.keys(stationSales).forEach(stationId => {
            for (let hour = 0; hour < 24; hour++) {
                const hourData = stationSales[stationId][hour] || { totalSales: 0, count: 0, dailySales: [] };
                const averageSales = hourData.count > 0 ? (hourData.totalSales / numOfDays) : 0;
                // Format the hour into 12-hour AM/PM format
                const formattedHour = (hour % 12 || 12) + (hour >= 12 ? ' PM' : ' AM');
                // Push average sales and daily sales counts into the result array
                stationWiseAverageSales.push({
                    stationId: stationId,
                    OutletLegalName: stationNameMap[stationId] || "Unknown",
                    hour: formattedHour,
                    averageSales: parseFloat(averageSales.toFixed(2)),
                    dailySales: hourData.dailySales // Array of daily sales counts
                });
            }
        });
        // Return the result
        return res.json(stationWiseAverageSales);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getSalesByHour = getSalesByHour;
const getAveragePeakHour = async (req, res) => {
    try {
        const { FromDate, ToDate } = req.body;
        if (!FromDate || !ToDate) {
            return res.status(400).json({ error: "FromDate and ToDate are required" });
        }
        const start = (0, moment_1.default)(FromDate, "DD-MM-YYYY").startOf('day').toDate();
        const end = (0, moment_1.default)(ToDate, "DD-MM-YYYY").endOf('day').toDate();
        // Calculate the number of days in the timeframe
        const diffDays = (0, moment_1.default)(end).diff(start, 'days') + 1; // Adding 1 to include both start and end dates
        const salesData = await SaleTransHeader_1.default.aggregate([
            {
                $match: {
                    CreatedDate: {
                        $gte: start,
                        $lte: end
                    }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$CreatedDate" } },
                        hour: { $hour: "$CreatedDate" }
                    },
                    dailySalesCount: { $avg: 1 } // Calculate the average daily sales count for each hour
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    hour: "$_id.hour",
                    salesCount: "$dailySalesCount",
                    averageSalesCount: { $divide: ["$dailySalesCount", diffDays] } // Calculate the average sales count per day for each hour
                }
            },
            {
                $sort: { "date": 1, "hour": 1 } // Sort by date and hour
            }
        ]);
        return res.json(salesData);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getAveragePeakHour = getAveragePeakHour;
const getPeakHour = async (req, res) => {
    try {
        const { FromDate, ToDate } = req.body;
        if (!FromDate || !ToDate) {
            return res.status(400).json({ error: "FromDate and ToDate are required" });
        }
        const start = (0, moment_1.default)(FromDate, "DD-MM-YYYY").startOf('day').toDate();
        const end = (0, moment_1.default)(ToDate, "DD-MM-YYYY").endOf('day').toDate();
        const salesData = await SaleTransHeader_1.default.aggregate([
            {
                $match: {
                    CreatedDate: {
                        $gte: start,
                        $lte: end
                    }
                }
            },
            {
                $group: {
                    _id: {
                        hour: { $hour: "$CreatedDate" }
                    },
                    dailySalesCount: { $avg: 1 } // Calculate the average daily sales count for each hour
                }
            },
            {
                $sort: { "dailySalesCount": -1 } // Sort by average sales count in descending order
            },
            {
                $limit: 1 // Take only the top result (peak hour)
            }
        ]);
        return res.json(salesData);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getPeakHour = getPeakHour;
const calculateAgeFarmerCredits1 = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds } = req.body;
        // Validate input parameters
        if (!FromDate || !ToDate || !StationIds) {
            return res.status(400).send("FromDate, ToDate, and Station IDs are required.");
        }
        const fromDate = (0, moment_1.default)(FromDate, "DD-MM-YYYY").startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, "DD-MM-YYYY").endOf('day').toDate();
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
        }
        // 1. Retrieve credits from SaleTransHeader
        const salesCredits = await SaleTransHeader_1.default.find({
            StationId: { $in: StationIds },
            Credit: { $ne: 0.0 },
            InvoiceDate: { $gte: fromDate, $lte: toDate }
        });
        // 2. Prepare a map to accumulate credits by FarmerLocalId and StationId
        const creditMap = {};
        for (const credit of salesCredits) {
            const { FarmerLocalId, StationId, Credit, TransactionType, InvoiceDate } = credit;
            // Initialize StationId and FarmerLocalId in creditMap
            if (!creditMap[StationId]) {
                creditMap[StationId] = {};
            }
            if (!creditMap[StationId][FarmerLocalId]) {
                creditMap[StationId][FarmerLocalId] = { Credits: [], TotalCredit: 0 };
            }
            // Process TransactionType 0 for adding credit
            if (TransactionType === 0) {
                // Calculate the age of the credit based on the InvoiceDate
                const ageInDays = Math.floor((Date.now() - new Date(InvoiceDate).getTime()) / (1000 * 3600 * 24));
                creditMap[StationId][FarmerLocalId].Credits.push({ TotalCredit: Credit, Age: ageInDays, InvoiceDate });
                // Aggregate the total credit
                creditMap[StationId][FarmerLocalId].TotalCredit += Credit;
            }
            else if (TransactionType === 1) {
                // Deduct from total (if applicable)
                creditMap[StationId][FarmerLocalId].TotalCredit -= Credit;
            }
        }
        // 3. Retrieve payments collected from CustomerCreditsCollected
        const collectedPayments = await CustomerCreditsCollected_1.default.find({
            StationId: { $in: StationIds },
            CollectedDate: { $gte: fromDate, $lte: toDate }
        });
        // 4. Adjust credits based on collected payments
        for (const payment of collectedPayments) {
            const { FarmerLocalId, AmountCollected, StationId } = payment;
            if (creditMap[StationId] && creditMap[StationId][FarmerLocalId]) {
                let remainingToSubtract = AmountCollected;
                // Subtract from the oldest credits first
                const creditsList = creditMap[StationId][FarmerLocalId].Credits;
                for (let i = 0; i < creditsList.length && remainingToSubtract > 0; i++) {
                    const credit = creditsList[i];
                    if (credit.TotalCredit > 0) {
                        if (credit.TotalCredit >= remainingToSubtract) {
                            credit.TotalCredit -= remainingToSubtract;
                            remainingToSubtract = 0;
                        }
                        else {
                            remainingToSubtract -= credit.TotalCredit;
                            credit.TotalCredit = 0; // All used up
                        }
                    }
                }
            }
        }
        // 5. Prepare the response
        const result = Object.entries(creditMap).map(([stationId, farmers]) => {
            return {
                StationId: stationId,
                Farmers: Object.entries(farmers).map(([farmerLocalId, data]) => ({
                    FarmerLocalId: farmerLocalId,
                    Credits: data.Credits.filter(credit => credit.TotalCredit > 0), // Filter out zero credits
                    TotalCredit: data.TotalCredit // Aggregated total credit
                })).filter(farmer => farmer.Credits.length > 0) // Ensure farmers with no credits are excluded
            };
        }).filter(station => station.Farmers.length > 0); // Ensure stations with no farmers are excluded
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error calculating farmer credits:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.calculateAgeFarmerCredits1 = calculateAgeFarmerCredits1;
const calculateAgeFarmerCredits = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds } = req.body;
        // Validate input parameters
        if (!FromDate || !ToDate || !StationIds) {
            return res.status(400).send("FromDate, ToDate, and Station IDs are required.");
        }
        const fromDate = (0, moment_1.default)(FromDate, "DD-MM-YYYY").startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, "DD-MM-YYYY").endOf('day').toDate();
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
        }
        // 1. Retrieve credits from SaleTransHeader
        const salesCredits = await SaleTransHeader_1.default.find({
            StationId: { $in: StationIds },
            Credit: { $ne: 0.0 },
            InvoiceDate: { $gte: fromDate, $lte: toDate }
        });
        // 2. Prepare a map to accumulate credits by FarmerLocalId and StationId
        // 2. Prepare a map to accumulate credits by FarmerLocalId and StationId
        const creditMap = {};
        for (const credit of salesCredits) {
            const { FarmerLocalId, StationId, Credit, TransactionType, InvoiceDate, CustomerName, MobileNo, VillageName } = credit;
            // Initialize StationId and FarmerLocalId in creditMap
            if (!creditMap[StationId]) {
                creditMap[StationId] = {};
            }
            if (!creditMap[StationId][FarmerLocalId]) {
                creditMap[StationId][FarmerLocalId] = {
                    Credits: [],
                    TotalCredit: 0,
                    AmountSubtracted: 0,
                    CustomerName,
                    MobileNo,
                    VillageName
                };
            }
            // const creditMap: Record<string, Record<string, { Credits: { TotalCredit: number; Age: number; InvoiceDate: Date; AmountSubtracted: number }[]; TotalCredit: number; AmountSubtracted: number }>> = {};
            // for (const credit of salesCredits) {
            //     const { FarmerLocalId, StationId, Credit, TransactionType, InvoiceDate } = credit;
            //     // Initialize StationId and FarmerLocalId in creditMap
            //     if (!creditMap[StationId]) {
            //         creditMap[StationId] = {};
            //     }
            //     if (!creditMap[StationId][FarmerLocalId]) {
            //         creditMap[StationId][FarmerLocalId] = { Credits: [], TotalCredit: 0, AmountSubtracted: 0 };
            //     }
            // Process TransactionType 0 for adding credit
            if (TransactionType === 0) {
                // Calculate the age of the credit based on the InvoiceDate
                const ageInDays = Math.floor((Date.now() - new Date(InvoiceDate).getTime()) / (1000 * 3600 * 24));
                creditMap[StationId][FarmerLocalId].Credits.push({ TotalCredit: Credit, Age: ageInDays, InvoiceDate, AmountSubtracted: 0 });
                // Aggregate the total credit
                creditMap[StationId][FarmerLocalId].TotalCredit += Credit;
            }
            else if (TransactionType === 1) {
                // Deduct from total (if applicable)
                creditMap[StationId][FarmerLocalId].TotalCredit -= Credit;
            }
        }
        // 3. Retrieve payments collected from CustomerCreditsCollected
        const collectedPayments = await CustomerCreditsCollected_1.default.find({
            StationId: { $in: StationIds },
        });
        // 4. Adjust credits based on collected payments and track subtracted amounts
        for (const payment of collectedPayments) {
            const { FarmerLocalId, AmountCollected, StationId } = payment;
            if (creditMap[StationId] && creditMap[StationId][FarmerLocalId]) {
                let remainingToSubtract = AmountCollected;
                // Subtract from the oldest credits first
                const creditsList = creditMap[StationId][FarmerLocalId].Credits;
                for (let i = 0; i < creditsList.length && remainingToSubtract > 0; i++) {
                    const credit = creditsList[i];
                    if (credit.TotalCredit > 0) {
                        const originalCredit = credit.TotalCredit; // Store original credit for subtraction tracking
                        if (credit.TotalCredit >= remainingToSubtract) {
                            credit.TotalCredit -= remainingToSubtract; // Subtract from TotalCredit
                            credit.AmountSubtracted += remainingToSubtract; // Record the amount subtracted
                            remainingToSubtract = 0; // All amount used up
                        }
                        else {
                            remainingToSubtract -= credit.TotalCredit; // Reduce the remaining amount
                            credit.AmountSubtracted += originalCredit; // Record the total amount that was available
                            credit.TotalCredit = 0; // All used up
                        }
                    }
                }
                // Track total amount subtracted for this FarmerLocalId
                creditMap[StationId][FarmerLocalId].AmountSubtracted += AmountCollected;
            }
        }
        // 5. Prepare the response
        const result = Object.entries(creditMap).map(([stationId, farmers]) => {
            return {
                StationId: stationId,
                Farmers: Object.entries(farmers).map(([farmerLocalId, data]) => ({
                    FarmerLocalId: farmerLocalId,
                    FarmerName: data.CustomerName, // Map CustomerName to FarmerName
                    MobileNumber: data.MobileNo, // Map MobileNo to MobileNumber
                    Village: data.VillageName,
                    Credits: data.Credits.filter(credit => credit.TotalCredit > 0), // Filter out zero credits
                    TotalCredit: data.Credits.reduce((total, credit) => total + credit.TotalCredit, 0) // Aggregate adjusted total credit
                })).filter(farmer => farmer.Credits.length > 0) // Ensure farmers with no credits are excluded
            };
        }).filter(station => station.Farmers.length > 0); // Ensure stations with no farmers are excluded
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error calculating farmer credits:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.calculateAgeFarmerCredits = calculateAgeFarmerCredits;
///With Deleting the Completed records 
const CalculateAgeFarmerByLocalId = async (req, res) => {
    try {
        const { FarmerLocalId } = req.body;
        if (!FarmerLocalId) {
            return res.status(400).send("FarmerLocalId is required.");
        }
        const specificStartDate = new Date('2024-07-06');
        // 1. Retrieve credits from SaleTransHeader
        const salesCreditsQuery = {
            Credit: { $ne: 0.0 },
            CreatedDate: { $gte: specificStartDate },
        };
        if (FarmerLocalId) {
            salesCreditsQuery.FarmerLocalId = FarmerLocalId;
        }
        const salesCredits = await SaleTransHeader_1.default.find(salesCreditsQuery);
        // 2. Prepare a map to accumulate credits
        const creditMap = {};
        for (const credit of salesCredits) {
            const { FarmerLocalId, Credit, TransactionType, InvoiceDate, CustomerName, PaymentDueDate, MobileNo, VillageName } = credit;
            if (!creditMap[FarmerLocalId]) {
                creditMap[FarmerLocalId] = {
                    Credits: [],
                    TotalCredit: 0,
                    AmountSubtracted: 0,
                    OpeningBalance: 0,
                    CustomerName,
                    MobileNo,
                    VillageName
                };
            }
            if (TransactionType === 0) {
                const ageInDays = Math.floor((Date.now() - new Date(InvoiceDate).getTime()) / (1000 * 3600 * 24));
                creditMap[FarmerLocalId].Credits.push({ TotalCredit: Credit, Age: ageInDays, InvoiceDate, PaymentDueDate, AmountSubtracted: 0 });
                creditMap[FarmerLocalId].TotalCredit += Credit;
            }
            else if (TransactionType === 1) {
                creditMap[FarmerLocalId].TotalCredit -= Credit;
            }
        }
        // 3. Retrieve CustCrOB record and update OpeningBalance
        const custCrOBRecord = await CustCrOB_1.default.findOne({ FarmerLocalId });
        if (custCrOBRecord) {
            const { OpeningCredit } = custCrOBRecord;
            if (creditMap[FarmerLocalId]) {
                creditMap[FarmerLocalId].OpeningBalance = OpeningCredit;
                creditMap[FarmerLocalId].TotalCredit += OpeningCredit;
            }
        }
        // 4. Retrieve payments from CustomerCreditsCollected
        const collectedPaymentsQuery = {};
        if (FarmerLocalId) {
            collectedPaymentsQuery.FarmerLocalId = FarmerLocalId;
        }
        const collectedPayments = await CustomerCreditsCollected_1.default.find(collectedPaymentsQuery);
        for (const payment of collectedPayments) {
            const { FarmerLocalId, AmountCollected } = payment;
            if (creditMap[FarmerLocalId]) {
                let remainingToSubtract = AmountCollected;
                // Subtract from OpeningBalance first
                if (creditMap[FarmerLocalId].OpeningBalance > 0) {
                    if (creditMap[FarmerLocalId].OpeningBalance >= remainingToSubtract) {
                        creditMap[FarmerLocalId].OpeningBalance -= remainingToSubtract;
                        remainingToSubtract = 0;
                    }
                    else {
                        remainingToSubtract -= creditMap[FarmerLocalId].OpeningBalance;
                        creditMap[FarmerLocalId].OpeningBalance = 0;
                    }
                }
                // Subtract from credits
                const creditsList = creditMap[FarmerLocalId].Credits;
                for (let i = 0; i < creditsList.length && remainingToSubtract > 0; i++) {
                    const credit = creditsList[i];
                    if (credit.TotalCredit > 0) {
                        const originalCredit = credit.TotalCredit;
                        if (credit.TotalCredit >= remainingToSubtract) {
                            credit.TotalCredit -= remainingToSubtract;
                            credit.AmountSubtracted += remainingToSubtract;
                            remainingToSubtract = 0;
                        }
                        else {
                            remainingToSubtract -= credit.TotalCredit;
                            credit.AmountSubtracted += originalCredit;
                            credit.TotalCredit = 0;
                        }
                    }
                }
                creditMap[FarmerLocalId].AmountSubtracted += AmountCollected;
            }
        }
        // 5. Prepare the response
        const result = Object.entries(creditMap).map(([farmerLocalId, data]) => ({
            FarmerLocalId: farmerLocalId,
            FarmerName: data.CustomerName,
            MobileNumber: data.MobileNo,
            Village: data.VillageName,
            OpeningBalance: data.OpeningBalance,
            Credits: data.Credits.filter(credit => credit.TotalCredit > 0),
            TotalCredit: data.Credits.reduce((total, credit) => total + credit.TotalCredit, data.OpeningBalance),
        })).filter(farmer => farmer.Credits.length > 0 || farmer.OpeningBalance > 0);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error calculating farmer credits:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.CalculateAgeFarmerByLocalId = CalculateAgeFarmerByLocalId;
const getPaymentDueDatesWithDates = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds } = req.body;
        // Validate request body
        if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds)) {
            return res.status(400).json({ error: "FromDate, ToDate, and a valid StationIds array are required." });
        }
        // Convert input dates to UTC format
        const fromDate = moment_1.default.utc(FromDate, "DD-MM-YYYY").startOf("day").toDate();
        const toDate = moment_1.default.utc(ToDate, "DD-MM-YYYY").endOf("day").toDate();
        console.log("Request Data:", { FromDate, ToDate, StationIds });
        console.log("Converted Dates:", { fromDate, toDate });
        // Aggregation Pipeline
        const distinctFarmers = await SaleTransHeader_1.default.aggregate([
            {
                $match: {
                    StationId: { $in: StationIds },
                    PaymentDueDate: { $ne: "" }, // Ensure non-empty PaymentDueDate
                    Credit: { $gt: 0 }
                }
            },
            {
                $addFields: {
                    PaymentDueDateConverted: {
                        $cond: {
                            if: { $regexMatch: { input: "$PaymentDueDate", regex: "^\\d{4}-\\d{2}-\\d{2}.*$" } },
                            then: { $toDate: "$PaymentDueDate" },
                            else: null
                        }
                    }
                }
            },
            {
                $match: {
                    PaymentDueDateConverted: { $ne: null, $gte: fromDate, $lte: toDate } // Ensure valid date range
                }
            },
            {
                $group: {
                    _id: {
                        FarmerLocalId: "$FarmerLocalId",
                        PaymentDueDate: "$PaymentDueDateConverted"
                    },
                    TotalCredit: { $sum: "$Credit" }
                }
            },
            {
                $group: {
                    _id: "$_id.FarmerLocalId",
                    Payments: {
                        $push: {
                            PaymentDueDate: "$_id.PaymentDueDate",
                            CreditAmount: "$TotalCredit"
                        }
                    }
                }
            },
            // {
            //     $project: {
            //         _id: 0,
            //         FarmerLocalId: "$_id",
            //         Payments: 1,
            //     }
            // }
            {
                $project: {
                    FarmerLocalId: "$_id", // Move `FarmerLocalId` first
                    Payments: 1,
                    _id: 0
                }
            }
        ]);
        // console.log("Query Result:", distinctFarmers); // Debugging output
        return res.status(200).json(distinctFarmers);
    }
    catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getPaymentDueDatesWithDates = getPaymentDueDatesWithDates;
///Without Deleting the Completed records
const GettingCreditsHistory = async (req, res) => {
    try {
        const { FarmerLocalId } = req.body;
        if (!FarmerLocalId) {
            return res.status(400).send("FarmerLocalId is required.");
        }
        const specificStartDate = new Date('2024-07-06');
        // 1. Retrieve credits from SaleTransHeader
        const salesCreditsQuery = {
            Credit: { $ne: 0.0 },
            CreatedDate: { $gte: specificStartDate },
        };
        if (FarmerLocalId) {
            salesCreditsQuery.FarmerLocalId = FarmerLocalId;
        }
        const salesCredits = await SaleTransHeader_1.default.find(salesCreditsQuery);
        // 2. Prepare a map to accumulate credits
        const creditMap = {};
        for (const credit of salesCredits) {
            const { FarmerLocalId, Credit, TransactionType, InvoiceDate, CustomerName, PaymentDueDate, MobileNo, VillageName } = credit;
            if (!creditMap[FarmerLocalId]) {
                creditMap[FarmerLocalId] = {
                    Credits: [],
                    TotalCredit: 0,
                    AmountSubtracted: 0,
                    OpeningBalance: 0,
                    CustomerName,
                    MobileNo,
                    VillageName
                };
            }
            if (TransactionType === 0) {
                const ageInDays = Math.floor((Date.now() - new Date(InvoiceDate).getTime()) / (1000 * 3600 * 24));
                creditMap[FarmerLocalId].Credits.push({ TotalCredit: Credit, Age: ageInDays, InvoiceDate, PaymentDueDate, AmountSubtracted: 0, Status: Credit > 0 ? "Pending" : "Settled"
                });
                creditMap[FarmerLocalId].TotalCredit += Credit;
            }
            else if (TransactionType === 1) {
                creditMap[FarmerLocalId].TotalCredit -= Credit;
            }
        }
        // 3. Retrieve CustCrOB record and update OpeningBalance
        const custCrOBRecord = await CustCrOB_1.default.findOne({ FarmerLocalId });
        if (custCrOBRecord) {
            const { OpeningCredit } = custCrOBRecord;
            if (creditMap[FarmerLocalId]) {
                creditMap[FarmerLocalId].OpeningBalance = OpeningCredit;
                creditMap[FarmerLocalId].TotalCredit += OpeningCredit;
            }
        }
        // 4. Retrieve payments from CustomerCreditsCollected
        const collectedPaymentsQuery = {};
        if (FarmerLocalId) {
            collectedPaymentsQuery.FarmerLocalId = FarmerLocalId;
        }
        const collectedPayments = await CustomerCreditsCollected_1.default.find(collectedPaymentsQuery);
        for (const payment of collectedPayments) {
            const { FarmerLocalId, AmountCollected } = payment;
            if (creditMap[FarmerLocalId]) {
                let remainingToSubtract = AmountCollected;
                // Subtract from OpeningBalance first
                if (creditMap[FarmerLocalId].OpeningBalance > 0) {
                    if (creditMap[FarmerLocalId].OpeningBalance >= remainingToSubtract) {
                        creditMap[FarmerLocalId].OpeningBalance -= remainingToSubtract;
                        remainingToSubtract = 0;
                    }
                    else {
                        remainingToSubtract -= creditMap[FarmerLocalId].OpeningBalance;
                        creditMap[FarmerLocalId].OpeningBalance = 0;
                    }
                }
                // Subtract from credits
                const creditsList = creditMap[FarmerLocalId].Credits;
                for (let i = 0; i < creditsList.length && remainingToSubtract > 0; i++) {
                    const credit = creditsList[i];
                    if (credit.TotalCredit > 0) {
                        const originalCredit = credit.TotalCredit;
                        if (credit.TotalCredit >= remainingToSubtract) {
                            credit.TotalCredit -= remainingToSubtract;
                            credit.AmountSubtracted += remainingToSubtract;
                            remainingToSubtract = 0;
                        }
                        else {
                            remainingToSubtract -= credit.TotalCredit;
                            credit.AmountSubtracted += originalCredit;
                            credit.TotalCredit = 0;
                        }
                        credit.Status = credit.TotalCredit > 0 ? "Pending" : "Settled"; // Update Status
                    }
                }
                creditMap[FarmerLocalId].AmountSubtracted += AmountCollected;
            }
        }
        // 5. Prepare the response
        const result = Object.entries(creditMap).map(([farmerLocalId, data]) => ({
            FarmerLocalId: farmerLocalId,
            FarmerName: data.CustomerName,
            MobileNumber: data.MobileNo,
            Village: data.VillageName,
            OpeningBalance: data.OpeningBalance,
            Credits: data.Credits.filter(credit => credit.TotalCredit > 0),
            TotalCredit: data.Credits.reduce((total, credit) => total + credit.TotalCredit, data.OpeningBalance),
        })).filter(farmer => farmer.Credits.length > 0 || farmer.OpeningBalance > 0);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error calculating farmer credits:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.GettingCreditsHistory = GettingCreditsHistory;
exports.default = router;
