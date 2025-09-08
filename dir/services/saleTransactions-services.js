"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayWiseSalesDataForStationsWise = exports.getSaleTransactionsReportsMonthWise = exports.getSaleTransactionsReportsMonthWiseExcpetioninJan2025 = exports.getSaleTransactionsReportsMonthWisefinal = exports.getSaleTransactionsVillageReports = exports.getSaleTransactionsVillageReports1 = exports.getSaleTransactionsReports = exports.getSaleTransactionsReportsJan2025 = exports.getSaleTransactionsReports2024Dec17 = exports.getSaleTransactionsReportsfinal = exports.getSaleTransactionsByFinancialYear = exports.getSaleTransactionsByFinancialYearfinal = exports.CustomerAnalysis = exports.getFinancialYearSalesData = exports.AveragesOnSaleTransactions = exports.SaleTransactionsWithDates = exports.getSaleTransactions = void 0;
const express_1 = __importDefault(require("express"));
const SaleTransactions_1 = __importDefault(require("../models/SaleTransactions"));
const moment_1 = __importDefault(require("moment"));
const logger_1 = __importDefault(require("../logger"));
const Stations_1 = __importDefault(require("../models/Stations"));
const FarmerRegistration_1 = __importDefault(require("../models/FarmerRegistration"));
const SaleTransHeader_1 = __importDefault(require("../models/SaleTransHeader"));
const router = express_1.default.Router();
const getSaleTransactions = async (req, res) => {
    try {
        const alldata = await SaleTransactions_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getSaleTransactions = getSaleTransactions;
const SaleTransactionsWithDates = async (req, res) => {
    const { FromDate, ToDate, StationIds } = req.body;
    try {
        // Input validation
        if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0) {
            res.status(400).send("FromDate, ToDate, and StationIds are required and must be non-empty arrays.");
            return;
        }
        // Parse and validate dates using Moment.js
        const fromDate = new Date(FromDate.split("-").reverse().join("-")); // Convert "dd-MM-yyyy" to "yyyy-MM-dd"
        const toDate = new Date(ToDate.split("-").reverse().join("-")); // Convert "dd-MM-yyyy" to "yyyy-MM-dd"
        // Check if the date parsing is valid
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
            return;
        }
        fromDate.setHours(0, 0, 0, 0);
        // Set the time for the toDate to the end of the day (23:59:59.999)
        toDate.setHours(23, 59, 59, 999);
        // Query for sale transactions
        const alldata = await SaleTransactions_1.default.find({
            InvoiceDate: {
                $gte: fromDate,
                $lte: toDate,
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
exports.SaleTransactionsWithDates = SaleTransactionsWithDates;
const AveragesOnSaleTransactions = async (req, res) => {
    const { FromDate, ToDate, StationIds, Org, MonthWise } = req.body;
    if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0 || Org === undefined) {
        return res.status(400).send("FromDate, ToDate, station IDs, and Org flag are required");
    }
    // const fromDate = moment(FromDate, "DD-MM-YYYY").startOf('day').toDate();
    // const toDate = moment(ToDate, "DD-MM-YYYY").endOf('day').toDate();
    // if (!fromDate || !toDate || isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    //     return res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
    // }
    const fromDate = new Date(FromDate.split("-").reverse().join("-")); // Convert "dd-MM-yyyy" to "yyyy-MM-dd"
    const toDate = new Date(ToDate.split("-").reverse().join("-")); // Convert "dd-MM-yyyy" to "yyyy-MM-dd"
    // Check if the date parsing is valid
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
        return;
    }
    fromDate.setHours(0, 0, 0, 0);
    // Set the time for the toDate to the end of the day (23:59:59.999)
    toDate.setHours(23, 59, 59, 999);
    if (Org === true) {
        try {
            const saleTransactions = await SaleTransactions_1.default.find({
                InvoiceDate: { $gte: fromDate, $lte: toDate }
            });
            let totalPriceSum = 0;
            const uniqueInvoiceNumbers = new Set();
            const totalUniqueFarmerLocalIds = new Set();
            const totalFarmerLocalIdCounts = {};
            const totalProductSegmentSum = {};
            const totalProductSegmentTransactionCount = {};
            const totalCustomerProductSegments = {};
            const totalMonthWiseUniqueCustomers = {};
            const customersBuyingOnlySeeds = [];
            const customersBuyingOnlyPesticide = [];
            const customersBuyingOnlyPGR = [];
            const customersBuyingOnlyFertilizers = [];
            const customersBuyingAllFourSegments = [];
            const customersBuyingThreeSegments = [];
            saleTransactions.forEach(transaction => {
                uniqueInvoiceNumbers.add(transaction.InvoiceNo);
                totalPriceSum += transaction.TotalPrice || 0;
                totalUniqueFarmerLocalIds.add(transaction.FarmerLocalId);
                totalFarmerLocalIdCounts[transaction.FarmerLocalId] = (totalFarmerLocalIdCounts[transaction.FarmerLocalId] || 0) + 1;
                totalProductSegmentSum[transaction.ProductSegment.en] = (totalProductSegmentSum[transaction.ProductSegment.en] || 0) + transaction.TotalPrice || 0;
                totalProductSegmentTransactionCount[transaction.ProductSegment.en] = (totalProductSegmentTransactionCount[transaction.ProductSegment.en] || 0) + 1;
                if (!totalCustomerProductSegments[transaction.FarmerLocalId]) {
                    totalCustomerProductSegments[transaction.FarmerLocalId] = new Set();
                }
                totalCustomerProductSegments[transaction.FarmerLocalId].add(transaction.ProductSegment.en);
                const transactionMonth = (0, moment_1.default)(transaction.InvoiceDate).format('YYYY-MM');
                if (!totalMonthWiseUniqueCustomers[transactionMonth]) {
                    totalMonthWiseUniqueCustomers[transactionMonth] = new Set();
                }
                totalMonthWiseUniqueCustomers[transactionMonth].add(transaction.FarmerLocalId);
            });
            const differenceInDays = (0, moment_1.default)(toDate).diff((0, moment_1.default)(fromDate), 'days');
            const totalInvoiceNumberCount = uniqueInvoiceNumbers.size;
            const averageTransactionValue = totalInvoiceNumberCount > 0 ? totalPriceSum / totalInvoiceNumberCount : 0;
            const averageTransactionsPerDay = differenceInDays > 0 ? totalInvoiceNumberCount / differenceInDays : totalInvoiceNumberCount;
            const averageBillValueByProductSegment = {};
            for (const segment in totalProductSegmentSum) {
                averageBillValueByProductSegment[segment] = totalProductSegmentTransactionCount[segment] > 0 ? totalProductSegmentSum[segment] / totalProductSegmentTransactionCount[segment] : 0;
            }
            for (const customerId in totalCustomerProductSegments) {
                const segments = totalCustomerProductSegments[customerId];
                if (segments.size === 1) {
                    if (segments.has("SEEDS"))
                        customersBuyingOnlySeeds.push(customerId);
                    else if (segments.has("PESTICIDE"))
                        customersBuyingOnlyPesticide.push(customerId);
                    else if (segments.has("PGR"))
                        customersBuyingOnlyPGR.push(customerId);
                    else if (segments.has("FERTILIZERS"))
                        customersBuyingOnlyFertilizers.push(customerId);
                }
                else if (segments.size === 4) {
                    customersBuyingAllFourSegments.push(customerId);
                }
                else if (segments.size === 3 && segments.has("SEEDS") && segments.has("FERTILIZERS") && segments.has("PESTICIDE")) {
                    customersBuyingThreeSegments.push(customerId);
                }
            }
            const fieldsToInclude = { StationId: 1, StationShortCode: 1, FarmerLocalId: 1, ReferralCode: 1,
                FarmerName: 1, FarmerId: 1, DataSource: 1, Mobile: 1, MobileNumber: 1,
                AadhaarNo: 1, TotalAcres: 1, Village: 1, VillageValue: 1, FirstPurchaseOn: 1,
                RecentPurchaseOn: 1, IsFieldVisited: 1, FirstFvOn: 1, RecentFvOn: 1, IsMobileAppUser: 1, MobileAppUserSince: 1, RecentCallOn: 1,
                TotalCredit: 1,
            };
            const SalesToInclude = { OutletLegalName: 1, InvoiceNo: 1, InvoiceDate: 1, CustomerName: 1, MobileNo: 1, VillageName: 1,
                ProductPack: 1, Qty: 1, Discount: 1, TotalPrice: 1, ProductCategoryName: 1, ProductSegment: 1, CompanyName: 1, CreatedBy: 1, CreatedDate: 1,
                FarmerLocalId: 1
            };
            const seedsFarmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: customersBuyingOnlySeeds } }, fieldsToInclude);
            const formattedSeedsFarmerDetails = seedsFarmerDetails.map(farmer => {
                const mobileNumber = farmer.MobileNumber || null;
                return {
                    StationId: farmer.StationId || null,
                    StationShortCode: farmer.StationShortCode || null,
                    FarmerLocalId: farmer.FarmerLocalId || null,
                    ReferralCode: farmer.ReferralCode || null,
                    FarmerName: farmer.FarmerName || null,
                    FarmerId: farmer.FarmerId || null,
                    DataSource: farmer.DataSource || null,
                    MobileNumber: mobileNumber,
                    AadhaarNo: farmer.AadhaarNo || null,
                    TotalAcres: farmer.TotalAcres || null,
                    Village: farmer.Village || null,
                    VillageValue: farmer.VillageValue || null,
                    FirstPurchaseOn: farmer.FirstPurchaseOn || null,
                    RecentPurchaseOn: farmer.RecentPurchaseOn || null,
                    FirstFvOn: farmer.FirstFvOn || null,
                    RecentFvOn: farmer.RecentFvOn || null,
                    IsFieldVisited: farmer.IsFieldVisited === true ? true : false,
                    IsMobileAppUser: farmer.IsMobileAppUser === true ? true : false,
                    RecentCallOn: farmer.RecentCallOn || null,
                    TotalCredit: farmer.TotalCredit || 0
                };
            });
            const pesticideFarmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: customersBuyingOnlyPesticide } }, fieldsToInclude);
            const formattedPesticideFarmerDetails = pesticideFarmerDetails.map(farmer => {
                const mobileNumber = farmer.MobileNumber || null;
                return {
                    StationId: farmer.StationId || null,
                    StationShortCode: farmer.StationShortCode || null,
                    FarmerLocalId: farmer.FarmerLocalId || null,
                    ReferralCode: farmer.ReferralCode || null,
                    FarmerName: farmer.FarmerName || null,
                    FarmerId: farmer.FarmerId || null,
                    DataSource: farmer.DataSource || null,
                    MobileNumber: mobileNumber,
                    AadhaarNo: farmer.AadhaarNo || null,
                    TotalAcres: farmer.TotalAcres || null,
                    Village: farmer.Village || null,
                    VillageValue: farmer.VillageValue || null,
                    FirstPurchaseOn: farmer.FirstPurchaseOn || null,
                    RecentPurchaseOn: farmer.RecentPurchaseOn || null,
                    FirstFvOn: farmer.FirstFvOn || null,
                    RecentFvOn: farmer.RecentFvOn || null,
                    IsFieldVisited: farmer.IsFieldVisited === true ? true : false,
                    IsMobileAppUser: farmer.IsMobileAppUser === true ? true : false,
                    MobileAppUserSince: farmer.MobileAppUserSince || null,
                    RecentCallOn: farmer.RecentCallOn || null,
                    TotalCredit: farmer.TotalCredit || 0
                };
            });
            const fertilizersFarmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: customersBuyingOnlyFertilizers } }, fieldsToInclude);
            const formattedFertilizersFarmerDetails = fertilizersFarmerDetails.map(farmer => {
                const mobileNumber = farmer.MobileNumber || null;
                return {
                    StationId: farmer.StationId || null,
                    StationShortCode: farmer.StationShortCode || null,
                    FarmerLocalId: farmer.FarmerLocalId || null,
                    ReferralCode: farmer.ReferralCode || null,
                    FarmerName: farmer.FarmerName || null,
                    FarmerId: farmer.FarmerId || null,
                    DataSource: farmer.DataSource || null,
                    MobileNumber: mobileNumber,
                    AadhaarNo: farmer.AadhaarNo || null,
                    TotalAcres: farmer.TotalAcres || null,
                    Village: farmer.Village || null,
                    VillageValue: farmer.VillageValue || null,
                    FirstPurchaseOn: farmer.FirstPurchaseOn || null,
                    RecentPurchaseOn: farmer.RecentPurchaseOn || null,
                    FirstFvOn: farmer.FirstFvOn || null,
                    RecentFvOn: farmer.RecentFvOn || null,
                    IsFieldVisited: farmer.IsFieldVisited === true ? true : false,
                    IsMobileAppUser: farmer.IsMobileAppUser === true ? true : false,
                    MobileAppUserSince: farmer.MobileAppUserSince || null,
                    RecentCallOn: farmer.RecentCallOn || null,
                    TotalCredit: farmer.TotalCredit || 0
                };
            });
            const pgrFarmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: customersBuyingOnlyPGR } }, fieldsToInclude);
            const formattedpgrFarmerDetails = pgrFarmerDetails.map(farmer => {
                const mobileNumber = farmer.MobileNumber || null;
                return {
                    StationId: farmer.StationId || null,
                    StationShortCode: farmer.StationShortCode || null,
                    FarmerLocalId: farmer.FarmerLocalId || null,
                    ReferralCode: farmer.ReferralCode || null,
                    FarmerName: farmer.FarmerName || null,
                    FarmerId: farmer.FarmerId || null,
                    DataSource: farmer.DataSource || null,
                    MobileNumber: mobileNumber,
                    AadhaarNo: farmer.AadhaarNo || null,
                    TotalAcres: farmer.TotalAcres || null,
                    Village: farmer.Village || null,
                    VillageValue: farmer.VillageValue || null,
                    FirstPurchaseOn: farmer.FirstPurchaseOn || null,
                    RecentPurchaseOn: farmer.RecentPurchaseOn || null,
                    FirstFvOn: farmer.FirstFvOn || null,
                    RecentFvOn: farmer.RecentFvOn || null,
                    IsFieldVisited: farmer.IsFieldVisited === true ? true : false,
                    IsMobileAppUser: farmer.IsMobileAppUser === true ? true : false,
                    MobileAppUserSince: farmer.MobileAppUserSince || null,
                    RecentCallOn: farmer.RecentCallOn || null,
                    TotalCredit: farmer.TotalCredit || 0
                };
            });
            const AllthreeFarmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: customersBuyingThreeSegments } }, fieldsToInclude);
            const formattedAllthreeFarmerDetails = AllthreeFarmerDetails.map(farmer => {
                const mobileNumber = farmer.MobileNumber || null;
                return {
                    StationId: farmer.StationId || null,
                    StationShortCode: farmer.StationShortCode || null,
                    FarmerLocalId: farmer.FarmerLocalId || null,
                    ReferralCode: farmer.ReferralCode || null,
                    FarmerName: farmer.FarmerName || null,
                    FarmerId: farmer.FarmerId || null,
                    DataSource: farmer.DataSource || null,
                    MobileNumber: mobileNumber,
                    AadhaarNo: farmer.AadhaarNo || null,
                    TotalAcres: farmer.TotalAcres || null,
                    Village: farmer.Village || null,
                    VillageValue: farmer.VillageValue || null,
                    FirstPurchaseOn: farmer.FirstPurchaseOn || null,
                    RecentPurchaseOn: farmer.RecentPurchaseOn || null,
                    FirstFvOn: farmer.FirstFvOn || null,
                    RecentFvOn: farmer.RecentFvOn || null,
                    IsFieldVisited: farmer.IsFieldVisited === true ? true : false,
                    IsMobileAppUser: farmer.IsMobileAppUser === true ? true : false,
                    MobileAppUserSince: farmer.MobileAppUserSince || null,
                    RecentCallOn: farmer.RecentCallOn || null,
                    TotalCredit: farmer.TotalCredit || 0
                };
            });
            const AllFourFarmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: customersBuyingAllFourSegments } }, fieldsToInclude);
            const formattedAllFourFarmerDetails = AllFourFarmerDetails.map(farmer => {
                const mobileNumber = farmer.MobileNumber || null;
                return {
                    StationId: farmer.StationId || null,
                    StationShortCode: farmer.StationShortCode || null,
                    FarmerLocalId: farmer.FarmerLocalId || null,
                    ReferralCode: farmer.ReferralCode || null,
                    FarmerName: farmer.FarmerName || null,
                    FarmerId: farmer.FarmerId || null,
                    DataSource: farmer.DataSource || null,
                    MobileNumber: mobileNumber,
                    AadhaarNo: farmer.AadhaarNo || null,
                    TotalAcres: farmer.TotalAcres || null,
                    Village: farmer.Village || null,
                    VillageValue: farmer.VillageValue || null,
                    FirstPurchaseOn: farmer.FirstPurchaseOn || null,
                    RecentPurchaseOn: farmer.RecentPurchaseOn || null,
                    FirstFvOn: farmer.FirstFvOn || null,
                    RecentFvOn: farmer.RecentFvOn || null,
                    IsFieldVisited: farmer.IsFieldVisited === true ? true : false,
                    IsMobileAppUser: farmer.IsMobileAppUser === true ? true : false,
                    MobileAppUserSince: farmer.MobileAppUserSince || null,
                    RecentCallOn: farmer.RecentCallOn || null,
                    TotalCredit: farmer.TotalCredit || 0
                };
            });
            // const seedsSaleDetails = await SaleTransactions.find({
            //     FarmerLocalId: { $in: customersBuyingOnlySeeds },
            //     TransactionType: 0,
            //     InvoiceDate: { $gte: fromDate, $lte: toDate },
            //     SalesToInclude
            // });
            const seedsSaleDetails = await SaleTransactions_1.default.find({
                FarmerLocalId: { $in: customersBuyingOnlySeeds },
                TransactionType: 0,
                InvoiceDate: { $gte: fromDate, $lte: toDate }
            }, SalesToInclude).exec();
            const formattedSeedsSaleDetails = seedsSaleDetails.map(farmer => {
                return {
                    OutletLegalName: farmer.OutletLegalName || null,
                    InvoiceNumber: farmer.InvoiceNo || null,
                    InvoiceDate: farmer.InvoiceDate || null,
                    CustomerName: farmer.CustomerName || null,
                    MobileNo: farmer.MobileNo || null,
                    VillageName: farmer.VillageName || null,
                    ProductPack: farmer.ProductPack || null,
                    Qty: farmer.Qty || null,
                    Discount: farmer.Discount || 0.0,
                    TotalPrice: farmer.TotalPrice || null,
                    ProductCategoryName: farmer.ProductCategoryName || null,
                    ProductSegment: farmer.ProductSegment || null,
                    CompanyName: farmer.CompanyName || null,
                    CreatedBy: farmer.CreatedBy || null,
                    CreatedDate: farmer.CreatedDate || null,
                    FarmerLocalId: farmer.FarmerLocalId || null
                };
            });
            const pesticideSaleDetails = await SaleTransactions_1.default.find({
                FarmerLocalId: { $in: customersBuyingOnlyPesticide },
                TransactionType: 0,
                InvoiceDate: { $gte: fromDate, $lte: toDate },
            }, SalesToInclude).exec();
            const formattedPesticidesSaleDetails = pesticideSaleDetails.map(farmer => {
                return {
                    OutletLegalName: farmer.OutletLegalName || null,
                    InvoiceNumber: farmer.InvoiceNo || null,
                    InvoiceDate: farmer.InvoiceDate || null,
                    CustomerName: farmer.CustomerName || null,
                    MobileNo: farmer.MobileNo || null,
                    VillageName: farmer.VillageName || null,
                    ProductPack: farmer.ProductPack || null,
                    Qty: farmer.Qty || null,
                    Discount: farmer.Discount || 0.0,
                    TotalPrice: farmer.TotalPrice || null,
                    ProductCategoryName: farmer.ProductCategoryName || null,
                    ProductSegment: farmer.ProductSegment || null,
                    CompanyName: farmer.CompanyName || null,
                    CreatedBy: farmer.CreatedBy || null,
                    CreatedDate: farmer.CreatedDate || null,
                    FarmerLocalId: farmer.FarmerLocalId || null
                };
            });
            const fertilizerSaleDetails = await SaleTransactions_1.default.find({
                FarmerLocalId: { $in: customersBuyingOnlyFertilizers },
                TransactionType: 0,
                InvoiceDate: { $gte: fromDate, $lte: toDate },
            }, SalesToInclude).exec();
            const formattedfertilizersSaleDetails = fertilizerSaleDetails.map(farmer => {
                return {
                    OutletLegalName: farmer.OutletLegalName || null,
                    InvoiceNumber: farmer.InvoiceNo || null,
                    InvoiceDate: farmer.InvoiceDate || null,
                    CustomerName: farmer.CustomerName || null,
                    MobileNo: farmer.MobileNo || null,
                    VillageName: farmer.VillageName || null,
                    ProductPack: farmer.ProductPack || null,
                    Qty: farmer.Qty || null,
                    Discount: farmer.Discount || 0.0,
                    TotalPrice: farmer.TotalPrice || null,
                    ProductCategoryName: farmer.ProductCategoryName || null,
                    ProductSegment: farmer.ProductSegment || null,
                    CompanyName: farmer.CompanyName || null,
                    CreatedBy: farmer.CreatedBy || null,
                    CreatedDate: farmer.CreatedDate || null,
                    FarmerLocalId: farmer.FarmerLocalId || null
                };
            });
            const pgrSaleDetails = await SaleTransactions_1.default.find({
                FarmerLocalId: { $in: customersBuyingOnlyPGR },
                TransactionType: 0,
                InvoiceDate: { $gte: fromDate, $lte: toDate },
            }, SalesToInclude).exec();
            const formattedpgrSaleDetails = pgrSaleDetails.map(farmer => {
                return {
                    OutletLegalName: farmer.OutletLegalName || null,
                    InvoiceNumber: farmer.InvoiceNo || null,
                    InvoiceDate: farmer.InvoiceDate || null,
                    CustomerName: farmer.CustomerName || null,
                    MobileNo: farmer.MobileNo || null,
                    VillageName: farmer.VillageName || null,
                    ProductPack: farmer.ProductPack || null,
                    Qty: farmer.Qty || null,
                    Discount: farmer.Discount || 0.0,
                    TotalPrice: farmer.TotalPrice || null,
                    ProductCategoryName: farmer.ProductCategoryName || null,
                    ProductSegment: farmer.ProductSegment || null,
                    CompanyName: farmer.CompanyName || null,
                    CreatedBy: farmer.CreatedBy || null,
                    CreatedDate: farmer.CreatedDate || null,
                    FarmerLocalId: farmer.FarmerLocalId || null
                };
            });
            const AllthreeSaleDetails = await SaleTransactions_1.default.find({
                FarmerLocalId: { $in: customersBuyingThreeSegments },
                TransactionType: 0,
                InvoiceDate: { $gte: fromDate, $lte: toDate },
            }, SalesToInclude).exec();
            const formattedAllthreeSaleDetails = AllthreeSaleDetails.map(farmer => {
                return {
                    OutletLegalName: farmer.OutletLegalName || null,
                    InvoiceNumber: farmer.InvoiceNo || null,
                    InvoiceDate: farmer.InvoiceDate || null,
                    CustomerName: farmer.CustomerName || null,
                    MobileNo: farmer.MobileNo || null,
                    VillageName: farmer.VillageName || null,
                    ProductPack: farmer.ProductPack || null,
                    Qty: farmer.Qty || null,
                    Discount: farmer.Discount || 0.0,
                    TotalPrice: farmer.TotalPrice || null,
                    ProductCategoryName: farmer.ProductCategoryName || null,
                    ProductSegment: farmer.ProductSegment || null,
                    CompanyName: farmer.CompanyName || null,
                    CreatedBy: farmer.CreatedBy || null,
                    CreatedDate: farmer.CreatedDate || null,
                    FarmerLocalId: farmer.FarmerLocalId || null
                };
            });
            const AllFourSaleDetails = await SaleTransactions_1.default.find({
                FarmerLocalId: { $in: customersBuyingAllFourSegments },
                TransactionType: 0,
                InvoiceDate: { $gte: fromDate, $lte: toDate },
            }, SalesToInclude).exec();
            const formattedAllFourSaleDetails = AllFourSaleDetails.map(farmer => {
                return {
                    OutletLegalName: farmer.OutletLegalName || null,
                    InvoiceNumber: farmer.InvoiceNo || null,
                    InvoiceDate: farmer.InvoiceDate || null,
                    CustomerName: farmer.CustomerName || null,
                    MobileNo: farmer.MobileNo || null,
                    VillageName: farmer.VillageName || null,
                    ProductPack: farmer.ProductPack || null,
                    Qty: farmer.Qty || null,
                    Discount: farmer.Discount || 0.0,
                    TotalPrice: farmer.TotalPrice || null,
                    ProductCategoryName: farmer.ProductCategoryName || null,
                    ProductSegment: farmer.ProductSegment || null,
                    CompanyName: farmer.CompanyName || null,
                    CreatedBy: farmer.CreatedBy || null,
                    CreatedDate: farmer.CreatedDate || null,
                    FarmerLocalId: farmer.FarmerLocalId || null
                };
            });
            const result = [{
                    InvoiceNumberCount: totalInvoiceNumberCount,
                    TotalPriceSum: totalPriceSum,
                    UniqueFarmersCount: totalUniqueFarmerLocalIds.size,
                    FarmerLocalIdCounts: totalFarmerLocalIdCounts,
                    AverageTransactionValue: averageTransactionValue,
                    AverageTransactionsPerDay: averageTransactionsPerDay,
                    ProductSegmentSum: totalProductSegmentSum,
                    ProductSegmentTransactionCount: totalProductSegmentTransactionCount,
                    AverageBillValueByProductSegment: averageBillValueByProductSegment,
                    CustomersBuyingOnlySeeds: customersBuyingOnlySeeds,
                    CustomersBuyingOnlyPesticide: customersBuyingOnlyPesticide,
                    CustomersBuyingOnlyPGR: customersBuyingOnlyPGR,
                    CustomersBuyingOnlyFertilizers: customersBuyingOnlyFertilizers,
                    CustomersBuyingAllFourSegments: customersBuyingAllFourSegments,
                    CustomersBuyingThreeSegments: customersBuyingThreeSegments,
                    MonthWiseUniqueCustomers: MonthWise ? formatMonthWiseUniqueCustomers(totalMonthWiseUniqueCustomers) : undefined,
                    SeedsFarmerDetails: formattedSeedsFarmerDetails,
                    SeedsSaleDetails: formattedSeedsSaleDetails,
                    PesticideFarmerDetails: formattedPesticideFarmerDetails,
                    PesticideSaleDetails: formattedPesticidesSaleDetails,
                    PGRFarmerDetails: formattedpgrFarmerDetails,
                    AllthreeFarmerDetails: formattedAllthreeFarmerDetails,
                    AllthreeSaleDetails: formattedAllthreeSaleDetails,
                    AllFourSaleDetails: formattedAllFourSaleDetails,
                    AllFourFarmerDetails: formattedAllFourFarmerDetails,
                    PGRSaleDetails: formattedpgrSaleDetails,
                    FertilizersFarmerDetails: formattedFertilizersFarmerDetails,
                    FertilizerSaleDetails: formattedfertilizersSaleDetails,
                }];
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).send("Internal Server Error");
        }
    }
    else if (Org === false) {
        try {
            const results = [];
            for (const stationId of StationIds) {
                const saleTransactions = await SaleTransactions_1.default.find({
                    StationId: stationId,
                    InvoiceDate: { $gte: fromDate, $lte: toDate }
                });
                const stationDetails = await Stations_1.default.findOne({ StationId: stationId });
                const outletLegalName = stationDetails ? stationDetails.OutletLegalName : "Unknown";
                let totalPriceSum = 0;
                const uniqueInvoiceNumbers = new Set();
                const totalUniqueFarmerLocalIds = new Set();
                const totalFarmerLocalIdCounts = {};
                const totalProductSegmentSum = {};
                const totalProductSegmentTransactionCount = {};
                const totalCustomerProductSegments = {};
                const totalMonthWiseUniqueCustomers = {};
                const customersBuyingOnlySeeds = [];
                const customersBuyingOnlyPesticide = [];
                const customersBuyingOnlyPGR = [];
                const customersBuyingOnlyFertilizers = [];
                const customersBuyingAllFourSegments = [];
                const customersBuyingThreeSegments = [];
                saleTransactions.forEach(transaction => {
                    uniqueInvoiceNumbers.add(transaction.InvoiceNo);
                    totalPriceSum += transaction.TotalPrice || 0;
                    totalUniqueFarmerLocalIds.add(transaction.FarmerLocalId);
                    totalFarmerLocalIdCounts[transaction.FarmerLocalId] = (totalFarmerLocalIdCounts[transaction.FarmerLocalId] || 0) + 1;
                    totalProductSegmentSum[transaction.ProductSegment.en] = (totalProductSegmentSum[transaction.ProductSegment.en] || 0) + transaction.TotalPrice || 0;
                    totalProductSegmentTransactionCount[transaction.ProductSegment.en] = (totalProductSegmentTransactionCount[transaction.ProductSegment.en] || 0) + 1;
                    if (!totalCustomerProductSegments[transaction.FarmerLocalId]) {
                        totalCustomerProductSegments[transaction.FarmerLocalId] = new Set();
                    }
                    totalCustomerProductSegments[transaction.FarmerLocalId].add(transaction.ProductSegment.en);
                    const transactionMonth = (0, moment_1.default)(transaction.InvoiceDate).format('YYYY-MM');
                    if (!totalMonthWiseUniqueCustomers[transactionMonth]) {
                        totalMonthWiseUniqueCustomers[transactionMonth] = new Set();
                    }
                    totalMonthWiseUniqueCustomers[transactionMonth].add(transaction.FarmerLocalId);
                });
                const differenceInDays = (0, moment_1.default)(toDate).diff((0, moment_1.default)(fromDate), 'days');
                const totalInvoiceNumberCount = uniqueInvoiceNumbers.size;
                const averageTransactionValue = totalInvoiceNumberCount > 0 ? totalPriceSum / totalInvoiceNumberCount : 0;
                const averageTransactionsPerDay = differenceInDays > 0 ? totalInvoiceNumberCount / differenceInDays : totalInvoiceNumberCount;
                const averageBillValueByProductSegment = {};
                for (const segment in totalProductSegmentSum) {
                    averageBillValueByProductSegment[segment] = totalProductSegmentTransactionCount[segment] > 0 ? totalProductSegmentSum[segment] / totalProductSegmentTransactionCount[segment] : 0;
                }
                for (const customerId in totalCustomerProductSegments) {
                    const segments = totalCustomerProductSegments[customerId];
                    if (segments.size === 1) {
                        if (segments.has("SEEDS"))
                            customersBuyingOnlySeeds.push(customerId);
                        else if (segments.has("PESTICIDE"))
                            customersBuyingOnlyPesticide.push(customerId);
                        else if (segments.has("PGR"))
                            customersBuyingOnlyPGR.push(customerId);
                        else if (segments.has("FERTILIZERS"))
                            customersBuyingOnlyFertilizers.push(customerId);
                    }
                    else if (segments.size === 4) {
                        customersBuyingAllFourSegments.push(customerId);
                    }
                    else if (segments.size === 3 && segments.has("SEEDS") && segments.has("FERTILIZERS") && segments.has("PESTICIDE")) {
                        customersBuyingThreeSegments.push(customerId);
                    }
                }
                const fieldsToInclude = { StationId: 1, StationShortCode: 1, FarmerLocalId: 1, ReferralCode: 1,
                    FarmerName: 1, FarmerId: 1, DataSource: 1, Mobile: 1, MobileNumber: 1,
                    AadhaarNo: 1, TotalAcres: 1, Village: 1, VillageValue: 1, FirstPurchaseOn: 1,
                    RecentPurchaseOn: 1, IsFieldVisited: 1, FirstFvOn: 1, RecentFvOn: 1, IsMobileAppUser: 1, MobileAppUserSince: 1, RecentCallOn: 1,
                    TotalCredit: 1,
                };
                const SalesToInclude = { OutletLegalName: 1, InvoiceNo: 1, InvoiceDate: 1, CustomerName: 1, MobileNo: 1, VillageName: 1,
                    ProductPack: 1, Qty: 1, Discount: 1, TotalPrice: 1, ProductCategoryName: 1, ProductSegment: 1, CompanyName: 1, CreatedBy: 1, CreatedDate: 1,
                    FarmerLocalId: 1
                };
                const seedsFarmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: customersBuyingOnlySeeds } }, fieldsToInclude);
                const formattedSeedsFarmerDetails = seedsFarmerDetails.map(farmer => {
                    const mobileNumber = farmer.MobileNumber || null;
                    return {
                        StationId: farmer.StationId || null,
                        StationShortCode: farmer.StationShortCode || null,
                        FarmerLocalId: farmer.FarmerLocalId || null,
                        ReferralCode: farmer.ReferralCode || null,
                        FarmerName: farmer.FarmerName || null,
                        FarmerId: farmer.FarmerId || null,
                        DataSource: farmer.DataSource || null,
                        MobileNumber: mobileNumber,
                        AadhaarNo: farmer.AadhaarNo || null,
                        TotalAcres: farmer.TotalAcres || null,
                        Village: farmer.Village || null,
                        VillageValue: farmer.VillageValue || null,
                        FirstPurchaseOn: farmer.FirstPurchaseOn || null,
                        RecentPurchaseOn: farmer.RecentPurchaseOn || null,
                        FirstFvOn: farmer.FirstFvOn || null,
                        RecentFvOn: farmer.RecentFvOn || null,
                        IsFieldVisited: farmer.IsFieldVisited === true ? true : false,
                        IsMobileAppUser: farmer.IsMobileAppUser === true ? true : false,
                        MobileAppUserSince: farmer.MobileAppUserSince || null,
                        RecentCallOn: farmer.RecentCallOn || null,
                        TotalCredit: farmer.TotalCredit || 0
                    };
                });
                const pesticideFarmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: customersBuyingOnlyPesticide } }, fieldsToInclude);
                const formattedPesticideFarmerDetails = pesticideFarmerDetails.map(farmer => {
                    const mobileNumber = farmer.MobileNumber || null;
                    return {
                        StationId: farmer.StationId || null,
                        StationShortCode: farmer.StationShortCode || null,
                        FarmerLocalId: farmer.FarmerLocalId || null,
                        ReferralCode: farmer.ReferralCode || null,
                        FarmerName: farmer.FarmerName || null,
                        FarmerId: farmer.FarmerId || null,
                        DataSource: farmer.DataSource || null,
                        MobileNumber: mobileNumber,
                        AadhaarNo: farmer.AadhaarNo || null,
                        TotalAcres: farmer.TotalAcres || null,
                        Village: farmer.Village || null,
                        VillageValue: farmer.VillageValue || null,
                        FirstPurchaseOn: farmer.FirstPurchaseOn || null,
                        RecentPurchaseOn: farmer.RecentPurchaseOn || null,
                        FirstFvOn: farmer.FirstFvOn || null,
                        RecentFvOn: farmer.RecentFvOn || null,
                        IsFieldVisited: farmer.IsFieldVisited === true ? true : false,
                        IsMobileAppUser: farmer.IsMobileAppUser === true ? true : false,
                        MobileAppUserSince: farmer.MobileAppUserSince || null,
                        RecentCallOn: farmer.RecentCallOn || null,
                        TotalCredit: farmer.TotalCredit || 0
                    };
                });
                const fertilizersFarmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: customersBuyingOnlyFertilizers } }, fieldsToInclude);
                const formattedFertilizersFarmerDetails = fertilizersFarmerDetails.map(farmer => {
                    const mobileNumber = farmer.MobileNumber || null;
                    return {
                        StationId: farmer.StationId || null,
                        StationShortCode: farmer.StationShortCode || null,
                        FarmerLocalId: farmer.FarmerLocalId || null,
                        ReferralCode: farmer.ReferralCode || null,
                        FarmerName: farmer.FarmerName || null,
                        FarmerId: farmer.FarmerId || null,
                        DataSource: farmer.DataSource || null,
                        MobileNumber: mobileNumber,
                        AadhaarNo: farmer.AadhaarNo || null,
                        TotalAcres: farmer.TotalAcres || null,
                        Village: farmer.Village || null,
                        VillageValue: farmer.VillageValue || null,
                        FirstPurchaseOn: farmer.FirstPurchaseOn || null,
                        RecentPurchaseOn: farmer.RecentPurchaseOn || null,
                        FirstFvOn: farmer.FirstFvOn || null,
                        RecentFvOn: farmer.RecentFvOn || null,
                        IsFieldVisited: farmer.IsFieldVisited === true ? true : false,
                        IsMobileAppUser: farmer.IsMobileAppUser === true ? true : false,
                        MobileAppUserSince: farmer.MobileAppUserSince || null,
                        RecentCallOn: farmer.RecentCallOn || null,
                        TotalCredit: farmer.TotalCredit || 0
                    };
                });
                const pgrFarmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: customersBuyingOnlyPGR } }, fieldsToInclude);
                const formattedpgrFarmerDetails = pgrFarmerDetails.map(farmer => {
                    const mobileNumber = farmer.MobileNumber || null;
                    return {
                        StationId: farmer.StationId || null,
                        StationShortCode: farmer.StationShortCode || null,
                        FarmerLocalId: farmer.FarmerLocalId || null,
                        ReferralCode: farmer.ReferralCode || null,
                        FarmerName: farmer.FarmerName || null,
                        FarmerId: farmer.FarmerId || null,
                        DataSource: farmer.DataSource || null,
                        MobileNumber: mobileNumber,
                        AadhaarNo: farmer.AadhaarNo || null,
                        TotalAcres: farmer.TotalAcres || null,
                        Village: farmer.Village || null,
                        VillageValue: farmer.VillageValue || null,
                        FirstPurchaseOn: farmer.FirstPurchaseOn || null,
                        RecentPurchaseOn: farmer.RecentPurchaseOn || null,
                        FirstFvOn: farmer.FirstFvOn || null,
                        RecentFvOn: farmer.RecentFvOn || null,
                        IsFieldVisited: farmer.IsFieldVisited === true ? true : false,
                        IsMobileAppUser: farmer.IsMobileAppUser === true ? true : false,
                        MobileAppUserSince: farmer.MobileAppUserSince || null,
                        RecentCallOn: farmer.RecentCallOn || null,
                        TotalCredit: farmer.TotalCredit || 0
                    };
                });
                const AllthreeFarmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: customersBuyingThreeSegments } }, fieldsToInclude);
                const formattedAllthreeFarmerDetails = AllthreeFarmerDetails.map(farmer => {
                    const mobileNumber = farmer.MobileNumber || null;
                    return {
                        StationId: farmer.StationId || null,
                        StationShortCode: farmer.StationShortCode || null,
                        FarmerLocalId: farmer.FarmerLocalId || null,
                        ReferralCode: farmer.ReferralCode || null,
                        FarmerName: farmer.FarmerName || null,
                        FarmerId: farmer.FarmerId || null,
                        DataSource: farmer.DataSource || null,
                        MobileNumber: mobileNumber,
                        AadhaarNo: farmer.AadhaarNo || null,
                        TotalAcres: farmer.TotalAcres || null,
                        Village: farmer.Village || null,
                        VillageValue: farmer.VillageValue || null,
                        FirstPurchaseOn: farmer.FirstPurchaseOn || null,
                        RecentPurchaseOn: farmer.RecentPurchaseOn || null,
                        FirstFvOn: farmer.FirstFvOn || null,
                        RecentFvOn: farmer.RecentFvOn || null,
                        IsFieldVisited: farmer.IsFieldVisited === true ? true : false,
                        IsMobileAppUser: farmer.IsMobileAppUser === true ? true : false,
                        MobileAppUserSince: farmer.MobileAppUserSince || null,
                        RecentCallOn: farmer.RecentCallOn || null,
                        TotalCredit: farmer.TotalCredit || 0
                    };
                });
                const AllFourFarmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: customersBuyingAllFourSegments } }, fieldsToInclude);
                const formattedAllFourFarmerDetails = AllFourFarmerDetails.map(farmer => {
                    const mobileNumber = farmer.MobileNumber || null;
                    return {
                        StationId: farmer.StationId || null,
                        StationShortCode: farmer.StationShortCode || null,
                        FarmerLocalId: farmer.FarmerLocalId || null,
                        ReferralCode: farmer.ReferralCode || null,
                        FarmerName: farmer.FarmerName || null,
                        FarmerId: farmer.FarmerId || null,
                        DataSource: farmer.DataSource || null,
                        MobileNumber: mobileNumber,
                        AadhaarNo: farmer.AadhaarNo || null,
                        TotalAcres: farmer.TotalAcres || null,
                        Village: farmer.Village || null,
                        VillageValue: farmer.VillageValue || null,
                        FirstPurchaseOn: farmer.FirstPurchaseOn || null,
                        RecentPurchaseOn: farmer.RecentPurchaseOn || null,
                        FirstFvOn: farmer.FirstFvOn || null,
                        RecentFvOn: farmer.RecentFvOn || null,
                        IsFieldVisited: farmer.IsFieldVisited === true ? true : false,
                        IsMobileAppUser: farmer.IsMobileAppUser === true ? true : false,
                        MobileAppUserSince: farmer.MobileAppUserSince || null,
                        RecentCallOn: farmer.RecentCallOn || null,
                        TotalCredit: farmer.TotalCredit || 0
                    };
                });
                // const seedsSaleDetails = await SaleTransactions.find({
                //     FarmerLocalId: { $in: customersBuyingOnlySeeds },
                //     TransactionType: 0,
                //     InvoiceDate: { $gte: fromDate, $lte: toDate }
                // });
                // const pesticideSaleDetails = await SaleTransactions.find({
                //     FarmerLocalId: { $in: customersBuyingOnlyPesticide },
                //     TransactionType: 0,
                //     InvoiceDate: { $gte: fromDate, $lte: toDate }
                // });
                // const fertilizerSaleDetails = await SaleTransactions.find({
                //     FarmerLocalId: { $in: customersBuyingOnlyFertilizers },
                //     TransactionType: 0,
                //     InvoiceDate: { $gte: fromDate, $lte: toDate }
                // });
                // const pgrSaleDetails = await SaleTransactions.find({
                //     FarmerLocalId: { $in: customersBuyingOnlyPGR },
                //     TransactionType: 0,
                //     InvoiceDate: { $gte: fromDate, $lte: toDate }
                // });
                // const AllthreeSaleDetails = await SaleTransactions.find({
                //     FarmerLocalId: { $in: customersBuyingThreeSegments },
                //     TransactionType: 0,
                //     InvoiceDate: { $gte: fromDate, $lte: toDate }
                // });
                // const AllFourSaleDetails = await SaleTransactions.find({
                //     FarmerLocalId: { $in: customersBuyingAllFourSegments },
                //     TransactionType: 0,
                //     InvoiceDate: { $gte: fromDate, $lte: toDate }
                // });
                const seedsSaleDetails = await SaleTransactions_1.default.find({
                    FarmerLocalId: { $in: customersBuyingOnlySeeds },
                    TransactionType: 0,
                    InvoiceDate: { $gte: fromDate, $lte: toDate }
                }, SalesToInclude).exec();
                const formattedSeedsSaleDetails = seedsSaleDetails.map(farmer => {
                    return {
                        OutletLegalName: farmer.OutletLegalName || null,
                        InvoiceNumber: farmer.InvoiceNo || null,
                        InvoiceDate: farmer.InvoiceDate || null,
                        CustomerName: farmer.CustomerName || null,
                        MobileNo: farmer.MobileNo || null,
                        VillageName: farmer.VillageName || null,
                        ProductPack: farmer.ProductPack || null,
                        Qty: farmer.Qty || null,
                        Discount: farmer.Discount || 0.0,
                        TotalPrice: farmer.TotalPrice || null,
                        ProductCategoryName: farmer.ProductCategoryName || null,
                        ProductSegment: farmer.ProductSegment || null,
                        CompanyName: farmer.CompanyName || null,
                        CreatedBy: farmer.CreatedBy || null,
                        CreatedDate: farmer.CreatedDate || null,
                        FarmerLocalId: farmer.FarmerLocalId || null
                    };
                });
                const pesticideSaleDetails = await SaleTransactions_1.default.find({
                    FarmerLocalId: { $in: customersBuyingOnlyPesticide },
                    TransactionType: 0,
                    InvoiceDate: { $gte: fromDate, $lte: toDate },
                }, SalesToInclude).exec();
                const formattedPesticidesSaleDetails = pesticideSaleDetails.map(farmer => {
                    return {
                        OutletLegalName: farmer.OutletLegalName || null,
                        InvoiceNumber: farmer.InvoiceNo || null,
                        InvoiceDate: farmer.InvoiceDate || null,
                        CustomerName: farmer.CustomerName || null,
                        MobileNo: farmer.MobileNo || null,
                        VillageName: farmer.VillageName || null,
                        ProductPack: farmer.ProductPack || null,
                        Qty: farmer.Qty || null,
                        Discount: farmer.Discount || 0.0,
                        TotalPrice: farmer.TotalPrice || null,
                        ProductCategoryName: farmer.ProductCategoryName || null,
                        ProductSegment: farmer.ProductSegment || null,
                        CompanyName: farmer.CompanyName || null,
                        CreatedBy: farmer.CreatedBy || null,
                        CreatedDate: farmer.CreatedDate || null,
                        FarmerLocalId: farmer.FarmerLocalId || null
                    };
                });
                const fertilizerSaleDetails = await SaleTransactions_1.default.find({
                    FarmerLocalId: { $in: customersBuyingOnlyFertilizers },
                    TransactionType: 0,
                    InvoiceDate: { $gte: fromDate, $lte: toDate },
                }, SalesToInclude).exec();
                const formattedfertilizersSaleDetails = fertilizerSaleDetails.map(farmer => {
                    return {
                        OutletLegalName: farmer.OutletLegalName || null,
                        InvoiceNumber: farmer.InvoiceNo || null,
                        InvoiceDate: farmer.InvoiceDate || null,
                        CustomerName: farmer.CustomerName || null,
                        MobileNo: farmer.MobileNo || null,
                        VillageName: farmer.VillageName || null,
                        ProductPack: farmer.ProductPack || null,
                        Qty: farmer.Qty || null,
                        Discount: farmer.Discount || 0.0,
                        TotalPrice: farmer.TotalPrice || null,
                        ProductCategoryName: farmer.ProductCategoryName || null,
                        ProductSegment: farmer.ProductSegment || null,
                        CompanyName: farmer.CompanyName || null,
                        CreatedBy: farmer.CreatedBy || null,
                        CreatedDate: farmer.CreatedDate || null,
                        FarmerLocalId: farmer.FarmerLocalId || null
                    };
                });
                const pgrSaleDetails = await SaleTransactions_1.default.find({
                    FarmerLocalId: { $in: customersBuyingOnlyPGR },
                    TransactionType: 0,
                    InvoiceDate: { $gte: fromDate, $lte: toDate },
                }, SalesToInclude).exec();
                const formattedpgrSaleDetails = pgrSaleDetails.map(farmer => {
                    return {
                        OutletLegalName: farmer.OutletLegalName || null,
                        InvoiceNumber: farmer.InvoiceNo || null,
                        InvoiceDate: farmer.InvoiceDate || null,
                        CustomerName: farmer.CustomerName || null,
                        MobileNo: farmer.MobileNo || null,
                        VillageName: farmer.VillageName || null,
                        ProductPack: farmer.ProductPack || null,
                        Qty: farmer.Qty || null,
                        Discount: farmer.Discount || 0.0,
                        TotalPrice: farmer.TotalPrice || null,
                        ProductCategoryName: farmer.ProductCategoryName || null,
                        ProductSegment: farmer.ProductSegment || null,
                        CompanyName: farmer.CompanyName || null,
                        CreatedBy: farmer.CreatedBy || null,
                        CreatedDate: farmer.CreatedDate || null,
                        FarmerLocalId: farmer.FarmerLocalId || null
                    };
                });
                const AllthreeSaleDetails = await SaleTransactions_1.default.find({
                    FarmerLocalId: { $in: customersBuyingThreeSegments },
                    TransactionType: 0,
                    InvoiceDate: { $gte: fromDate, $lte: toDate },
                }, SalesToInclude).exec();
                const formattedAllthreeSaleDetails = AllthreeSaleDetails.map(farmer => {
                    return {
                        OutletLegalName: farmer.OutletLegalName || null,
                        InvoiceNumber: farmer.InvoiceNo || null,
                        InvoiceDate: farmer.InvoiceDate || null,
                        CustomerName: farmer.CustomerName || null,
                        MobileNo: farmer.MobileNo || null,
                        VillageName: farmer.VillageName || null,
                        ProductPack: farmer.ProductPack || null,
                        Qty: farmer.Qty || null,
                        Discount: farmer.Discount || 0.0,
                        TotalPrice: farmer.TotalPrice || null,
                        ProductCategoryName: farmer.ProductCategoryName || null,
                        ProductSegment: farmer.ProductSegment || null,
                        CompanyName: farmer.CompanyName || null,
                        CreatedBy: farmer.CreatedBy || null,
                        CreatedDate: farmer.CreatedDate || null,
                        FarmerLocalId: farmer.FarmerLocalId || null
                    };
                });
                const AllFourSaleDetails = await SaleTransactions_1.default.find({
                    FarmerLocalId: { $in: customersBuyingAllFourSegments },
                    TransactionType: 0,
                    InvoiceDate: { $gte: fromDate, $lte: toDate },
                }, SalesToInclude).exec();
                const formattedAllFourSaleDetails = AllFourSaleDetails.map(farmer => {
                    return {
                        OutletLegalName: farmer.OutletLegalName || null,
                        InvoiceNumber: farmer.InvoiceNo || null,
                        InvoiceDate: farmer.InvoiceDate || null,
                        CustomerName: farmer.CustomerName || null,
                        MobileNo: farmer.MobileNo || null,
                        VillageName: farmer.VillageName || null,
                        ProductPack: farmer.ProductPack || null,
                        Qty: farmer.Qty || null,
                        Discount: farmer.Discount || 0.0,
                        TotalPrice: farmer.TotalPrice || null,
                        ProductCategoryName: farmer.ProductCategoryName || null,
                        ProductSegment: farmer.ProductSegment || null,
                        CompanyName: farmer.CompanyName || null,
                        CreatedBy: farmer.CreatedBy || null,
                        CreatedDate: farmer.CreatedDate || null,
                        FarmerLocalId: farmer.FarmerLocalId || null
                    };
                });
                results.push({
                    StationId: stationId,
                    OutletLegalName: outletLegalName,
                    InvoiceNumberCount: totalInvoiceNumberCount,
                    TotalPriceSum: totalPriceSum,
                    UniqueFarmersCount: totalUniqueFarmerLocalIds.size,
                    FarmerLocalIdCounts: totalFarmerLocalIdCounts,
                    AverageTransactionValue: averageTransactionValue,
                    AverageTransactionsPerDay: averageTransactionsPerDay,
                    ProductSegmentSum: totalProductSegmentSum,
                    ProductSegmentTransactionCount: totalProductSegmentTransactionCount,
                    AverageBillValueByProductSegment: averageBillValueByProductSegment,
                    CustomersBuyingOnlySeeds: customersBuyingOnlySeeds,
                    CustomersBuyingOnlyPesticide: customersBuyingOnlyPesticide,
                    CustomersBuyingOnlyPGR: customersBuyingOnlyPGR,
                    CustomersBuyingOnlyFertilizers: customersBuyingOnlyFertilizers,
                    CustomersBuyingAllFourSegments: customersBuyingAllFourSegments,
                    CustomersBuyingThreeSegments: customersBuyingThreeSegments,
                    MonthWiseUniqueCustomers: MonthWise ? formatMonthWiseUniqueCustomers(totalMonthWiseUniqueCustomers) : undefined,
                    SeedsFarmerDetails: formattedSeedsFarmerDetails,
                    SeedsSaleDetails: formattedSeedsSaleDetails,
                    PesticideFarmerDetails: formattedPesticideFarmerDetails,
                    PesticideSaleDetails: formattedPesticidesSaleDetails,
                    PGRFarmerDetails: formattedpgrFarmerDetails,
                    PGRSaleDetails: formattedpgrSaleDetails,
                    AllthreeFarmerDetails: formattedAllthreeFarmerDetails,
                    AllthreeSaleDetails: formattedAllthreeSaleDetails,
                    AllFourSaleDetails: formattedAllFourSaleDetails,
                    AllFourFarmerDetails: formattedAllFourFarmerDetails,
                    FertilizersFarmerDetails: formattedFertilizersFarmerDetails,
                    FertilizerSaleDetails: formattedfertilizersSaleDetails
                });
            }
            res.status(200).json(results);
        }
        catch (error) {
            res.status(500).send("Internal Server Error");
        }
    }
    else {
        res.status(400).send("Invalid Org flag");
    }
};
exports.AveragesOnSaleTransactions = AveragesOnSaleTransactions;
// Helper function to format month-wise unique customers
const formatMonthWiseUniqueCustomers = (data) => {
    const result = {};
    for (const [month, customerSet] of Object.entries(data)) {
        result[month] = customerSet.size;
    }
    return result;
};
const getFinancialYearSalesData = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds, Product, Org } = req.body;
        if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0 || Org === undefined || !Product) {
            return res.status(400).send("FromDate, ToDate, station IDs, Org flag, and Product are required");
        }
        const fromDate = (0, moment_1.default)(FromDate, "DD-MM-YYYY").startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, "DD-MM-YYYY").endOf('day').toDate();
        if (!fromDate || !toDate || isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
        }
        const saleTransactions = await SaleTransactions_1.default.find({
            InvoiceDate: { $gte: fromDate, $lte: toDate },
            StationId: { $in: StationIds },
            ProductPack: Product
        });
        if (Org) {
            const dateWiseData = {};
            saleTransactions.forEach(transaction => {
                const transactionDate = (0, moment_1.default)(transaction.InvoiceDate).format('YYYY-MM-DD');
                if (!dateWiseData[transactionDate]) {
                    dateWiseData[transactionDate] = {
                        UnitsSold: 0,
                        TotalPrice: 0,
                        UniqueFarmers: new Set()
                    };
                }
                dateWiseData[transactionDate].UnitsSold += transaction.Qty;
                dateWiseData[transactionDate].TotalPrice += transaction.TotalPrice;
                dateWiseData[transactionDate].UniqueFarmers.add(transaction.FarmerLocalId);
            });
            const result = Object.keys(dateWiseData).map(date => ({
                Date: date,
                UnitsSold: dateWiseData[date].UnitsSold,
                TotalPriceSum: dateWiseData[date].TotalPrice,
                UniqueFarmersCount: dateWiseData[date].UniqueFarmers.size,
                FarmerLocalIds: Array.from(dateWiseData[date].UniqueFarmers)
            }));
            res.status(200).json(result);
        }
        else {
            const stationWiseData = {};
            saleTransactions.forEach(transaction => {
                const stationId = transaction.StationId;
                if (!stationWiseData[stationId]) {
                    stationWiseData[stationId] = {
                        UnitsSold: 0,
                        TotalPrice: 0,
                        UniqueFarmers: new Set()
                    };
                }
                stationWiseData[stationId].UnitsSold += transaction.Qty;
                stationWiseData[stationId].TotalPrice += transaction.TotalPrice;
                stationWiseData[stationId].UniqueFarmers.add(transaction.FarmerLocalId);
            });
            const result = Object.keys(stationWiseData).map(stationId => ({
                StationId: stationId,
                UnitsSold: stationWiseData[stationId].UnitsSold,
                TotalPrice: stationWiseData[stationId].TotalPrice,
                UniqueFarmersCount: stationWiseData[stationId].UniqueFarmers.size,
                FarmerLocalIds: Array.from(stationWiseData[stationId].UniqueFarmers)
            }));
            res.status(200).json(result);
        }
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.getFinancialYearSalesData = getFinancialYearSalesData;
const CustomerAnalysis = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds, VillageAnalysis } = req.body;
        console.log("Received FromDate:", FromDate);
        console.log("Received ToDate:", ToDate);
        console.log("Received StationList:", StationIds);
        console.log("Received VillageAnalysis:", VillageAnalysis);
        if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send("FromDate, ToDate, and StationList are required");
        }
        const fromDate = (0, moment_1.default)(FromDate, "DD-MM-YYYY").startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, "DD-MM-YYYY").endOf('day').toDate();
        console.log("Parsed fromDate:", fromDate);
        console.log("Parsed toDate:", toDate);
        if (!fromDate || !toDate || isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
        }
        const saleTransactions = await SaleTransactions_1.default.find({
            InvoiceDate: { $gte: fromDate, $lte: toDate },
            StationId: { $in: StationIds }
        });
        console.log("SaleTransactions:", saleTransactions);
        if (VillageAnalysis) {
            const villageData = {};
            saleTransactions.forEach(transaction => {
                const customerId = transaction.CustomerId;
                if (!villageData[customerId]) {
                    villageData[customerId] = {
                        Village: transaction.VillageName,
                        CustomerID: transaction.CustomerId,
                        CustomerName: transaction.CustomerName,
                        InvoiceNumberCount: 0,
                        TotalBillValue: 0,
                        ProductSegmentSum: {},
                        ProductSegmentTransactionCount: {}
                    };
                }
                villageData[customerId].InvoiceNumberCount++;
                villageData[customerId].TotalBillValue += transaction.DiscountedBillValue;
                if (!villageData[customerId].ProductSegmentSum[transaction.ProductSegment.en]) {
                    villageData[customerId].ProductSegmentSum[transaction.ProductSegment.en] = 0;
                    villageData[customerId].ProductSegmentTransactionCount[transaction.ProductSegment.en] = 0;
                }
                villageData[customerId].ProductSegmentSum[transaction.ProductSegment.en] += transaction.DiscountedBillValue;
                villageData[customerId].ProductSegmentTransactionCount[transaction.ProductSegment.en]++;
            });
            const oneTimePurchaseCount = [];
            const twoTimePurchaseCount = [];
            const threeTimePurchaseCount = [];
            const moreThanThreeTimesPurchaseCount = [];
            const result = Object.values(villageData).map(data => {
                const averageBillValueByProductSegment = {};
                for (const segment in data.ProductSegmentSum) {
                    averageBillValueByProductSegment[segment] = data.ProductSegmentSum[segment] / data.ProductSegmentTransactionCount[segment];
                }
                if (data.InvoiceNumberCount === 1) {
                    oneTimePurchaseCount.push(data.CustomerID);
                }
                else if (data.InvoiceNumberCount === 2) {
                    twoTimePurchaseCount.push(data.CustomerID);
                }
                else if (data.InvoiceNumberCount === 3) {
                    threeTimePurchaseCount.push(data.CustomerID);
                }
                else if (data.InvoiceNumberCount > 3) {
                    moreThanThreeTimesPurchaseCount.push(data.CustomerID);
                }
                return {
                    Village: data.Village,
                    CustomerID: data.CustomerID,
                    CustomerName: data.CustomerName,
                    InvoiceNumberCount: data.InvoiceNumberCount,
                    AverageBillValueByProductSegment: averageBillValueByProductSegment,
                    OneTimePurchaseCount: oneTimePurchaseCount.length,
                    TwoTimePurchaseCount: twoTimePurchaseCount.length,
                    ThreeTimePurchaseCount: threeTimePurchaseCount.length,
                    MoreThanThreeTimesPurchaseCount: moreThanThreeTimesPurchaseCount.length
                };
            });
            console.log("Result:", result);
            res.status(200).json(result);
        }
        else {
            const customerData = {};
            saleTransactions.forEach(transaction => {
                const customerId = transaction.CustomerId;
                if (!customerData[customerId]) {
                    customerData[customerId] = {
                        StationId: transaction.StationId,
                        CustomerID: transaction.CustomerId,
                        CustomerName: transaction.CustomerName,
                        Village: transaction.VillageName,
                        InvoiceNumberCount: 0,
                        TotalBillValue: 0,
                        ProductSegmentSum: {},
                        ProductSegmentTransactionCount: {}
                    };
                }
                customerData[customerId].InvoiceNumberCount++;
                customerData[customerId].TotalBillValue += transaction.DiscountedBillValue;
                if (!customerData[customerId].ProductSegmentSum[transaction.ProductSegment.en]) {
                    customerData[customerId].ProductSegmentSum[transaction.ProductSegment.en] = 0;
                    customerData[customerId].ProductSegmentTransactionCount[transaction.ProductSegment.en] = 0;
                }
                customerData[customerId].ProductSegmentSum[transaction.ProductSegment.en] += transaction.DiscountedBillValue;
                customerData[customerId].ProductSegmentTransactionCount[transaction.ProductSegment.en]++;
            });
            const result = Object.values(customerData).map(data => {
                const averageBillValueByProductSegment = {};
                for (const segment in data.ProductSegmentSum) {
                    averageBillValueByProductSegment[segment] = data.ProductSegmentSum[segment] / data.ProductSegmentTransactionCount[segment];
                }
                return {
                    StationId: data.StationId,
                    CustomerID: data.CustomerID,
                    CustomerName: data.CustomerName,
                    Village: data.Village,
                    InvoiceNumberCount: data.InvoiceNumberCount,
                    AverageBillValueByProductSegment: averageBillValueByProductSegment
                };
            });
            console.log("Result:", result);
            res.status(200).json(result);
        }
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.CustomerAnalysis = CustomerAnalysis;
const getSaleTransactionsByFinancialYearfinal = async (req, res) => {
    try {
        const { FinancialYear } = req.params;
        if (!FinancialYear) {
            return res.status(400).send("FinancialYear is required");
        }
        const financialYearString = FinancialYear;
        const [startYear, endYear] = financialYearString.split('-').map(year => parseInt(year));
        const saleTransactions = await SaleTransactions_1.default.find({
            TransactionType: 0,
        }).lean();
        const filteredTransactions = saleTransactions.filter(transaction => {
            const transactionYear = (0, moment_1.default)(transaction.CreatedDate).year();
            return transactionYear === startYear || transactionYear === endYear;
        });
        const initializeFarmerTransaction = (transaction) => ({
            FarmerLocalId: transaction.FarmerLocalId,
            FarmerName: transaction.CustomerName || "",
            CustomerId: transaction.CustomerId,
            StationId: transaction.StationId,
            OutletLegalName: transaction.OutletLegalName,
            January: 0, February: 0, March: 0, April: 0, May: 0, June: 0,
            July: 0, August: 0, September: 0, October: 0, November: 0, December: 0,
            PGR: 0,
            PESTICIDES: 0,
            SEEDS: 0,
            FERTILIZERS: 0,
            RetailValue: 0,
            WholesaleValue: 0,
            TotalValue: 0
        });
        const farmerWiseTransactions = {};
        filteredTransactions.forEach(transaction => {
            const farmerLocalId = transaction.FarmerLocalId;
            if (!farmerWiseTransactions[farmerLocalId]) {
                farmerWiseTransactions[farmerLocalId] = initializeFarmerTransaction(transaction);
            }
            const target = farmerWiseTransactions[farmerLocalId];
            const month = (0, moment_1.default)(transaction.CreatedDate).format('MMMM');
            if (typeof target[month] === 'number') {
                target[month] = target[month] + transaction.TotalPrice;
            }
            switch (transaction.ProductSegment['en']) {
                case 'PGR':
                    target.PGR += transaction.TotalPrice;
                    break;
                case 'PESTICIDES':
                    target.PESTICIDES += transaction.TotalPrice;
                    break;
                case 'SEEDS':
                    target.SEEDS += transaction.TotalPrice;
                    break;
                case 'FERTILIZERS':
                    target.FERTILIZERS += transaction.TotalPrice;
                    break;
            }
        });
        const result = Object.values(farmerWiseTransactions).map(farmer => ({
            FarmerLocalId: farmer.FarmerLocalId || 0,
            FarmerName: farmer.FarmerName || 0,
            StationId: farmer.StationId || 0,
            CustomerId: farmer.CustomerId || 0,
            OutletLegalName: farmer.OutletLegalName || 0,
            January: farmer.January || 0,
            February: farmer.February || 0,
            March: farmer.March || 0,
            April: farmer.April || 0,
            May: farmer.May || 0,
            June: farmer.June || 0,
            July: farmer.July || 0,
            August: farmer.August || 0,
            September: farmer.September || 0,
            October: farmer.October || 0,
            November: farmer.November || 0,
            December: farmer.December || 0,
            // TotalValue: farmer.January + farmer.February + farmer.March + farmer.April + farmer.May + farmer.June + farmer.July + farmer.August + farmer.September + farmer.October + farmer.November + farmer.December || 0,
            PGR: farmer.PGR || 0,
            PESTICIDES: farmer.PESTICIDES || 0,
            SEEDS: farmer.SEEDS || 0,
            FERTILIZERS: farmer.FERTILIZERS || 0
        }));
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching sale transactions reports:", error);
        res.status(500).send("Internal server error");
    }
};
exports.getSaleTransactionsByFinancialYearfinal = getSaleTransactionsByFinancialYearfinal;
const getSaleTransactionsByFinancialYear = async (req, res) => {
    try {
        const { FinancialYear } = req.params;
        if (!FinancialYear) {
            return res.status(400).send("FinancialYear is required");
        }
        const financialYearString = FinancialYear;
        const [startYear, endYear] = financialYearString.split('-').map(year => parseInt(year));
        // Fetch transactions of both types (0 and 1)
        const saleTransactions = await SaleTransactions_1.default.find({
            TransactionType: { $in: [0, 1] },
        }).lean();
        const filteredTransactions = saleTransactions.filter(transaction => {
            const transactionYear = (0, moment_1.default)(transaction.CreatedDate).year();
            return transactionYear === startYear || transactionYear === endYear;
        });
        const initializeFarmerTransaction = (transaction) => ({
            FarmerLocalId: transaction.FarmerLocalId,
            FarmerName: transaction.CustomerName || "",
            CustomerId: transaction.CustomerId,
            StationId: transaction.StationId,
            OutletLegalName: transaction.OutletLegalName,
            //CustomerType :transaction.Customer.CustomerId,
            January: 0, February: 0, March: 0, April: 0, May: 0, June: 0,
            July: 0, August: 0, September: 0, October: 0, November: 0, December: 0,
            PGR: 0,
            PESTICIDES: 0,
            SEEDS: 0,
            FERTILIZERS: 0,
            RetailValue: 0,
            WholesaleValue: 0,
            TotalValue: 0
        });
        const farmerWiseTransactions = {};
        filteredTransactions.forEach(transaction => {
            const farmerLocalId = transaction.FarmerLocalId;
            if (!farmerWiseTransactions[farmerLocalId]) {
                farmerWiseTransactions[farmerLocalId] = initializeFarmerTransaction(transaction);
            }
            const target = farmerWiseTransactions[farmerLocalId];
            const month = (0, moment_1.default)(transaction.CreatedDate).format('MMMM');
            // Determine the operation based on TransactionType
            const transactionAmount = transaction.TransactionType === 0 ? transaction.TotalPrice : -transaction.TotalPrice;
            // Update the monthly total
            if (typeof target[month] === 'number') {
                target[month] += transactionAmount;
            }
            // Update product segment totals
            switch (transaction.ProductSegment['en']) {
                case 'PGR':
                    target.PGR += transactionAmount;
                    break;
                case 'PESTICIDES':
                    target.PESTICIDES += transactionAmount;
                    break;
                case 'SEEDS':
                    target.SEEDS += transactionAmount;
                    break;
                case 'FERTILIZERS':
                    target.FERTILIZERS += transactionAmount;
                    break;
            }
        });
        const result = Object.values(farmerWiseTransactions).map(farmer => ({
            FarmerLocalId: farmer.FarmerLocalId || 0,
            FarmerName: farmer.FarmerName || "",
            StationId: farmer.StationId || 0,
            CustomerId: farmer.CustomerId || 0,
            OutletLegalName: farmer.OutletLegalName || "",
            January: farmer.January || 0,
            February: farmer.February || 0,
            March: farmer.March || 0,
            April: farmer.April || 0,
            May: farmer.May || 0,
            June: farmer.June || 0,
            July: farmer.July || 0,
            August: farmer.August || 0,
            September: farmer.September || 0,
            October: farmer.October || 0,
            November: farmer.November || 0,
            December: farmer.December || 0,
            PGR: farmer.PGR || 0,
            PESTICIDES: farmer.PESTICIDES || 0,
            SEEDS: farmer.SEEDS || 0,
            FERTILIZERS: farmer.FERTILIZERS || 0,
            TotalValue: farmer.January + farmer.February + farmer.March + farmer.April + farmer.May + farmer.June + farmer.July + farmer.August + farmer.September + farmer.October + farmer.November + farmer.December || 0,
        }));
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching sale transactions reports:", error);
        res.status(500).send("Internal server error");
    }
};
exports.getSaleTransactionsByFinancialYear = getSaleTransactionsByFinancialYear;
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const getSaleTransactionsReportsfinal = async (req, res) => {
    logger_1.default.info('getSaleTransactionsReports called');
    try {
        const { FinancialYear, ListOfStationIds } = req.body;
        logger_1.default.info('Request body:', { FinancialYear, ListOfStationIds });
        if (!FinancialYear) {
            logger_1.default.warn('FinancialYear is required');
            return res.status(400).send("FinancialYear is required");
        }
        if (!ListOfStationIds || !Array.isArray(ListOfStationIds)) {
            logger_1.default.warn('ListOfStationIds is required and should be an array');
            return res.status(400).send("ListOfStationIds is required and should be an array");
        }
        const financialYearString = FinancialYear;
        const [startYear, endYear] = financialYearString.split('-').map(year => parseInt(year));
        logger_1.default.info('Parsed financial years:', { startYear, endYear });
        const saleTransactions = await SaleTransactions_1.default.find({
            TransactionType: 0,
            StationId: { $in: ListOfStationIds }
        }).lean();
        logger_1.default.info(`Fetched ${saleTransactions.length} sale transactions`);
        const filteredTransactions = saleTransactions.filter(transaction => {
            const transactionYear = (0, moment_1.default)(transaction.CreatedDate).year();
            return transactionYear === startYear || transactionYear === endYear;
        });
        logger_1.default.info(`Filtered transactions count: ${filteredTransactions.length}`);
        const initializeFarmerTransaction = (transaction) => ({
            FarmerLocalId: transaction.FarmerLocalId,
            FarmerName: transaction.CustomerName || "",
            CustomerId: transaction.CustomerId,
            StationId: transaction.StationId,
            OutletLegalName: transaction.OutletLegalName,
            January: 0, February: 0, March: 0, April: 0, May: 0, June: 0,
            July: 0, August: 0, September: 0, October: 0, November: 0, December: 0,
            WholesaleValue: 0,
            RetailValue: 0,
            TotalValue: 0,
            PGR: 0,
            PESTICIDES: 0,
            SEEDS: 0,
            FERTILIZERS: 0
        });
        const stationWiseTransactions = {};
        filteredTransactions.forEach(transaction => {
            const month = (0, moment_1.default)(transaction.CreatedDate).format('MMMM');
            const isWholesale = ["Institute", "Distributor", "Retailer"].includes(transaction.CustomerId);
            if (!stationWiseTransactions[transaction.StationId]) {
                stationWiseTransactions[transaction.StationId] = initializeFarmerTransaction(transaction);
                logger_1.default.debug(`Initialized transaction for StationId: ${transaction.StationId}`);
            }
            const target = stationWiseTransactions[transaction.StationId];
            if (typeof target[month] === 'number') {
                target[month] = target[month] + transaction.TotalPrice;
            }
            switch (transaction.ProductSegment['en']) {
                case 'PGR':
                    target.PGR += transaction.TotalPrice;
                    break;
                case 'PESTICIDES':
                    target.PESTICIDES += transaction.TotalPrice;
                    break;
                case 'SEEDS':
                    target.SEEDS += transaction.TotalPrice;
                    break;
                case 'FERTILIZERS':
                    target.FERTILIZERS += transaction.TotalPrice;
                    break;
            }
            if (isWholesale) {
                target.WholesaleValue += transaction.TotalPrice;
            }
            else {
                target.RetailValue += transaction.TotalPrice;
            }
            logger_1.default.debug(`Processed transaction: ${JSON.stringify(transaction)}`);
        });
        const result = Object.values(stationWiseTransactions).map(station => ({
            StationId: station.StationId,
            OutletLegalName: station.OutletLegalName,
            January: station.January,
            February: station.February,
            March: station.March,
            April: station.April,
            May: station.May,
            June: station.June,
            July: station.July,
            August: station.August,
            September: station.September,
            October: station.October,
            November: station.November,
            December: station.December,
            WholesaleValue: station.WholesaleValue,
            RetailValue: station.RetailValue,
            TotalValue: station.WholesaleValue + station.RetailValue,
            PGR: station.PGR,
            PESTICIDES: station.PESTICIDES,
            SEEDS: station.SEEDS,
            FERTILIZERS: station.FERTILIZERS
        }));
        logger_1.default.info('Generated sale transactions report successfully');
        res.status(200).json(result);
    }
    catch (error) {
        logger_1.default.error('Error fetching sale transactions reports:', error);
        res.status(500).send("Internal server error");
    }
};
exports.getSaleTransactionsReportsfinal = getSaleTransactionsReportsfinal;
const getSaleTransactionsReports2024Dec17 = async (req, res) => {
    logger_1.default.info('getSaleTransactionsReports called');
    try {
        const { FinancialYear, ListOfStationIds } = req.body;
        logger_1.default.info('Request body:', { FinancialYear, ListOfStationIds });
        if (!FinancialYear) {
            logger_1.default.warn('FinancialYear is required');
            return res.status(400).send("FinancialYear is required");
        }
        if (!ListOfStationIds || !Array.isArray(ListOfStationIds)) {
            logger_1.default.warn('ListOfStationIds is required and should be an array');
            return res.status(400).send("ListOfStationIds is required and should be an array");
        }
        const financialYearString = FinancialYear;
        const [startYear, endYear] = financialYearString.split('-').map(year => parseInt(year));
        logger_1.default.info('Parsed financial years:', { startYear, endYear });
        // Fetch transactions with TransactionType 0 and 1
        const saleTransactions = await SaleTransactions_1.default.find({
            TransactionType: { $in: [0, 1] },
            StationId: { $in: ListOfStationIds }
        }).lean();
        logger_1.default.info(`Fetched ${saleTransactions.length} sale transactions`);
        const filteredTransactions = saleTransactions.filter(transaction => {
            const transactionYear = (0, moment_1.default)(transaction.CreatedDate).year();
            return transactionYear === startYear || transactionYear === endYear;
        });
        logger_1.default.info(`Filtered transactions count: ${filteredTransactions.length}`);
        const initializeFarmerTransaction = (transaction) => ({
            FarmerLocalId: transaction.FarmerLocalId,
            FarmerName: transaction.CustomerName || "",
            CustomerId: transaction.CustomerId,
            StationId: transaction.StationId,
            OutletLegalName: transaction.OutletLegalName,
            January: 0, February: 0, March: 0, April: 0, May: 0, June: 0,
            July: 0, August: 0, September: 0, October: 0, November: 0, December: 0,
            WholesaleValue: 0,
            RetailValue: 0,
            TotalValue: 0,
            PGR: 0,
            PESTICIDES: 0,
            SEEDS: 0,
            FERTILIZERS: 0
        });
        const stationWiseTransactions = {};
        filteredTransactions.forEach(transaction => {
            const month = (0, moment_1.default)(transaction.CreatedDate).format('MMMM');
            const isWholesale = ["Institute", "Distributor", "Retailer"].includes(transaction.CustomerId);
            if (!stationWiseTransactions[transaction.StationId]) {
                stationWiseTransactions[transaction.StationId] = initializeFarmerTransaction(transaction);
                logger_1.default.debug(`Initialized transaction for StationId: ${transaction.StationId}`);
            }
            const target = stationWiseTransactions[transaction.StationId];
            // Adjust total price based on TransactionType
            if (transaction.TransactionType === 0) {
                // For TransactionType 0, add the total price
                if (typeof target[month] === 'number') {
                    target[month] += transaction.TotalPrice;
                }
            }
            else if (transaction.TransactionType === 1) {
                // For TransactionType 1, subtract the total price
                if (typeof target[month] === 'number') {
                    target[month] -= transaction.TotalPrice;
                }
            }
            switch (transaction.ProductSegment['en']) {
                case 'PGR':
                    target.PGR += transaction.TransactionType === 0 ? transaction.TotalPrice : -transaction.TotalPrice;
                    break;
                case 'PESTICIDES':
                    target.PESTICIDES += transaction.TransactionType === 0 ? transaction.TotalPrice : -transaction.TotalPrice;
                    break;
                case 'SEEDS':
                    target.SEEDS += transaction.TransactionType === 0 ? transaction.TotalPrice : -transaction.TotalPrice;
                    break;
                case 'FERTILIZERS':
                    target.FERTILIZERS += transaction.TransactionType === 0 ? transaction.TotalPrice : -transaction.TotalPrice;
                    break;
            }
            if (isWholesale) {
                target.WholesaleValue += transaction.TransactionType === 0 ? transaction.TotalPrice : -transaction.TotalPrice;
            }
            else {
                target.RetailValue += transaction.TransactionType === 0 ? transaction.TotalPrice : -transaction.TotalPrice;
            }
            logger_1.default.debug(`Processed transaction: ${JSON.stringify(transaction)}`);
        });
        const result = Object.values(stationWiseTransactions).map(station => ({
            StationId: station.StationId,
            OutletLegalName: station.OutletLegalName,
            January: station.January,
            February: station.February,
            March: station.March,
            April: station.April,
            May: station.May,
            June: station.June,
            July: station.July,
            August: station.August,
            September: station.September,
            October: station.October,
            November: station.November,
            December: station.December,
            WholesaleValue: station.WholesaleValue,
            RetailValue: station.RetailValue,
            TotalValue: station.WholesaleValue + station.RetailValue,
            PGR: station.PGR,
            PESTICIDES: station.PESTICIDES,
            SEEDS: station.SEEDS,
            FERTILIZERS: station.FERTILIZERS
        }));
        logger_1.default.info('Generated sale transactions report successfully');
        res.status(200).json(result);
    }
    catch (error) {
        logger_1.default.error('Error fetching sale transactions reports:', error);
        res.status(500).send("Internal server error");
    }
};
exports.getSaleTransactionsReports2024Dec17 = getSaleTransactionsReports2024Dec17;
const getSaleTransactionsReportsJan2025 = async (req, res) => {
    logger_1.default.info('getSaleTransactionsReports called');
    try {
        const { FinancialYear, ListOfStationIds } = req.body;
        logger_1.default.info('Request body:', { FinancialYear, ListOfStationIds });
        if (!FinancialYear) {
            logger_1.default.warn('FinancialYear is required');
            return res.status(400).send("FinancialYear is required");
        }
        if (!ListOfStationIds || !Array.isArray(ListOfStationIds)) {
            logger_1.default.warn('ListOfStationIds is required and should be an array');
            return res.status(400).send("ListOfStationIds is required and should be an array");
        }
        const financialYearString = FinancialYear;
        const [startYear, endYear] = financialYearString.split('-').map(year => parseInt(year));
        logger_1.default.info('Parsed financial years:', { startYear, endYear });
        const financialYearStart = (0, moment_1.default)(`${startYear}-04-01`, 'YYYY-MM-DD').startOf('day');
        const financialYearEnd = (0, moment_1.default)(`${endYear}-03-31`, 'YYYY-MM-DD').endOf('day');
        logger_1.default.info('Calculated financial year range:', { financialYearStart, financialYearEnd });
        // Fetch transactions with TransactionType 0 and 1
        const saleTransactions = await SaleTransactions_1.default.find({
            TransactionType: { $in: [0, 1] },
            StationId: { $in: ListOfStationIds }
        }).lean();
        logger_1.default.info(`Fetched ${saleTransactions.length} sale transactions`);
        const filteredTransactions = saleTransactions.filter(transaction => {
            const transactionYear = (0, moment_1.default)(transaction.CreatedDate).year();
            return transactionYear === startYear || transactionYear === endYear;
        });
        logger_1.default.info(`Filtered transactions count: ${filteredTransactions.length}`);
        const initializeFarmerTransaction = (transaction) => ({
            FarmerLocalId: transaction.FarmerLocalId,
            FarmerName: transaction.CustomerName || "",
            CustomerId: transaction.CustomerId,
            StationId: transaction.StationId,
            OutletLegalName: transaction.OutletLegalName,
            January: 0, February: 0, March: 0, April: 0, May: 0, June: 0,
            July: 0, August: 0, September: 0, October: 0, November: 0, December: 0,
            WholesaleValue: 0, // Initialized to 0
            RetailValue: 0, // Initialized to 0
            TotalValue: 0, // Initialized to 0
            PGR: 0,
            PESTICIDES: 0,
            SEEDS: 0,
            FERTILIZERS: 0
        });
        const stationWiseTransactions = {};
        filteredTransactions.forEach(transaction => {
            const month = (0, moment_1.default)(transaction.CreatedDate).format('MMMM');
            const isWholesale = ["Institute", "Distributor", "Retailer"].includes(transaction.CustomerId);
            if (!stationWiseTransactions[transaction.StationId]) {
                stationWiseTransactions[transaction.StationId] = initializeFarmerTransaction(transaction);
                logger_1.default.debug(`Initialized transaction for StationId: ${transaction.StationId}`);
            }
            const target = stationWiseTransactions[transaction.StationId];
            // Ensure TotalPrice is a valid number (default to 0 if invalid)
            const totalPrice = transaction.TotalPrice || 0;
            // Adjust total price based on TransactionType
            if (transaction.TransactionType === 0) {
                // For TransactionType 0, add the total price
                if (typeof target[month] === 'number') {
                    target[month] += totalPrice;
                }
            }
            else if (transaction.TransactionType === 1) {
                // For TransactionType 1, subtract the total price
                if (typeof target[month] === 'number') {
                    target[month] -= totalPrice;
                }
            }
            switch (transaction.ProductSegment['en']) {
                case 'PGR':
                    target.PGR += transaction.TransactionType === 0 ? totalPrice : -totalPrice;
                    break;
                case 'PESTICIDES':
                    target.PESTICIDES += transaction.TransactionType === 0 ? totalPrice : -totalPrice;
                    break;
                case 'SEEDS':
                    target.SEEDS += transaction.TransactionType === 0 ? totalPrice : -totalPrice;
                    break;
                case 'FERTILIZERS':
                    target.FERTILIZERS += transaction.TransactionType === 0 ? totalPrice : -totalPrice;
                    break;
            }
            if (isWholesale) {
                target.WholesaleValue += transaction.TransactionType === 0 ? totalPrice : -totalPrice;
            }
            else {
                target.RetailValue += transaction.TransactionType === 0 ? totalPrice : -totalPrice;
            }
            // Ensure no null values in RetailValue and TotalValue
            target.RetailValue = target.RetailValue || 0;
            target.TotalValue = target.WholesaleValue + target.RetailValue;
            logger_1.default.debug(`Processed transaction: ${JSON.stringify(transaction)}`);
        });
        const result = Object.values(stationWiseTransactions).map(station => ({
            StationId: station.StationId,
            OutletLegalName: station.OutletLegalName,
            January: station.January,
            February: station.February,
            March: station.March,
            April: station.April,
            May: station.May,
            June: station.June,
            July: station.July,
            August: station.August,
            September: station.September,
            October: station.October,
            November: station.November,
            December: station.December,
            WholesaleValue: station.WholesaleValue || 0, // Ensure WholesaleValue is not null
            RetailValue: station.RetailValue || 0, // Ensure RetailValue is not null
            TotalValue: station.TotalValue || 0, // Ensure TotalValue is not null
            PGR: station.PGR,
            PESTICIDES: station.PESTICIDES,
            SEEDS: station.SEEDS,
            FERTILIZERS: station.FERTILIZERS
        }));
        logger_1.default.info('Generated sale transactions report successfully');
        res.status(200).json(result);
    }
    catch (error) {
        logger_1.default.error('Error fetching sale transactions reports:', error);
        res.status(500).send("Internal server error");
    }
};
exports.getSaleTransactionsReportsJan2025 = getSaleTransactionsReportsJan2025;
const getSaleTransactionsReports = async (req, res) => {
    logger_1.default.info('getSaleTransactionsReports called');
    try {
        const { FinancialYear, ListOfStationIds } = req.body;
        logger_1.default.info('Request body:', { FinancialYear, ListOfStationIds });
        if (!FinancialYear) {
            logger_1.default.warn('FinancialYear is required');
            return res.status(400).send("FinancialYear is required");
        }
        if (!ListOfStationIds || !Array.isArray(ListOfStationIds)) {
            logger_1.default.warn('ListOfStationIds is required and should be an array');
            return res.status(400).send("ListOfStationIds is required and should be an array");
        }
        const financialYearString = FinancialYear;
        const [startYear, endYear] = financialYearString.split('-').map(year => parseInt(year));
        logger_1.default.info('Parsed financial years:', { startYear, endYear });
        // Calculate start and end dates of the financial year
        const financialYearStart = (0, moment_1.default)(`${startYear}-04-01`, 'YYYY-MM-DD').startOf('day');
        const financialYearEnd = (0, moment_1.default)(`${endYear}-03-31`, 'YYYY-MM-DD').endOf('day');
        logger_1.default.info('Calculated financial year range:', { financialYearStart, financialYearEnd });
        // Fetch transactions with TransactionType 0 and 1, and matching StationIds
        // const saleTransactions = await SaleTransactions.find({
        //     TransactionType: { $in: [0, 1] },
        //     StationId: { $in: ListOfStationIds }
        // }).lean();
        // logger.info(`Fetched ${saleTransactions.length} sale transactions`);
        // // Filter transactions based on the financial year
        // const filteredTransactions = saleTransactions.filter(transaction => {
        //     const transactionYear = moment(transaction.CreatedDate).year();
        //     return transactionYear === startYear || transactionYear === endYear;
        // });
        // logger.info(`Filtered transactions count: ${filteredTransactions.length}`);
        const saleTransactions = await SaleTransactions_1.default.find({
            StationId: { $in: ListOfStationIds },
            TransactionType: { $in: [0, 1] },
            CreatedDate: { $gte: financialYearStart.toDate(), $lte: financialYearEnd.toDate() }
        }).lean();
        logger_1.default.info(`Fetched ${saleTransactions.length} sale transactions`);
        // Initialize the FarmerTransaction structure
        const initializeFarmerTransaction = (transaction) => ({
            FarmerLocalId: transaction.FarmerLocalId,
            FarmerName: transaction.CustomerName || "",
            CustomerId: transaction.CustomerId,
            StationId: transaction.StationId,
            OutletLegalName: transaction.OutletLegalName,
            January: 0, February: 0, March: 0, April: 0, May: 0, June: 0,
            July: 0, August: 0, September: 0, October: 0, November: 0, December: 0,
            WholesaleValue: 0,
            RetailValue: 0,
            TotalValue: 0,
            PGR: 0,
            PESTICIDES: 0,
            SEEDS: 0,
            FERTILIZERS: 0
        });
        const stationWiseTransactions = {};
        // Process each filtered transaction
        saleTransactions.forEach(transaction => {
            const month = (0, moment_1.default)(transaction.CreatedDate).format('MMMM');
            const monthKey = month.charAt(0).toUpperCase() + month.slice(1); // Capitalize the first letter to match the field name
            const isWholesale = ["Institute", "Distributor", "Retailer"].includes(transaction.CustomerId);
            // Initialize station record if not already created
            if (!stationWiseTransactions[transaction.StationId]) {
                stationWiseTransactions[transaction.StationId] = initializeFarmerTransaction(transaction);
                logger_1.default.debug(`Initialized transaction for StationId: ${transaction.StationId}`);
            }
            const target = stationWiseTransactions[transaction.StationId];
            const totalPrice = transaction.TotalPrice || 0;
            if (transaction.TransactionType === 0) {
                if (typeof target[monthKey] === 'number')
                    target[monthKey] += totalPrice;
            }
            else if (transaction.TransactionType === 1) {
                if (typeof target[monthKey] === 'number')
                    target[monthKey] -= totalPrice;
            }
            // Update product segments (PGR, Pesticides, Seeds, Fertilizers)
            switch (transaction.ProductSegment?.['en']) {
                case 'PGR':
                    target.PGR += transaction.TransactionType === 0 ? totalPrice : -totalPrice;
                    break;
                case 'PESTICIDES':
                    target.PESTICIDES += transaction.TransactionType === 0 ? totalPrice : -totalPrice;
                    break;
                case 'SEEDS':
                    target.SEEDS += transaction.TransactionType === 0 ? totalPrice : -totalPrice;
                    break;
                case 'FERTILIZERS':
                    target.FERTILIZERS += transaction.TransactionType === 0 ? totalPrice : -totalPrice;
                    break;
                default:
                    break;
            }
            if (isWholesale) {
                target.WholesaleValue += transaction.TransactionType === 0 ? totalPrice : -totalPrice;
            }
            else {
                target.RetailValue += transaction.TransactionType === 0 ? totalPrice : -totalPrice;
            }
            target.RetailValue = target.RetailValue || 0;
            target.TotalValue = target.WholesaleValue + target.RetailValue;
            logger_1.default.debug(`Processed transaction: ${JSON.stringify(transaction)}`);
        });
        // Map the station-wise transaction data to the response format
        const result = Object.values(stationWiseTransactions).map(station => ({
            StationId: station.StationId,
            OutletLegalName: station.OutletLegalName,
            January: station.January,
            February: station.February,
            March: station.March,
            April: station.April,
            May: station.May,
            June: station.June,
            July: station.July,
            August: station.August,
            September: station.September,
            October: station.October,
            November: station.November,
            December: station.December,
            WholesaleValue: station.WholesaleValue || 0,
            RetailValue: station.RetailValue || 0,
            TotalValue: station.TotalValue || 0,
            PGR: station.PGR,
            PESTICIDES: station.PESTICIDES,
            SEEDS: station.SEEDS,
            FERTILIZERS: station.FERTILIZERS
        }));
        logger_1.default.info('Generated sale transactions report successfully');
        res.status(200).json(result);
    }
    catch (error) {
        logger_1.default.error('Error fetching sale transactions reports:', error);
        res.status(500).send("Internal server error");
    }
};
exports.getSaleTransactionsReports = getSaleTransactionsReports;
const getSaleTransactionsVillageReports1 = async (req, res) => {
    try {
        const { FinancialYear, ListOfStationIds } = req.body;
        // Validate input
        if (!FinancialYear || typeof FinancialYear !== 'string') {
            return res.status(400).send("FinancialYear is required as a string");
        }
        if (!ListOfStationIds || !Array.isArray(ListOfStationIds) || ListOfStationIds.length === 0) {
            return res.status(400).send("ListOfStationIds is required and should be a non-empty array");
        }
        // Parse financial year
        const [startYear, endYear] = FinancialYear.split('-').map(year => parseInt(year, 10));
        // Aggregate sale transactions
        const result = await SaleTransactions_1.default.aggregate([
            {
                $match: {
                    TransactionType: 0,
                    StationId: { $in: ListOfStationIds }
                }
            },
            {
                $group: {
                    _id: {
                        StationId: "$StationId",
                        VillageName: "$VillageName"
                    },
                    OutletLegalName: { $first: "$OutletLegalName" }, // Assuming OutletLegalName is the same for each station-village combo
                    NoOFFarmersCount: { $addToSet: "$FarmerLocalId" }, // Count unique farmers
                    January: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 1] }, "$TotalPrice", 0] } },
                    February: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 2] }, "$TotalPrice", 0] } },
                    March: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 3] }, "$TotalPrice", 0] } },
                    April: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 4] }, "$TotalPrice", 0] } },
                    May: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 5] }, "$TotalPrice", 0] } },
                    June: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 6] }, "$TotalPrice", 0] } },
                    July: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 7] }, "$TotalPrice", 0] } },
                    August: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 8] }, "$TotalPrice", 0] } },
                    September: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 9] }, "$TotalPrice", 0] } },
                    October: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 10] }, "$TotalPrice", 0] } },
                    November: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 11] }, "$TotalPrice", 0] } },
                    December: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 12] }, "$TotalPrice", 0] } },
                    WholesaleValue: { $sum: { $cond: [{ $in: ["$CustomerId", ["Institute", "Distributor", "Retailer"]] }, "$TotalPrice", 0] } },
                    RetailValue: { $sum: { $cond: [{ $in: ["$CustomerId", ["Retailer"]] }, "$TotalPrice", 0] } },
                    PGR: { $sum: { $cond: [{ $eq: ["$ProductSegment.en", "PGR"] }, "$TotalPrice", 0] } },
                    PESTICIDES: { $sum: { $cond: [{ $eq: ["$ProductSegment.en", "PESTICIDES"] }, "$TotalPrice", 0] } },
                    SEEDS: { $sum: { $cond: [{ $eq: ["$ProductSegment.en", "SEEDS"] }, "$TotalPrice", 0] } },
                    FERTILIZERS: { $sum: { $cond: [{ $eq: ["$ProductSegment.en", "FERTILIZERS"] }, "$TotalPrice", 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    StationId: "$_id.StationId",
                    VillageName: "$_id.VillageName",
                    OutletLegalName: 1,
                    NoOFFarmersCount: { $size: "$NoOFFarmersCount" },
                    January: 1,
                    February: 1,
                    March: 1,
                    April: 1,
                    May: 1,
                    June: 1,
                    July: 1,
                    August: 1,
                    September: 1,
                    October: 1,
                    November: 1,
                    December: 1,
                    // WholesaleValue: 1,
                    // RetailValue: 1,
                    TotalValue: { $sum: ["$", "$RetailValue"] },
                    PGR: 1,
                    PESTICIDES: 1,
                    SEEDS: 1,
                    FERTILIZERS: 1
                }
            }
        ]);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error fetching sale transactions reports:", error);
        res.status(500).send("Internal server error");
    }
};
exports.getSaleTransactionsVillageReports1 = getSaleTransactionsVillageReports1;
// ///Without Logs 
// export const getSaleTransactionsVillageReports = async (req: Request, res: Response) => {
//     try {
//         const { FinancialYear, ListOfStationIds } = req.body;
//         // Validate input
//         if (!FinancialYear || typeof FinancialYear !== 'string') {
//             return res.status(400).send("FinancialYear is required as a string");
//         }
//         if (!ListOfStationIds || !Array.isArray(ListOfStationIds) || ListOfStationIds.length === 0) {
//             return res.status(400).send("ListOfStationIds is required and should be a non-empty array");
//         }
//         // Parse financial year
//         const [startYear, endYear] = FinancialYear.split('-').map(year => parseInt(year, 10));
//         // Aggregate sale transactions
//         const result = await SaleTransactions.aggregate([
//             {
//                 $match: {
//                     TransactionType: 0,
//                     StationId: { $in: ListOfStationIds }
//                 }
//             },
//             {
//                 $group: {
//                     _id: {
//                         StationId: "$StationId",
//                         VillageName: "$VillageName"
//                     },
//                     OutletLegalName: { $first: "$OutletLegalName" }, // Assuming OutletLegalName is the same for each station-village combo
//                     NoOFFarmersCount: { $addToSet: "$FarmerLocalId" }, // Count unique farmers
//                     January: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 1] }, "$TotalPrice", 0] } },
//                     February: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 2] }, "$TotalPrice", 0] } },
//                     March: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 3] }, "$TotalPrice", 0] } },
//                     April: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 4] }, "$TotalPrice", 0] } },
//                     May: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 5] }, "$TotalPrice", 0] } },
//                     June: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 6] }, "$TotalPrice", 0] } },
//                     July: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 7] }, "$TotalPrice", 0] } },
//                     August: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 8] }, "$TotalPrice", 0] } },
//                     September: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 9] }, "$TotalPrice", 0] } },
//                     October: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 10] }, "$TotalPrice", 0] } },
//                     November: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 11] }, "$TotalPrice", 0] } },
//                     December: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 12] }, "$TotalPrice", 0] } },
//                     WholesaleValue: { $sum: { $cond: [{ $in: ["$CustomerId", ["Institute", "Distributor", "Retailer"]] }, "$TotalPrice", 0] } },
//                     RetailValue: { $sum: { $cond: [{ $in: ["$CustomerId", ["Retailer"]] }, "$TotalPrice", 0] } },
//                     PGR: { $sum: { $cond: [{ $eq: ["$ProductSegment.en", "PGR"] }, "$TotalPrice", 0] } },
//                     PESTICIDES: { $sum: { $cond: [{ $eq: ["$ProductSegment.en", "PESTICIDES"] }, "$TotalPrice", 0] } },
//                     SEEDS: { $sum: { $cond: [{ $eq: ["$ProductSegment.en", "SEEDS"] }, "$TotalPrice", 0] } },
//                     FERTILIZERS: { $sum: { $cond: [{ $eq: ["$ProductSegment.en", "FERTILIZERS"] }, "$TotalPrice", 0] } }
//                 }
//             },
//             {
//                 $addFields: {
//                     TotalValue: {
//                         $sum: [
//                             "$January", "$February", "$March",
//                             "$April", "$May", "$June",
//                             "$July", "$August", "$September",
//                             "$October", "$November", "$December"
//                         ]
//                     }
//                 }
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     StationId: "$_id.StationId",
//                     OutletLegalName: 1,
//                     VillageName: "$_id.VillageName",
//                     NoOFFarmersCount: { $size: "$NoOFFarmersCount" },
//                     January: 1,
//                     February: 1,
//                     March: 1,
//                     April: 1,
//                     May: 1,
//                     June: 1,
//                     July: 1,
//                     August: 1,
//                     September: 1,
//                     October: 1,
//                     November: 1,
//                     December: 1,
//                    // WholesaleValue: 1,
//                    // RetailValue: 1,
//                     TotalValue: 1, // Include the calculated TotalValue
//                     PGR: 1,
//                     PESTICIDES: 1,
//                     SEEDS: 1,
//                     FERTILIZERS: 1
//                 }
//             }
//         ]);
//         res.status(200).json(result);
//     } catch (error) {
//         console.error("Error fetching sale transactions reports:", error);
//         res.status(500).send("Internal server error");
//     }
// };
const getSaleTransactionsVillageReports = async (req, res) => {
    logger_1.default.info('getSaleTransactionsVillageReports called');
    try {
        const { FinancialYear, ListOfStationIds } = req.body;
        logger_1.default.info('Request body:', { FinancialYear, ListOfStationIds });
        // Validate input
        if (!FinancialYear || typeof FinancialYear !== 'string') {
            logger_1.default.warn('FinancialYear is required as a string');
            return res.status(400).send("FinancialYear is required as a string");
        }
        if (!ListOfStationIds || !Array.isArray(ListOfStationIds) || ListOfStationIds.length === 0) {
            logger_1.default.warn('ListOfStationIds is required and should be a non-empty array');
            return res.status(400).send("ListOfStationIds is required and should be a non-empty array");
        }
        // Parse financial year
        const [startYear, endYear] = FinancialYear.split('-').map(year => parseInt(year, 10));
        logger_1.default.info('Parsed financial years:', { startYear, endYear });
        // Aggregate sale transactions
        logger_1.default.info('Starting aggregation of sale transactions');
        const result = await SaleTransactions_1.default.aggregate([
            {
                $match: {
                    StationId: { $in: ListOfStationIds }
                }
            },
            {
                $group: {
                    _id: {
                        StationId: "$StationId",
                        VillageName: "$VillageName"
                    },
                    OutletLegalName: { $first: "$OutletLegalName" }, // Assuming OutletLegalName is the same for each station-village combo
                    NoOFFarmersCount: { $addToSet: "$FarmerLocalId" }, // Count unique farmers
                    January: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 1] }, { $cond: [{ $eq: ["$TransactionType", 0] }, "$TotalPrice", { $multiply: ["$TotalPrice", -1] }] }, 0] } },
                    February: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 2] }, { $cond: [{ $eq: ["$TransactionType", 0] }, "$TotalPrice", { $multiply: ["$TotalPrice", -1] }] }, 0] } },
                    March: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 3] }, { $cond: [{ $eq: ["$TransactionType", 0] }, "$TotalPrice", { $multiply: ["$TotalPrice", -1] }] }, 0] } },
                    April: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 4] }, { $cond: [{ $eq: ["$TransactionType", 0] }, "$TotalPrice", { $multiply: ["$TotalPrice", -1] }] }, 0] } },
                    May: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 5] }, { $cond: [{ $eq: ["$TransactionType", 0] }, "$TotalPrice", { $multiply: ["$TotalPrice", -1] }] }, 0] } },
                    June: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 6] }, { $cond: [{ $eq: ["$TransactionType", 0] }, "$TotalPrice", { $multiply: ["$TotalPrice", -1] }] }, 0] } },
                    July: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 7] }, { $cond: [{ $eq: ["$TransactionType", 0] }, "$TotalPrice", { $multiply: ["$TotalPrice", -1] }] }, 0] } },
                    August: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 8] }, { $cond: [{ $eq: ["$TransactionType", 0] }, "$TotalPrice", { $multiply: ["$TotalPrice", -1] }] }, 0] } },
                    September: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 9] }, { $cond: [{ $eq: ["$TransactionType", 0] }, "$TotalPrice", { $multiply: ["$TotalPrice", -1] }] }, 0] } },
                    October: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 10] }, { $cond: [{ $eq: ["$TransactionType", 0] }, "$TotalPrice", { $multiply: ["$TotalPrice", -1] }] }, 0] } },
                    November: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 11] }, { $cond: [{ $eq: ["$TransactionType", 0] }, "$TotalPrice", { $multiply: ["$TotalPrice", -1] }] }, 0] } },
                    December: { $sum: { $cond: [{ $eq: [{ $month: "$CreatedDate" }, 12] }, { $cond: [{ $eq: ["$TransactionType", 0] }, "$TotalPrice", { $multiply: ["$TotalPrice", -1] }] }, 0] } },
                    WholesaleValue: { $sum: { $cond: [{ $in: ["$CustomerId", ["Institute", "Distributor", "Retailer"]] }, "$TotalPrice", 0] } },
                    RetailValue: { $sum: { $cond: [{ $in: ["$CustomerId", ["Retailer"]] }, "$TotalPrice", 0] } },
                    PGR: { $sum: { $cond: [{ $eq: ["$ProductSegment.en", "PGR"] }, "$TotalPrice", 0] } },
                    PESTICIDES: { $sum: { $cond: [{ $eq: ["$ProductSegment.en", "PESTICIDES"] }, "$TotalPrice", 0] } },
                    SEEDS: { $sum: { $cond: [{ $eq: ["$ProductSegment.en", "SEEDS"] }, "$TotalPrice", 0] } },
                    FERTILIZERS: { $sum: { $cond: [{ $eq: ["$ProductSegment.en", "FERTILIZERS"] }, "$TotalPrice", 0] } }
                }
            },
            {
                $addFields: {
                    TotalValue: {
                        $sum: [
                            "$January", "$February", "$March",
                            "$April", "$May", "$June",
                            "$July", "$August", "$September",
                            "$October", "$November", "$December"
                        ]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    StationId: "$_id.StationId",
                    OutletLegalName: 1,
                    VillageName: "$_id.VillageName",
                    NoOFFarmersCount: { $size: "$NoOFFarmersCount" },
                    January: 1,
                    February: 1,
                    March: 1,
                    April: 1,
                    May: 1,
                    June: 1,
                    July: 1,
                    August: 1,
                    September: 1,
                    October: 1,
                    November: 1,
                    December: 1,
                    TotalValue: 1, // Include the calculated TotalValue
                    PGR: 1,
                    PESTICIDES: 1,
                    SEEDS: 1,
                    FERTILIZERS: 1
                }
            }
        ]);
        logger_1.default.info('Aggregation completed successfully');
        res.status(200).json(result);
    }
    catch (error) {
        logger_1.default.error('Error fetching sale transactions village reports:', error);
        res.status(500).send("Internal server error");
    }
};
exports.getSaleTransactionsVillageReports = getSaleTransactionsVillageReports;
// export const getSaleTransactionsReportsMonthWise1 = async (req: Request, res: Response) => {
//     try {
//         const { FinancialYear, ListOfStationIds } = req.body;
//         if (!FinancialYear) {
//             return res.status(400).send("FinancialYear is required");
//         }
//         if (!ListOfStationIds || !Array.isArray(ListOfStationIds)) {
//             return res.status(400).send("ListOfStationIds is required and should be an array");
//         }
//         const financialYearString = FinancialYear as string;
//         const [startYear, endYear] = financialYearString.split('-').map(year => parseInt(year));
//         const saleTransactions = await SaleTransactions.find({
//             TransactionType: 0,
//             StationId: { $in: ListOfStationIds }
//         }).lean();
//         const filteredTransactions = saleTransactions.filter(transaction => {
//             const transactionYear = moment(transaction.CreatedDate).year();
//             return transactionYear === startYear || transactionYear === endYear;
//         });
//         const monthWiseSummary = filteredTransactions.reduce((acc: Record<string, MonthlySummary>, transaction) => {
//             const month = moment(transaction.CreatedDate).format('MMMM');
//             const isWholesale = ["Institute", "Distributor", "Retailer"].includes(transaction.CustomerId);
//             if (!acc[month]) {
//                 acc[month] = {
//                     Month: month,
//                     TotalValue: 0,
//                     WholesaleValue: 0,
//                     WholeSaleFarmersCount: 0,
//                     RetailFarmersCount: 0,
//                     RetailValue: 0,
//                     PGR: 0,
//                     SEEDS: 0,
//                     PESTICIDES: 0,
//                     FERTILIZERS: 0
//                 };
//             }
//             const target = acc[month];
//             if (isWholesale) {
//                 target.WholesaleValue += transaction.TotalPrice;
//                 target.WholeSaleFarmersCount += 1;
//             } else {
//                 target.RetailValue += transaction.TotalPrice;
//                 target.RetailFarmersCount += 1;
//             }
//             switch (transaction.ProductSegment['en']) {
//                 case 'PGR':
//                     target.PGR += transaction.TotalPrice;
//                     break;
//                 case 'PESTICIDES':
//                     target.PESTICIDES += transaction.TotalPrice;
//                     break;
//                 case 'SEEDS':
//                     target.SEEDS += transaction.TotalPrice;
//                     break;
//                 case 'FERTILIZERS':
//                     target.FERTILIZERS += transaction.TotalPrice;
//                     break;
//             }
//             target.TotalValue += transaction.TotalPrice;
//             return acc;
//         }, {} as Record<string, MonthlySummary>);
//         const result = Object.values(monthWiseSummary);
//         return res.json(result);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error");
//     }
// };
////WithoutLog Code 
// export const getSaleTransactionsReportsMonthWise = async (req: Request, res: Response) => {
//     try {
//         const { FinancialYear, ListOfStationIds } = req.body;
//         if (!FinancialYear) {
//             return res.status(400).send("FinancialYear is required");
//         }
//         if (!ListOfStationIds || !Array.isArray(ListOfStationIds)) {
//             return res.status(400).send("ListOfStationIds is required and should be an array");
//         }
//         const financialYearString = FinancialYear as string;
//         const [startYear, endYear] = financialYearString.split('-').map(year => parseInt(year));
//         const saleTransactions = await SaleTransactions.find({
//             TransactionType: 0,
//             StationId: { $in: ListOfStationIds }
//         }).lean();
//         const filteredTransactions = saleTransactions.filter(transaction => {
//             const transactionYear = moment(transaction.CreatedDate).year();
//             return transactionYear === startYear || transactionYear === endYear;
//         });
//         const monthWiseSummary = filteredTransactions.reduce((acc: Record<string, MonthlySummary>, transaction) => {
//             const month = moment(transaction.CreatedDate).format('MMMM');
//             const isWholesale = ["Institute", "Distributor", "Retailer"].includes(transaction.CustomerId);
//             if (!acc[month]) {
//                 acc[month] = {
//                     Month: month,
//                     TotalValue: 0,
//                     WholesaleValue: 0,
//                     WholesaleFarmersCount: 0,
//                     RetailFarmersCount: 0,
//                     UniqueWholesaleFarmers: new Set<string>(),
//                     UniqueRetailFarmers: new Set<string>(),
//                     RetailValue: 0,
//                     PGR: 0,
//                     SEEDS: 0,
//                     PESTICIDES: 0,
//                     FERTILIZERS: 0
//                 };
//             }
//             const target = acc[month];
//             if (isWholesale) {
//                 target.WholesaleValue += transaction.TotalPrice;
//                 target.UniqueWholesaleFarmers.add(transaction.CustomerId);
//             } else {
//                 target.RetailValue += transaction.TotalPrice;
//                 target.UniqueRetailFarmers.add(transaction.CustomerId);
//             }
//             switch (transaction.ProductSegment['en']) {
//                 case 'PGR':
//                     target.PGR += transaction.TotalPrice;
//                     break;
//                 case 'PESTICIDES':
//                     target.PESTICIDES += transaction.TotalPrice;
//                     break;
//                 case 'SEEDS':
//                     target.SEEDS += transaction.TotalPrice;
//                     break;
//                 case 'FERTILIZERS':
//                     target.FERTILIZERS += transaction.TotalPrice;
//                     break;
//             }
//             target.TotalValue += transaction.TotalPrice;
//             return acc;
//         }, {} as Record<string, MonthlySummary>);
//         const result = Object.values(monthWiseSummary).map(summary => ({
//             ...summary,
//             WholesaleFarmersCount: summary.UniqueWholesaleFarmers.size,
//             RetailFarmersCount: summary.UniqueRetailFarmers.size
//         }));
//         return res.json(result);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error");
//     }
// };
const getSaleTransactionsReportsMonthWisefinal = async (req, res) => {
    logger_1.default.info('getSaleTransactionsReportsMonthWise called');
    try {
        const { FinancialYear, ListOfStationIds } = req.body;
        logger_1.default.info('Request body:', { FinancialYear, ListOfStationIds });
        if (!FinancialYear) {
            logger_1.default.warn('FinancialYear is required');
            return res.status(400).send("FinancialYear is required");
        }
        if (!ListOfStationIds || !Array.isArray(ListOfStationIds)) {
            logger_1.default.warn('ListOfStationIds is required and should be an array');
            return res.status(400).send("ListOfStationIds is required and should be an array");
        }
        const financialYearString = FinancialYear;
        const [startYear, endYear] = financialYearString.split('-').map(year => parseInt(year));
        logger_1.default.info('Parsed financial years:', { startYear, endYear });
        const saleTransactions = await SaleTransactions_1.default.find({
            TransactionType: 0,
            StationId: { $in: ListOfStationIds }
        }).lean();
        logger_1.default.info(`Fetched ${saleTransactions.length} sale transactions`);
        const filteredTransactions = saleTransactions.filter(transaction => {
            const transactionYear = (0, moment_1.default)(transaction.CreatedDate).year();
            return transactionYear === startYear || transactionYear === endYear;
        });
        logger_1.default.info(`Filtered transactions count: ${filteredTransactions.length}`);
        const monthWiseSummary = filteredTransactions.reduce((acc, transaction) => {
            const month = (0, moment_1.default)(transaction.CreatedDate).format('MMMM');
            const isWholesale = ["Institute", "Distributor", "Retailer"].includes(transaction.CustomerId);
            if (!acc[month]) {
                acc[month] = {
                    Month: month,
                    TotalValue: 0,
                    WholesaleValue: 0,
                    WholesaleFarmersCount: 0,
                    RetailFarmersCount: 0,
                    UniqueWholesaleFarmers: new Set(),
                    UniqueRetailFarmers: new Set(),
                    RetailValue: 0,
                    PGR: 0,
                    SEEDS: 0,
                    PESTICIDES: 0,
                    FERTILIZERS: 0
                };
                logger_1.default.debug(`Initialized summary for month: ${month}`);
            }
            const target = acc[month];
            if (isWholesale) {
                target.WholesaleValue += transaction.TotalPrice;
                target.UniqueWholesaleFarmers.add(transaction.CustomerId);
            }
            else {
                target.RetailValue += transaction.TotalPrice;
                target.UniqueRetailFarmers.add(transaction.CustomerId);
            }
            switch (transaction.ProductSegment['en']) {
                case 'PGR':
                    target.PGR += transaction.TotalPrice;
                    break;
                case 'PESTICIDES':
                    target.PESTICIDES += transaction.TotalPrice;
                    break;
                case 'SEEDS':
                    target.SEEDS += transaction.TotalPrice;
                    break;
                case 'FERTILIZERS':
                    target.FERTILIZERS += transaction.TotalPrice;
                    break;
            }
            target.TotalValue += transaction.TotalPrice;
            logger_1.default.debug(`Processed transaction: ${JSON.stringify(transaction)}`);
            return acc;
        }, {});
        const result = Object.values(monthWiseSummary).map(summary => ({
            ...summary,
            WholesaleFarmersCount: summary.UniqueWholesaleFarmers.size,
            RetailFarmersCount: summary.UniqueRetailFarmers.size
        }));
        logger_1.default.info('Generated month-wise summary successfully');
        return res.json(result);
    }
    catch (err) {
        logger_1.default.error('Error in getSaleTransactionsReportsMonthWise', err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getSaleTransactionsReportsMonthWisefinal = getSaleTransactionsReportsMonthWisefinal;
const getSaleTransactionsReportsMonthWiseExcpetioninJan2025 = async (req, res) => {
    logger_1.default.info('getSaleTransactionsReportsMonthWise called');
    try {
        const { FinancialYear, ListOfStationIds } = req.body;
        logger_1.default.info('Request body:', { FinancialYear, ListOfStationIds });
        if (!FinancialYear) {
            logger_1.default.warn('FinancialYear is required');
            return res.status(400).send("FinancialYear is required");
        }
        if (!ListOfStationIds || !Array.isArray(ListOfStationIds)) {
            logger_1.default.warn('ListOfStationIds is required and should be an array');
            return res.status(400).send("ListOfStationIds is required and should be an array");
        }
        const financialYearString = FinancialYear;
        const [startYear, endYear] = financialYearString.split('-').map(year => parseInt(year));
        logger_1.default.info('Parsed financial years:', { startYear, endYear });
        // Fetching both TransactionType 0 and 1
        const saleTransactions = await SaleTransactions_1.default.find({
            StationId: { $in: ListOfStationIds },
            TransactionType: { $in: [0, 1] } // Include both types
        }).lean();
        logger_1.default.info(`Fetched ${saleTransactions.length} sale transactions`);
        const filteredTransactions = saleTransactions.filter(transaction => {
            const transactionYear = (0, moment_1.default)(transaction.CreatedDate).year();
            return transactionYear === startYear || transactionYear === endYear;
        });
        logger_1.default.info(`Filtered transactions count: ${filteredTransactions.length}`);
        const monthWiseSummary = filteredTransactions.reduce((acc, transaction) => {
            const month = (0, moment_1.default)(transaction.CreatedDate).format('MMMM');
            const isWholesale = ["Institute", "Distributor", "Retailer"].includes(transaction.CustomerId);
            if (!acc[month]) {
                acc[month] = {
                    Month: month,
                    TotalValue: 0,
                    WholesaleValue: 0,
                    WholesaleFarmersCount: 0,
                    RetailFarmersCount: 0,
                    UniqueWholesaleFarmers: new Set(),
                    UniqueRetailFarmers: new Set(),
                    RetailValue: 0,
                    PGR: 0,
                    SEEDS: 0,
                    PESTICIDES: 0,
                    FERTILIZERS: 0
                };
                logger_1.default.debug(`Initialized summary for month: ${month}`);
            }
            const target = acc[month];
            // Adjust the totals based on TransactionType
            const transactionAmount = transaction.TotalPrice * (transaction.TransactionType === 0 ? 1 : -1);
            target.TotalValue += transactionAmount;
            if (isWholesale) {
                target.WholesaleValue += transactionAmount;
                if (transaction.TransactionType === 0) {
                    target.UniqueWholesaleFarmers.add(transaction.CustomerId);
                }
            }
            else {
                target.RetailValue += transactionAmount;
                if (transaction.TransactionType === 0) {
                    target.UniqueRetailFarmers.add(transaction.CustomerId);
                }
            }
            // Update product segment totals
            switch (transaction.ProductSegment['en']) {
                case 'PGR':
                    target.PGR += transactionAmount;
                    break;
                case 'PESTICIDES':
                    target.PESTICIDES += transactionAmount;
                    break;
                case 'SEEDS':
                    target.SEEDS += transactionAmount;
                    break;
                case 'FERTILIZERS':
                    target.FERTILIZERS += transactionAmount;
                    break;
            }
            logger_1.default.debug(`Processed transaction: ${JSON.stringify(transaction)}`);
            return acc;
        }, {});
        const result = Object.values(monthWiseSummary).map(summary => ({
            ...summary,
            WholesaleFarmersCount: summary.UniqueWholesaleFarmers.size,
            RetailFarmersCount: summary.UniqueRetailFarmers.size
        }));
        logger_1.default.info('Generated month-wise summary successfully');
        return res.json(result);
    }
    catch (err) {
        logger_1.default.error('Error in getSaleTransactionsReportsMonthWise', err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getSaleTransactionsReportsMonthWiseExcpetioninJan2025 = getSaleTransactionsReportsMonthWiseExcpetioninJan2025;
const getSaleTransactionsReportsMonthWise = async (req, res) => {
    logger_1.default.info('getSaleTransactionsReportsMonthWise called');
    try {
        const { FinancialYear, ListOfStationIds } = req.body;
        logger_1.default.info('Request body:', { FinancialYear, ListOfStationIds });
        if (!FinancialYear) {
            logger_1.default.warn('FinancialYear is required');
            return res.status(400).send("FinancialYear is required");
        }
        if (!ListOfStationIds || !Array.isArray(ListOfStationIds)) {
            logger_1.default.warn('ListOfStationIds is required and should be an array');
            return res.status(400).send("ListOfStationIds is required and should be an array");
        }
        const [startYear, endYear] = FinancialYear.split('-').map((year) => parseInt(year));
        logger_1.default.info('Parsed financial years:', { startYear, endYear });
        const financialYearStart = (0, moment_1.default)(`${startYear}-04-01`, 'YYYY-MM-DD').startOf('day');
        const financialYearEnd = (0, moment_1.default)(`${endYear}-03-31`, 'YYYY-MM-DD').endOf('day');
        logger_1.default.info('Calculated financial year range:', { financialYearStart, financialYearEnd });
        const saleTransactions = await SaleTransactions_1.default.find({
            StationId: { $in: ListOfStationIds },
            TransactionType: { $in: [0, 1] },
            CreatedDate: { $gte: financialYearStart.toDate(), $lte: financialYearEnd.toDate() }
        }).lean();
        logger_1.default.info(`Fetched ${saleTransactions.length} sale transactions`);
        const monthWiseSummary = saleTransactions.reduce((acc, transaction) => {
            const month = (0, moment_1.default)(transaction.CreatedDate).format('MMMM');
            const isWholesale = ["Institute", "Distributor", "Retailer"].includes(transaction.CustomerId);
            if (!acc[month]) {
                acc[month] = {
                    Month: month,
                    TotalValue: 0,
                    WholesaleValue: 0,
                    WholesaleFarmersCount: 0,
                    RetailFarmersCount: 0,
                    UniqueWholesaleFarmers: new Set(),
                    UniqueRetailFarmers: new Set(),
                    RetailValue: 0,
                    PGR: 0,
                    SEEDS: 0,
                    PESTICIDES: 0,
                    FERTILIZERS: 0
                };
                logger_1.default.debug(`Initialized summary for month: ${month}`);
            }
            const target = acc[month];
            const transactionAmount = transaction.TotalPrice * (transaction.TransactionType === 0 ? 1 : -1);
            target.TotalValue += transactionAmount;
            if (isWholesale) {
                target.WholesaleValue += transactionAmount;
                if (transaction.TransactionType === 0) {
                    target.UniqueWholesaleFarmers.add(transaction.CustomerId);
                }
            }
            else {
                target.RetailValue += transactionAmount;
                if (transaction.TransactionType === 0) {
                    target.UniqueRetailFarmers.add(transaction.CustomerId);
                }
            }
            switch (transaction.ProductSegment['en']) {
                case 'PGR':
                    target.PGR += transactionAmount;
                    break;
                case 'PESTICIDES':
                    target.PESTICIDES += transactionAmount;
                    break;
                case 'SEEDS':
                    target.SEEDS += transactionAmount;
                    break;
                case 'FERTILIZERS':
                    target.FERTILIZERS += transactionAmount;
                    break;
            }
            logger_1.default.debug(`Processed transaction for month: ${month}`);
            return acc;
        }, {});
        const result = Object.values(monthWiseSummary).map(summary => ({
            ...summary,
            WholesaleFarmersCount: summary.UniqueWholesaleFarmers.size,
            RetailFarmersCount: summary.UniqueRetailFarmers.size
        }));
        logger_1.default.info('Generated month-wise summary successfully');
        return res.json(result);
    }
    catch (err) {
        logger_1.default.error('Error in getSaleTransactionsReportsMonthWise', err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getSaleTransactionsReportsMonthWise = getSaleTransactionsReportsMonthWise;
// export const DayWiseSalesDataForStationsWise = async (req: Request, res: Response) => {
//     const { FromDate, ToDate, StationIds } = req.body;
//     try {
//         // Input validation
//         if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0) {
//             res.status(400).send("FromDate, ToDate, and StationIds are required and must be non-empty arrays.");
//             return;
//         }
//         // Parse and validate dates using Moment.js
//         const fromDate = moment(FromDate, "DD-MM-YYYY", true).startOf('day');
//         const toDate = moment(ToDate, "DD-MM-YYYY", true).endOf('day');
//         if (!fromDate.isValid() || !toDate.isValid()) {
//             res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
//             return;
//         }
//         // Query to find relevant sale transactions
//         const saleTransactions = await SaleTransactions.find({
//             InvoiceDate: {
//                 $gte: fromDate.toDate(),
//                 $lte: toDate.toDate(),
//             },
//             StationId: { $in: StationIds }
//         });
//         // Create a structure to hold day-wise station-wise totals
//         const result: Record<string, DayWiseStationData> = {};
//         saleTransactions.forEach((transaction) => {
//             const stationId = transaction.StationId;
//             const outletLegalName = transaction.OutletLegalName || "Unknown Station";
//             const invoiceDate = moment(transaction.InvoiceDate).format('DD-MM-YYYY');
//             // Create a unique key for each station and date
//             const key = `${stationId}_${invoiceDate}`;
//             // Initialize station and date in the result object if not present
//             if (!result[key]) {
//                 result[key] = {
//                     Date: invoiceDate,
//                     StationId: stationId,
//                     OutletLegalName: outletLegalName,
//                     TotalPrices: 0,
//                     TotalCash: 0,
//                     TotalCredit: 0,
//                     SaleReturnAmount: 0,
//                     TotalSaleWithoutReturn: 0,
//                     TotalCashWithoutReturn: 0
//                 };
//             }
//             // Update totals based on TransactionType
//             if (transaction.TransactionType === 0) {
//                 // Regular sales (TransactionType 0)
//                 result[key].TotalPrices += transaction.TotalPrice;
//                 result[key].TotalCash += transaction.Cash;
//                 result[key].TotalCredit += transaction.Credit || 0;
//                 // Total sales and cash without subtracting returns
//                 result[key].TotalSaleWithoutReturn += transaction.TotalPrice;
//                 result[key].TotalCashWithoutReturn += transaction.TotalPrice;
//             } else if (transaction.TransactionType === 1) {
//                 // Sales returns (TransactionType 1)
//                 result[key].TotalPrices -= transaction.TotalPrice; // Subtracting for TransactionType 1
//                 result[key].TotalCash -= transaction.Cash;
//                 result[key].TotalCredit -= transaction.Credit || 0;
//                 // Record the sale return amount
//                 result[key].SaleReturnAmount += transaction.TotalPrice;
//             }
//         });
//         // Prepare final response
//         const responseArray = Object.values(result).map((data: DayWiseStationData) => ({
//             Date: data.Date,
//             StationId: data.StationId,
//             OutletLegalName: data.OutletLegalName,
//             Cash: data.TotalCash,
//             Credit: data.TotalCredit,
//             TotalSale: data.TotalPrices,
//             SaleReturnAmount: data.SaleReturnAmount,
//             TotalSalePrice: data.TotalSaleWithoutReturn,
//             TotalCashPrice: data.TotalCashWithoutReturn
//         }));
//         res.json(responseArray);
//     } catch (error) {
//         console.error("Error in DayWiseSalesDataForStationsWise:", error);
//         res.status(500).send("Internal Server Error");
//     }
// };
// export const DayWiseSalesDataForStationsWise = async (req: Request, res: Response) => {
//     const { FromDate, ToDate, StationIds } = req.body;
//     try {
//         // Input validation
//         if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0) {
//             res.status(400).send("FromDate, ToDate, and StationIds are required and must be non-empty arrays.");
//             return;
//         }
//         // Parse and validate dates using Moment.js
//         const fromDate = moment(FromDate, "DD-MM-YYYY", true).startOf('day');
//         const toDate = moment(ToDate, "DD-MM-YYYY", true).endOf('day');
//         if (!fromDate.isValid() || !toDate.isValid()) {
//             res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
//             return;
//         }
//         // Query to find relevant sale transactions
//         const saleTransHeader = await SaleTransHeader.find({
//             InvoiceDate: {
//                 $gte: fromDate.toDate(),
//                 $lte: toDate.toDate(),
//             },
//             StationId: { $in: StationIds }
//         });
//         // Create a structure to hold day-wise station-wise totals
//         const result: Record<string, DayWiseStationData> = {};
//         saleTransHeader.forEach((transaction) => {
//             const stationId = transaction.StationId;
//             const outletLegalName = transaction.OutletLegalName || "Unknown Station";
//             const invoiceDate = moment(transaction.InvoiceDate).format('DD-MM-YYYY');
//             // Create a unique key for each station and date
//             const key = `${stationId}_${invoiceDate}`;
//             // Initialize station and date in the result object if not present
//             if (!result[key]) {
//                 result[key] = {
//                     Date: invoiceDate,
//                     StationId: stationId,
//                     OutletLegalName: outletLegalName,
//                     TotalPrices: 0,
//                     TotalCash: 0,
//                     TotalCredit: 0,
//                     SaleReturnAmount: 0,
//                     TotalSaleWithoutReturn: 0,
//                     TotalCashWithoutReturn: 0
//                 };
//             }
//             // Update totals based on TransactionType
//             if (transaction.TransactionType === 0) {
//                 // Regular sales (TransactionType 0)
//                 result[key].TotalPrices += transaction.DiscountedBillValue ||0;
//                 result[key].TotalCash += (transaction.Cash || 0) + (transaction.Upi || 0) + (transaction.Card || 0);
//                 result[key].TotalCredit += (transaction.Credit || 0);
//                 // Total sales and cash without subtracting returns
//                 result[key].TotalSaleWithoutReturn += transaction.DiscountedBillValue ||0;
//                 result[key].TotalCashWithoutReturn += (transaction.Cash || 0) + (transaction.Upi || 0) + (transaction.Card || 0);
//             } else if (transaction.TransactionType === 1) {
//                 // Sales returns (TransactionType 1)
//                 result[key].TotalPrices -= transaction.DiscountedBillValue ||0; // Subtracting for TransactionType 1
//                 result[key].TotalCash -= (transaction.Cash || 0) + (transaction.Upi || 0) + (transaction.Card || 0);
//                 result[key].TotalCredit -= (transaction.Credit || 0);
//                 // Record the sale return amount
//                 result[key].SaleReturnAmount += transaction.DiscountedBillValue ||0;
//             }
//         });
//         // Prepare final response
//         const responseArray = Object.values(result).map((data: DayWiseStationData) => ({
//             Date: data.Date,
//             StationId: data.StationId,
//             OutletLegalName: data.OutletLegalName,
//             Cash: data.TotalCash,
//             Credit: data.TotalCredit,
//             TotalSale: data.TotalPrices,
//             SaleReturnAmount: data.SaleReturnAmount,
//             TotalSalePrice: data.TotalSaleWithoutReturn,
//             TotalCashPrice: data.TotalCashWithoutReturn
//         }));
//         res.json(responseArray);
//     } catch (error) {
//         console.error("Error in DayWiseSalesDataForStationsWise:", error);
//         res.status(500).send("Internal Server Error");
//     }
// };
const DayWiseSalesDataForStationsWise = async (req, res) => {
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
        // Query to find relevant sale transactions
        const saleTransHeader = await SaleTransHeader_1.default.find({
            InvoiceDate: {
                $gte: fromDate.toDate(),
                $lte: toDate.toDate(),
            },
            StationId: { $in: StationIds }
        });
        // Create a structure to hold day-wise station-wise totals
        const result = {};
        saleTransHeader.forEach((transaction) => {
            const stationId = transaction.StationId;
            const outletLegalName = transaction.OutletLegalName || "Unknown Station";
            const invoiceDate = (0, moment_1.default)(transaction.InvoiceDate).format('DD-MM-YYYY');
            // Create a unique key for each station and date
            const key = `${stationId}_${invoiceDate}`;
            // Initialize station and date in the result object if not present
            if (!result[key]) {
                result[key] = {
                    Date: invoiceDate,
                    StationId: stationId,
                    OutletLegalName: outletLegalName,
                    TotalPrices: 0,
                    TotalCash: 0,
                    TotalCredit: 0,
                    SaleReturnAmount: 0,
                    TotalSaleWithoutReturn: 0,
                    TotalCashWithoutReturn: 0
                };
            }
            // Update totals based on TransactionType
            if (transaction.TransactionType === 0) {
                // Regular sales (TransactionType 0)
                result[key].TotalPrices += transaction.DiscountedBillValue || 0;
                result[key].TotalCash += (transaction.Cash || 0) + (transaction.Upi || 0) + (transaction.Card || 0);
                result[key].TotalCredit += (transaction.Credit || 0);
                // Total sales and cash without subtracting returns
                result[key].TotalSaleWithoutReturn += transaction.DiscountedBillValue || 0;
                result[key].TotalCashWithoutReturn += (transaction.Cash || 0) + (transaction.Upi || 0) + (transaction.Card || 0);
            }
            else if (transaction.TransactionType === 1) {
                // Sales returns (TransactionType 1)
                result[key].TotalPrices -= transaction.DiscountedBillValue || 0; // Subtracting for TransactionType 1
                result[key].TotalCash -= (transaction.Cash || 0) + (transaction.Upi || 0) + (transaction.Card || 0);
                result[key].TotalCredit -= (transaction.Credit || 0);
                // Record the sale return amount
                result[key].SaleReturnAmount += transaction.DiscountedBillValue || 0;
            }
        });
        // Prepare final response
        const responseArray = Object.values(result).map((data) => ({
            Date: data.Date,
            StationId: data.StationId,
            OutletLegalName: data.OutletLegalName,
            Cash: data.TotalCash,
            Credit: data.TotalCredit,
            TotalSale: data.TotalPrices,
            SaleReturnAmount: data.SaleReturnAmount,
            TotalSalePrice: data.TotalSaleWithoutReturn,
            TotalCashPrice: data.TotalCashWithoutReturn
        }));
        res.json(responseArray);
    }
    catch (error) {
        console.error("Error in DayWiseSalesDataForStationsWise:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.DayWiseSalesDataForStationsWise = DayWiseSalesDataForStationsWise;
exports.default = router;
