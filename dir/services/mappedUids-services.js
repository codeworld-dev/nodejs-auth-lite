"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAnalysis = exports.SaleVelocity = exports.SaleVelocityFinal = exports.SaleVelocity1 = exports.NumberAPI = exports.CurentInventory = exports.mappedUidsReport = exports.mappedUidsReport30Jan = exports.getMappedUids = void 0;
const express_1 = __importDefault(require("express"));
const MappedUids_1 = __importDefault(require("../models/MappedUids"));
const SaleTransHeader_1 = __importDefault(require("../models/SaleTransHeader"));
const SaleTransactions_1 = __importDefault(require("../models/SaleTransactions"));
const moment_1 = __importDefault(require("moment"));
const Stations_1 = __importDefault(require("../models/Stations"));
const router = express_1.default.Router();
const getMappedUids = async (req, res) => {
    try {
        const alldata = await MappedUids_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getMappedUids = getMappedUids;
// export const mappedUidsReport = async (req: Request, res: Response) => {
//     try {
//         const { FinancialYear, StationIds, Org } = req.body;
//         console.log("Received FinancialYear:", FinancialYear);
//         console.log("Received StationIds:", StationIds);
//         if (!FinancialYear || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0) {
//             return res.status(400).send("Financial year and station IDs are required");
//         }
//         const result: any[] = []; 
//        // const targetProductPack = "13:00:45 FG IMP-1 Kg";
//         if (Org==true) {
//             const mappedUid = await MappedUids.find({
//                 FinancialYear,
//                 StationId: { $in: StationIds }
//             });
//             mappedUid.forEach(record => {
//                 const productPack = record.ProductPack;
//                 if (!productPack) {
//                     return;
//                 }
//                 let existingObject = result.find(item => item.ProductPack === productPack);
//                 if (!existingObject) {
//                     existingObject = {
//                         ProductPack: productPack,
//                         Purchase: 0,
//                         Liquidated: 0,
//                         Inventory: 0,
//                         ProductId: record.ProductId,
//                         HSNCode: record.HSNCode,
//                         ProductSegment: record.ProductSegment,
//                         CompanyName : record.CompanyName,
//                         ProductCategory : record.ProductCategoryName,
//                         MoleculeName : record.MoleculeName,
//                     };
//                     result.push(existingObject);
//                 }
//                 const transactionStatus = record.TransactionStatus;
//                 if (transactionStatus === 1) {
//                     existingObject.Liquidated += 1;
//                 } 
//                 if ([0, 1, 3, 4, 5].includes(transactionStatus)) {
//                     existingObject.Purchase += 1;
//                 }
//                 if ([0, 3, 4, 5].includes(transactionStatus)) {
//                     existingObject.Inventory += 1;
//                 }
//             });
//         } else {
//             for (const stationId of StationIds) {
//                 const mappedUid = await MappedUids.find({
//                     FinancialYear,
//                     StationId: stationId
//                 });
//                // console.log("Mapped UIDs for Station ID", stationId, ":", mappedUid);
//                 const station = await MappedUids.findOne({ StationId: stationId });
//                 const outletLegalName = station ? station.OutletLegalName : null;
//                 mappedUid.forEach(record => {
//                     const productPack = record.ProductPack;
//                     if (!productPack) {
//                         return;
//                     }
//                 // mappedUid.forEach(record => {
//                 //     // We are only interested in the specific ProductPack "13:00:45 FG IMP"
//                 //     if (record.ProductPack !== targetProductPack) {
//                 //         return;
//                 //     }
//                     let existingObject = result.find(item => item.StationId === stationId && item.ProductPack === productPack);
//                     if (!existingObject) {
//                         existingObject = {
//                             StationId: stationId,
//                             OutletLegalName: outletLegalName,
//                             ProductPack: productPack,
//                             Purchase: 0,
//                             Liquidated: 0,
//                             Inventory: 0,
//                             ProductId: record.ProductId,
//                             HSNCode: record.HSNCode,
//                             ProductSegment: record.ProductSegment,
//                             CompanyName : record.CompanyName,
//                             ProductCategory : record.ProductCategoryName,
//                             MoleculeName : record.MoleculeName,
//                         };
//                         result.push(existingObject);
//                     }
//                     const transactionStatus = record.TransactionStatus;
//                     if (transactionStatus === 1) {
//                         existingObject.Liquidated += 1;
//                     } 
//                     if ([0, 1, 3, 4, 5].includes(transactionStatus)) {
//                         existingObject.Purchase += 1;
//                     }
//                     if ([0, 3, 4, 5].includes(transactionStatus)) {
//                         existingObject.Inventory += 1;
//                     }
//                 });
//             }
//         }
//        // console.log("Result:", result);
//         res.status(200).json(result);
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).send("Internal Server Error");
//     }
// };
const mappedUidsReport30Jan = async (req, res) => {
    try {
        const { FinancialYear, StationIds, Org } = req.body;
        console.log("Received FinancialYear:", FinancialYear);
        console.log("Received StationIds:", StationIds);
        if (!FinancialYear || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send("Financial year and station IDs are required");
        }
        const result = [];
        if (Org) {
            {
                const mappedUid = await MappedUids_1.default.find({
                    FinancialYear,
                    StationId: { $in: StationIds }
                });
                mappedUid.forEach(record => {
                    const productPack = record.ProductPack;
                    if (!productPack) {
                        return;
                    }
                    let existingObject = result.find(item => item.ProductPack === productPack);
                    if (!existingObject) {
                        existingObject = {
                            ProductPack: productPack,
                            Purchase: 0,
                            Liquidated: 0,
                            Inventory: 0,
                            ProductId: record.ProductId,
                            HSNCode: record.HSNCode,
                            ProductSegment: record.ProductSegment,
                            CompanyName: record.CompanyName,
                            ProductCategory: record.ProductCategoryName,
                            MoleculeName: record.MoleculeName
                        };
                        result.push(existingObject);
                    }
                    const transactionStatus = record.TransactionStatus;
                    if (transactionStatus === 1) {
                        existingObject.Liquidated += 1;
                    }
                    if ([0, 1, 3, 4, 5].includes(transactionStatus)) {
                        existingObject.Purchase += 1;
                    }
                    if ([0, 3, 4, 5].includes(transactionStatus)) {
                        existingObject.Inventory += 1;
                    }
                });
            }
        }
        else {
            for (const stationId of StationIds) {
                const mappedUid = await MappedUids_1.default.find({
                    FinancialYear,
                    StationId: stationId
                });
                console.log("Mapped UIDs for Station ID", stationId, ":", mappedUid);
                mappedUid.forEach(record => {
                    const productPack = record.ProductPack;
                    if (!productPack) {
                        return;
                    }
                    let existingObject = result.find(item => item.StationId === stationId && item.ProductPack === productPack);
                    if (!existingObject) {
                        existingObject = {
                            StationId: stationId,
                            ProductPack: productPack,
                            Purchase: 0,
                            Liquidated: 0,
                            Inventory: 0,
                            ProductId: record.ProductId,
                            HSNCode: record.HSNCode,
                            ProductSegment: record.ProductSegment,
                            CompanyName: record.CompanyName,
                            ProductCategory: record.ProductCategoryName,
                            MoleculeName: record.MoleculeName
                        };
                        result.push(existingObject);
                    }
                    const transactionStatus = record.TransactionStatus;
                    if (transactionStatus === 1) {
                        existingObject.Liquidated += 1;
                    }
                    if ([0, 1, 3, 4, 5].includes(transactionStatus)) {
                        existingObject.Purchase += 1;
                    }
                    if ([0, 3, 4, 5].includes(transactionStatus)) {
                        existingObject.Inventory += 1;
                    }
                });
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
exports.mappedUidsReport30Jan = mappedUidsReport30Jan;
const mappedUidsReport = async (req, res) => {
    try {
        const { FinancialYear, StationIds, Org } = req.body;
        console.log("Received FinancialYear:", FinancialYear);
        console.log("Received StationIds:", StationIds);
        if (!FinancialYear || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send("Financial year and station IDs are required");
        }
        const resultMap = {}; // Using an object to store results for quick access
        const query = { FinancialYear, StationId: { $in: StationIds } };
        const mappedUids = await MappedUids_1.default.find(query); // Fetch all data in a single query
        // Process all the records in a single loop
        mappedUids.forEach(record => {
            const productPack = record.ProductPack;
            if (!productPack)
                return;
            const key = Org ? productPack : `${record.StationId}-${productPack}`;
            let existingObject = resultMap[key];
            if (!existingObject) {
                existingObject = {
                    ...(Org ? {} : { StationId: record.StationId }),
                    ProductPack: productPack,
                    Purchase: 0,
                    Liquidated: 0,
                    Inventory: 0,
                    ProductId: record.ProductId,
                    HSNCode: record.HSNCode,
                    ProductSegment: record.ProductSegment,
                    CompanyName: record.CompanyName,
                    ProductCategory: record.ProductCategoryName,
                    MoleculeName: record.MoleculeName
                };
                resultMap[key] = existingObject;
            }
            const transactionStatus = record.TransactionStatus;
            if (transactionStatus === 1) {
                existingObject.Liquidated += 1;
            }
            if ([0, 1, 3, 4, 5].includes(transactionStatus)) {
                existingObject.Purchase += 1;
            }
            if ([0, 3, 4, 5].includes(transactionStatus)) {
                existingObject.Inventory += 1;
            }
        });
        const result = Object.values(resultMap); // Convert resultMap back to an array for the response
        //console.log("Result:", result);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.mappedUidsReport = mappedUidsReport;
const CurentInventory = async (req, res) => {
    try {
        const { FinancialYear, StationIds, Org } = req.body;
        // console.log("Received FinancialYear:", FinancialYear);
        // console.log("Received StationIds:", StationIds);
        if (!FinancialYear || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send("Financial year and station IDs are required");
        }
        const result = [];
        if (Org) {
            // Handle Org is true scenario
            const mappedUid = await MappedUids_1.default.find({
                FinancialYear,
                StationId: { $in: StationIds }
            });
            mappedUid.forEach(record => {
                const transactionDate = record.CreatedDate;
                const date = transactionDate.toISOString().split('T')[0];
                if (!transactionDate) {
                    return;
                }
                let existingObject = result.find(item => item.Date === date);
                if (!existingObject) {
                    existingObject = {
                        Date: date,
                        TotalInventory: 0
                    };
                    result.push(existingObject);
                }
                if ([0, 3, 4, 5].includes(record.TransactionStatus)) {
                    existingObject.TotalInventory += 1;
                }
            });
        }
        else {
            // Handle Org is false scenario
            for (const stationId of StationIds) {
                const mappedUid = await MappedUids_1.default.find({
                    FinancialYear,
                    StationId: stationId
                });
                console.log("Mapped UIDs for Station ID", stationId, ":", mappedUid);
                mappedUid.forEach(record => {
                    const transactionDate = record.CreatedDate;
                    const date = transactionDate.toISOString().split('T')[0];
                    if (!transactionDate) {
                        return;
                    }
                    let existingObject = result.find(item => item.StationId === stationId && item.Date === date);
                    if (!existingObject) {
                        existingObject = {
                            StationId: stationId,
                            Date: date,
                            TotalInventory: 0
                        };
                        result.push(existingObject);
                    }
                    if ([0, 3, 4, 5].includes(record.TransactionStatus)) {
                        existingObject.TotalInventory += 1;
                    }
                });
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
exports.CurentInventory = CurentInventory;
// export const NumberAPI = async (req: Request, res: Response) => {
//     try {
//         const { FinancialYear, StationIds, Org } = req.body;
//         console.log("Received FinancialYear:", FinancialYear);
//         console.log("Received StationIds:", StationIds);
//         console.log("Received Org:", Org);
//         if (!FinancialYear || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0 || Org === undefined) {
//             return res.status(400).send("Financial year, station IDs, and Org flag are required");
//         }
//         const result: any[] = [];
//         const monthlyData: Record<string, Record<string, { SaleAmount: number, TotalInventory: number }>> = {};
//         // Process Sale Data
//         const saleTransHeaders = await SaleTransHeader.find({
//             FinancialYear,
//             StationId: { $in: StationIds }
//         });
//         saleTransHeaders.forEach(header => {
//             const month = header.InvoiceDate.toISOString().slice(0, 7); // Get YYYY-MM format
//             const stationId = header.StationId;
//             const saleAmount = header.DiscountedBillValue;
//             if (!monthlyData[month]) {
//                 monthlyData[month] = {};
//             }
//             if (!monthlyData[month][stationId]) {
//                 monthlyData[month][stationId] = { SaleAmount: 0, TotalInventory: 0 };
//             }
//             monthlyData[month][stationId].SaleAmount += saleAmount;
//         });
//         // Process Inventory Data
//         const mappedUids = await MappedUids.find({
//             FinancialYear,
//             StationId: { $in: StationIds }
//         });
//         mappedUids.forEach(record => {
//             const month = record.CreatedDate.toISOString().slice(0, 7); // Get YYYY-MM format
//             const stationId = record.StationId;
//             if (!monthlyData[month]) {
//                 monthlyData[month] = {};
//             }
//             if (!monthlyData[month][stationId]) {
//                 monthlyData[month][stationId] = { SaleAmount: 0, TotalInventory: 0 };
//             }
//             if ([0, 3, 4, 5].includes(record.TransactionStatus)) {
//                 monthlyData[month][stationId].TotalInventory += 1;
//             }
//         });
//         if (Org) {
//             // Aggregate overall results
//             const overallData: Record<string, { SaleAmount: number, TotalInventory: number }> = {};
//             for (const month in monthlyData) {
//                 if (!overallData[month]) {
//                     overallData[month] = { SaleAmount: 0, TotalInventory: 0 };
//                 }
//                 for (const stationId in monthlyData[month]) {
//                     overallData[month].SaleAmount += monthlyData[month][stationId].SaleAmount;
//                     overallData[month].TotalInventory += monthlyData[month][stationId].TotalInventory;
//                 }
//             }
//             for (const month in overallData) {
//                 result.push({
//                     Month: month,
//                     TodaySales: overallData[month].SaleAmount,
//                     TodayInventory: overallData[month].TotalInventory
//                 });
//             }
//         } else {
//             // Station-wise results
//             for (const month in monthlyData) {
//                 for (const stationId in monthlyData[month]) {
//                     result.push({
//                         Month: month,
//                         StationId: stationId,
//                         SaleAmount: monthlyData[month][stationId].SaleAmount,
//                         TotalInventory: monthlyData[month][stationId].TotalInventory
//                     });
//                 }
//             }
//         }
//         console.log("Result:", result);
//         res.status(200).json(result);
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).send("Internal Server Error");
//     }
// };
// export const DayWise = async (req: Request, res: Response) => {
//     try {
//         const { FromDate, ToDate, StationIds, Org } = req.body;
//         console.log("Received FromDate:", FromDate);
//         console.log("Received ToDate:", ToDate);
//         console.log("Received StationIds:", StationIds);
//         console.log("Received Org:", Org);
//         if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0 || Org === undefined) {
//             return res.status(400).send("FromDate, ToDate, station IDs, and Org flag are required");
//         }
//         // Parse dates using moment
//         const fromDate = moment(FromDate, "DD-MM-YYYY").startOf('day').toDate();
//         const toDate = moment(ToDate, "DD-MM-YYYY").endOf('day').toDate();
//         if (!fromDate || !toDate || isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
//             return res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
//         }
//         const result: any[] = [];
//         const dateRangeData: Record<string, Record<string, { SaleAmount: number, TotalInventory: number }>> = {};
//         // Process Sale Data
//         const saleTransHeaders = await SaleTransHeader.find({
//             InvoiceDate: { $gte: fromDate, $lte: toDate },
//             StationId: { $in: StationIds }
//         });
//         saleTransHeaders.forEach(header => {
//             const date = moment(header.InvoiceDate).format("DD-MM-YYYY"); // Get DD-MM-YYYY format
//             const stationId = header.StationId;
//             const saleAmount = header.DiscountedBillValue;
//             if (!dateRangeData[date]) {
//                 dateRangeData[date] = {};
//             }
//             if (!dateRangeData[date][stationId]) {
//                 dateRangeData[date][stationId] = { SaleAmount: 0, TotalInventory: 0 };
//             }
//             dateRangeData[date][stationId].SaleAmount += saleAmount;
//         });
//         // Process Inventory Data
//         const mappedUids = await MappedUids.find({
//             CreatedDate: { $gte: fromDate, $lte: toDate },
//             StationId: { $in: StationIds }
//         });
//         mappedUids.forEach(record => {
//             const date = moment(record.CreatedDate).format("DD-MM-YYYY"); // Get DD-MM-YYYY format
//             const stationId = record.StationId;
//             if (!dateRangeData[date]) {
//                 dateRangeData[date] = {};
//             }
//             if (!dateRangeData[date][stationId]) {
//                 dateRangeData[date][stationId] = { SaleAmount: 0, TotalInventory: 0 };
//             }
//             if ([0, 3, 4, 5].includes(record.TransactionStatus)) {
//                 dateRangeData[date][stationId].TotalInventory += 1;
//             }
//         });
//         if (Org) {
//             // Aggregate overall results
//             const overallData: Record<string, { SaleAmount: number, TotalInventory: number }> = {};
//             for (const date in dateRangeData) {
//                 if (!overallData[date]) {
//                     overallData[date] = { SaleAmount: 0, TotalInventory: 0 };
//                 }
//                 for (const stationId in dateRangeData[date]) {
//                     overallData[date].SaleAmount += dateRangeData[date][stationId].SaleAmount;
//                     overallData[date].TotalInventory += dateRangeData[date][stationId].TotalInventory;
//                 }
//             }
//             for (const date in overallData) {
//                 result.push({
//                     Date: date,
//                     TodaySales: overallData[date].SaleAmount,
//                     TodayInventory: overallData[date].TotalInventory
//                 });
//             }
//         } else {
//             // Station-wise results
//             for (const date in dateRangeData) {
//                 for (const stationId in dateRangeData[date]) {
//                     result.push({
//                         Date: date,
//                         StationId: stationId,
//                         TodaySales: dateRangeData[date][stationId].SaleAmount,
//                         TodayInventory: dateRangeData[date][stationId].TotalInventory
//                     });
//                 }
//             }
//         }
//         console.log("Result:", result);
//         res.status(200).json(result);
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).send("Internal Server Error");
//     }
// };
const NumberAPI = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds, Org } = req.body;
        console.log("Received FromDate:", FromDate);
        console.log("Received ToDate:", ToDate);
        console.log("Received StationIds:", StationIds);
        console.log("Received Org:", Org);
        if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0 || Org === undefined) {
            return res.status(400).send("FromDate, ToDate, station IDs, and Org flag are required");
        }
        const fromDate = (0, moment_1.default)(FromDate, "DD-MM-YYYY").startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, "DD-MM-YYYY").endOf('day').toDate();
        console.log("Parsed fromDate:", fromDate);
        console.log("Parsed toDate:", toDate);
        if (!fromDate || !toDate || isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
        }
        const result = [];
        const dateRangeData = {};
        // Process Sale Data
        const saleTransHeaders = await SaleTransHeader_1.default.find({
            InvoiceDate: { $gte: fromDate, $lte: toDate },
            StationId: { $in: StationIds }
        });
        console.log("SaleTransHeaders:", saleTransHeaders);
        saleTransHeaders.forEach(header => {
            const date = (0, moment_1.default)(header.InvoiceDate).format("DD-MM-YYYY"); // Get DD-MM-YYYY format
            const stationId = header.StationId;
            const saleAmount = header.DiscountedBillValue;
            if (!dateRangeData[date]) {
                dateRangeData[date] = {};
            }
            if (!dateRangeData[date][stationId]) {
                dateRangeData[date][stationId] = { SaleAmount: 0, TotalInventory: 0, ExpiringSoonCount: 0 };
            }
            dateRangeData[date][stationId].SaleAmount += saleAmount;
        });
        const mappedUids = await MappedUids_1.default.find({
            CreatedDate: { $lte: fromDate },
            StationId: { $in: StationIds }
        });
        console.log("MappedUids:", mappedUids);
        const totalInventoryByStation = {};
        mappedUids.forEach(record => {
            const stationId = record.StationId;
            if ([0, 3, 4, 5].includes(record.TransactionStatus)) {
                if (!totalInventoryByStation[stationId]) {
                    totalInventoryByStation[stationId] = 0;
                }
                totalInventoryByStation[stationId] += 1;
            }
        });
        console.log("TotalInventoryByStation:", totalInventoryByStation);
        const expiringSoonCountByStation = {};
        mappedUids.forEach(record => {
            const stationId = record.StationId;
            const expiryDate = (0, moment_1.default)(record.ExpDate);
            const daysUntilExpiry = expiryDate.diff((0, moment_1.default)(fromDate), 'days'); // Compare with fromDate
            if (!expiringSoonCountByStation[stationId]) {
                expiringSoonCountByStation[stationId] = 0;
            }
            if (daysUntilExpiry < 90) {
                expiringSoonCountByStation[stationId] += 1;
            }
        });
        console.log("ExpiringSoonCountByStation:", expiringSoonCountByStation);
        if (Org) {
            const overallData = {
                SaleAmount: 0,
                TotalInventory: Object.values(totalInventoryByStation).reduce((acc, curr) => acc + curr, 0),
                ExpiringSoonCount: Object.values(expiringSoonCountByStation).reduce((acc, curr) => acc + curr, 0)
            };
            for (const date in dateRangeData) {
                for (const stationId in dateRangeData[date]) {
                    overallData.SaleAmount += dateRangeData[date][stationId].SaleAmount;
                }
            }
            result.push({
                Date: FromDate,
                TodaySales: overallData.SaleAmount,
                TodayInventory: overallData.TotalInventory,
                ExpiringSoonCount: overallData.ExpiringSoonCount
            });
        }
        else {
            for (const stationId in totalInventoryByStation) {
                result.push({
                    Date: FromDate,
                    StationId: stationId,
                    TodaySales: 0,
                    TodayInventory: totalInventoryByStation[stationId],
                    ExpiringSoonCount: expiringSoonCountByStation[stationId] || 0
                });
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
exports.NumberAPI = NumberAPI;
// export const SaleVelocity = async (req: Request, res: Response) => {
//     try {
//         const { FromDate, ToDate, StationIds, Org } = req.body;
//         console.log("Received FromDate:", FromDate);
//         console.log("Received ToDate:", ToDate);
//         console.log("Received StationIds:", StationIds);
//         console.log("Received Org:", Org);
//         // Input validation
//         if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0 || Org === undefined) {
//             return res.status(400).send("FromDate, ToDate, Station IDs, and Org flag are required");
//         }
//         // Parse dates using moment
//         const fromDate = moment(FromDate, "DD-MM-YYYY").startOf('day').toDate();
//         const toDate = moment(ToDate, "DD-MM-YYYY").endOf('day').toDate();
//         if (!fromDate || !toDate || isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
//             return res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
//         }
//         // Fetch data from MappedUids based on the filters, including TransactionStatus 1
//         const mappedUidsData = await MappedUids.find({
//             CreatedDate: { $gte: fromDate, $lte: toDate },
//             StationId: { $in: StationIds },
//             TransactionStatus: 1 // Filter for TransactionStatus 1
//         });
//         // Collect InvoiceNumbers to fetch their InvoiceDates
//         const invoiceNumbers = mappedUidsData.map(record => record.InvoiceNumber);
//         // Fetch InvoiceDate from SaleTransHeader based on InvoiceNumbers
//         const saleTransData = await SaleTransHeader.find({
//             InvoiceNumber: { $in: invoiceNumbers }
//         });
//         // Create a mapping of InvoiceNumber to InvoiceDate
//         const invoiceDateMap = saleTransData.reduce((acc: Record<string, Date>, record) => {
//             acc[record.InvoiceNo] = record.InvoiceDate; // Ensure InvoiceDate exists in SaleTransHeader
//             return acc;
//         }, {});
//         // Initialize an object to sum NoOfDays by ProductId
//         const productCodeData: Record<string, { totalNoOfDays: number; count: number; productPack?: string }> = {};
//         for (const record of mappedUidsData) {
//             const invoiceDate = invoiceDateMap[record.InvoiceNumber];
//             if (invoiceDate) {
//                 const saleDate = moment(invoiceDate).diff(moment(record.CreatedDate), 'days'); // Calculate difference in days
//                 const productId = record.ProductId; // Assuming ProductId exists in MappedUids
//                 const productPack = record.ProductPack; // Get ProductPack from the MappedUids record
//                 // Sum NoOfDays
//                 if (!productCodeData[productId]) {
//                     productCodeData[productId] = { totalNoOfDays: 0, count: 0, productPack: productPack };
//                 }
//                 productCodeData[productId].totalNoOfDays += saleDate;
//                 productCodeData[productId].count += 1; // Increment count of records
//             }
//         }
//         // Fetch OutletLegalNames for the given StationIds
//         const stationsData = await Station.find({
//             StationId: { $in: StationIds }
//         });
//         // Create a mapping of StationId to OutletLegalName
//         const outletMap = stationsData.reduce((acc: Record<string, string>, station) => {
//             acc[station.StationId] = station.OutletLegalName; // Assuming OutletLegalName exists in Stations
//             return acc;
//         }, {});
//         // Prepare the response structure based on Org value
//         const responseData = Object.keys(productCodeData).map(code => {
//             const { totalNoOfDays, count, productPack } = productCodeData[code];
//             const averageNoOfDays = count > 0 ? totalNoOfDays / count : 0; // Handle division by zero
//             // If Org is false, include StationId and OutletLegalName
//             const stationId = mappedUidsData.find(record => record.ProductId === code)?.StationId;
//             const outletLegalName = stationId ? outletMap[stationId] : null; // Get OutletLegalName from the map
//             return Org 
//                 ? { ProductCode: code, AverageNoOfDays: averageNoOfDays, TotalRecords: count }
//                 : { ProductCode: code, AverageNoOfDays: averageNoOfDays, TotalRecords: count, ProductPack: productPack, StationId: stationId, OutletLegalName: outletLegalName }; // Include ProductPack, StationId, and OutletLegalName
//         });
//         // Send the structured response
//         res.status(200).json(responseData);
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).send("Internal Server Error");
//     }
// };
const SaleVelocity1 = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds, Org } = req.body;
        console.log("Received FromDate:", FromDate);
        console.log("Received ToDate:", ToDate);
        console.log("Received StationIds:", StationIds);
        console.log("Received Org:", Org);
        // Input validation
        if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0 || Org === undefined) {
            return res.status(400).send("FromDate, ToDate, Station IDs, and Org flag are required");
        }
        // Parse dates using moment
        const fromDate = (0, moment_1.default)(FromDate, "DD-MM-YYYY").startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, "DD-MM-YYYY").endOf('day').toDate();
        // Validate parsed dates
        if (!fromDate || !toDate || isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
        }
        // Debugging: Log the parsed dates
        console.log("Parsed FromDate:", fromDate);
        console.log("Parsed ToDate:", toDate);
        // Fetch data from MappedUids based on the filters, including TransactionStatus 1
        const mappedUidsData = await MappedUids_1.default.find({
            CreatedDate: { $gte: fromDate, $lte: toDate },
            StationId: { $in: StationIds },
            TransactionStatus: 1 // Filter for TransactionStatus 1
        });
        // Collect InvoiceNumbers to fetch their InvoiceDates
        const invoiceNumbers = mappedUidsData.map(record => record.InvoiceNumber);
        // Fetch InvoiceDate from SaleTransHeader based on InvoiceNumbers
        const saleTransData = await SaleTransHeader_1.default.find({
            InvoiceNumber: { $in: invoiceNumbers }
        });
        // Create a mapping of InvoiceNumber to InvoiceDate
        const invoiceDateMap = saleTransData.reduce((acc, record) => {
            acc[record.InvoiceNo] = record.InvoiceDate; // Ensure InvoiceDate exists in SaleTransHeader
            return acc;
        }, {});
        // Initialize an object to sum NoOfDays by ProductId
        const productCodeData = {};
        for (const record of mappedUidsData) {
            const invoiceDate = invoiceDateMap[record.InvoiceNumber];
            if (invoiceDate) {
                const saleDate = (0, moment_1.default)(invoiceDate).diff((0, moment_1.default)(record.CreatedDate), 'days'); // Calculate difference in days
                const productId = record.ProductId; // Assuming ProductId exists in MappedUids
                const productPack = record.ProductPack; // Get ProductPack from the MappedUids record
                // Sum NoOfDays
                if (!productCodeData[productId]) {
                    productCodeData[productId] = { totalNoOfDays: 0, count: 0, productPack: productPack };
                }
                productCodeData[productId].totalNoOfDays += saleDate;
                productCodeData[productId].count += 1; // Increment count of records
            }
        }
        // Fetch OutletLegalNames for the given StationIds
        const stationsData = await Stations_1.default.find({
            StationId: { $in: StationIds }
        });
        // Create a mapping of StationId to OutletLegalName
        const outletMap = stationsData.reduce((acc, station) => {
            acc[station.StationId] = station.OutletLegalName; // Assuming OutletLegalName exists in Stations
            return acc;
        }, {});
        // Prepare the response structure based on Org value
        const responseData = Object.keys(productCodeData).map(code => {
            const { totalNoOfDays, count, productPack } = productCodeData[code];
            const averageNoOfDays = count > 0 ? totalNoOfDays / count : 0; // Handle division by zero
            // If Org is false, include StationId and OutletLegalName
            const stationId = mappedUidsData.find(record => record.ProductId === code)?.StationId;
            const outletLegalName = stationId ? outletMap[stationId] : null; // Get OutletLegalName from the map
            return Org
                ? { ProductCode: code, AverageNoOfDays: averageNoOfDays, TotalRecords: count, ProductPack: productPack }
                : { ProductCode: code, AverageNoOfDays: averageNoOfDays, TotalRecords: count, ProductPack: productPack, StationId: stationId, OutletLegalName: outletLegalName }; // Include ProductPack, StationId, and OutletLegalName
        });
        // Send the structured response
        res.status(200).json(responseData);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.SaleVelocity1 = SaleVelocity1;
const SaleVelocityFinal = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds, Org } = req.body;
        if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0 || Org === undefined) {
            return res.status(400).send("FromDate, ToDate, Station IDs, and Org flag are required");
        }
        const fromDate = (0, moment_1.default)(FromDate, "DD-MM-YYYY").startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, "DD-MM-YYYY").endOf('day').toDate();
        if (!fromDate || !toDate || isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
        }
        // Parallel fetching of data
        const [mappedUidsData, stationsData] = await Promise.all([
            MappedUids_1.default.find({
                CreatedDate: { $gte: fromDate, $lte: toDate },
                StationId: { $in: StationIds },
                TransactionStatus: 1
            }, { InvoiceNumber: 1, ProductId: 1, ProductPack: 1, CreatedDate: 1, StationId: 1 }), // Projections
            Stations_1.default.find({ StationId: { $in: StationIds } }, { StationId: 1, OutletLegalName: 1 }) // Projections
        ]);
        const invoiceNumbers = mappedUidsData.map(record => record.InvoiceNumber);
        const saleTransData = await SaleTransHeader_1.default.find({
            InvoiceNumber: { $in: invoiceNumbers }
        }, { InvoiceNo: 1, InvoiceDate: 1 }); // Projections
        const invoiceDateMap = saleTransData.reduce((acc, record) => {
            acc[record.InvoiceNo] = record.InvoiceDate;
            return acc;
        }, {});
        const productCodeData = {};
        for (const record of mappedUidsData) {
            const invoiceDate = invoiceDateMap[record.InvoiceNumber];
            if (invoiceDate) {
                const saleDate = (0, moment_1.default)(invoiceDate).diff((0, moment_1.default)(record.CreatedDate), 'days');
                const productId = record.ProductId;
                const productPack = record.ProductPack;
                if (!productCodeData[productId]) {
                    productCodeData[productId] = { totalNoOfDays: 0, count: 0, productPack: productPack };
                }
                productCodeData[productId].totalNoOfDays += saleDate;
                productCodeData[productId].count += 1;
            }
        }
        const outletMap = stationsData.reduce((acc, station) => {
            acc[station.StationId] = station.OutletLegalName;
            return acc;
        }, {});
        const responseData = Object.keys(productCodeData).map(code => {
            const { totalNoOfDays, count, productPack } = productCodeData[code];
            const averageNoOfDays = count > 0 ? totalNoOfDays / count : 0;
            const stationId = mappedUidsData.find(record => record.ProductId === code)?.StationId;
            const outletLegalName = stationId ? outletMap[stationId] : null;
            return Org
                ? { ProductCode: code, AverageNoOfDays: averageNoOfDays, TotalRecords: count, ProductPack: productPack }
                : { ProductCode: code, AverageNoOfDays: averageNoOfDays, TotalRecords: count, ProductPack: productPack, StationId: stationId, OutletLegalName: outletLegalName };
        });
        res.status(200).json(responseData);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.SaleVelocityFinal = SaleVelocityFinal;
// export const SaleVelocity = async (req: Request, res: Response) => {
//     try {
//         const { FromDate, ToDate, StationIds, Org } = req.body;
//         if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0 || Org === undefined) {
//             return res.status(400).send("FromDate, ToDate, Station IDs, and Org flag are required");
//         }
//         // const fromDate = moment(FromDate, "DD-MM-YYYY").startOf('day').toDate();
//         // const toDate = moment(ToDate, "DD-MM-YYYY").endOf('day').toDate();
//         const fromDate = moment.utc(FromDate, "DD-MM-YYYY").startOf('day').toDate();
//         const toDate = moment.utc(ToDate, "DD-MM-YYYY").endOf('day').toDate();
//         if (!fromDate || !toDate || isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
//             return res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
//         }
//         // Parallel fetching of data
//         const [mappedUidsData, stationsData] = await Promise.all([
//             MappedUids.find({
//                 CreatedDate: { $gte: fromDate, $lte: toDate },
//                 StationId: { $in: StationIds },
//                 TransactionStatus: 1
//             }, { InvoiceNumber: 1, ProductId: 1, ProductPack: 1, CreatedDate: 1, StationId: 1 }), // Projections
//             Station.find({ StationId: { $in: StationIds } }, { StationId: 1, OutletLegalName: 1 }) // Projections
//         ]);
//         const invoiceNumbers = mappedUidsData.map(record => record.InvoiceNumber);
//         const saleTransData = await SaleTransHeader.find({
//             InvoiceNo: { $in: invoiceNumbers }
//         }, { InvoiceNo: 1, InvoiceDate: 1 }); // Projections
//         const invoiceDateMap = saleTransData.reduce((acc: Record<string, Date>, record) => {
//             acc[record.InvoiceNo] = record.InvoiceDate;
//             return acc;
//         }, {});
//         const productCodeData: Record<string, { totalNoOfDays: number; count: number; productPack?: string; stationData: Record<string, { totalNoOfDays: number; count: number; outletLegalName?: string }> }> = {};
//         for (const record of mappedUidsData) {
//             const invoiceDate = invoiceDateMap[record.InvoiceNumber];
//             if (invoiceDate) {
//                 const saleDate = moment(invoiceDate).diff(moment(record.CreatedDate), 'days');
//                 const productId = record.ProductId;
//                 const productPack = record.ProductPack;
//                 const stationId = record.StationId;
//                 const outletLegalName = stationsData.find(station => station.StationId === stationId)?.OutletLegalName;
//                 // Initialize product data if not exists
//                 if (!productCodeData[productId]) {
//                     productCodeData[productId] = { totalNoOfDays: 0, count: 0, productPack: productPack, stationData: {} };
//                 }
//                 // Aggregate for the overall product
//                 productCodeData[productId].totalNoOfDays += saleDate;
//                 productCodeData[productId].count += 1;
//                 // Initialize station data if not exists
//                 if (!productCodeData[productId].stationData[stationId]) {
//                     productCodeData[productId].stationData[stationId] = { totalNoOfDays: 0, count: 0, outletLegalName: outletLegalName };
//                 }
//                 // Aggregate for the specific station
//                 productCodeData[productId].stationData[stationId].totalNoOfDays += saleDate;
//                 productCodeData[productId].stationData[stationId].count += 1;
//             }
//         }
//         const responseData = Object.keys(productCodeData).flatMap(code => {
//             const { totalNoOfDays, count, productPack, stationData } = productCodeData[code];
//             if (Org) {
//                 const averageNoOfDays = count > 0 ? totalNoOfDays / count : 0;
//                 return [{ ProductCode: code, AverageNoOfDays: averageNoOfDays, TotalRecords: count, ProductPack: productPack }];
//             } else {
//                 return Object.keys(stationData).map(stationId => {
//                     const { totalNoOfDays, count, outletLegalName } = stationData[stationId];
//                     const averageNoOfDays = count > 0 ? totalNoOfDays / count : 0;
//                     return {
//                         ProductCode: code,
//                         AverageNoOfDays: averageNoOfDays,
//                         TotalRecords: count,
//                         ProductPack: productPack,
//                         StationId: stationId,
//                         OutletLegalName: outletLegalName
//                     };
//                 });
//             }
//         });
//         res.status(200).json(responseData);
//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).send("Internal Server Error");
//     }
// };
const SaleVelocity = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds, Org } = req.body;
        if (!FromDate || !ToDate || !StationIds || !Array.isArray(StationIds) || StationIds.length === 0 || Org === undefined) {
            return res.status(400).send("FromDate, ToDate, Station IDs, and Org flag are required");
        }
        const fromDate = moment_1.default.utc(FromDate, "DD-MM-YYYY").startOf('day').toDate();
        const toDate = moment_1.default.utc(ToDate, "DD-MM-YYYY").endOf('day').toDate();
        if (!fromDate || !toDate || isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return res.status(400).send("Invalid date format. Please use DD-MM-YYYY format.");
        }
        // Parallel fetching of data
        const [mappedUidsData, stationsData] = await Promise.all([
            MappedUids_1.default.find({
                CreatedDate: { $gte: fromDate, $lte: toDate },
                StationId: { $in: StationIds },
                TransactionStatus: 1
            }, { InvoiceNumber: 1, ProductId: 1, ProductPack: 1, CreatedDate: 1, StationId: 1 }), // Projections
            Stations_1.default.find({ StationId: { $in: StationIds } }, { StationId: 1, OutletLegalName: 1 }) // Projections
        ]);
        const invoiceNumbers = mappedUidsData.map(record => record.InvoiceNumber);
        const saleTransData = await SaleTransHeader_1.default.find({
            InvoiceNo: { $in: invoiceNumbers }
        }, { InvoiceNo: 1, InvoiceDate: 1 }); // Projections
        const invoiceDateMap = saleTransData.reduce((acc, record) => {
            acc[record.InvoiceNo] = record.InvoiceDate;
            return acc;
        }, {});
        const productCodeData = {};
        for (const record of mappedUidsData) {
            const invoiceDate = invoiceDateMap[record.InvoiceNumber];
            if (invoiceDate) {
                const saleDate = (0, moment_1.default)(invoiceDate).diff((0, moment_1.default)(record.CreatedDate), 'days');
                const productId = record.ProductId;
                const productPack = record.ProductPack;
                const stationId = record.StationId;
                const outletLegalName = stationsData.find(station => station.StationId === stationId)?.OutletLegalName;
                // Initialize product data if not exists
                if (!productCodeData[productId]) {
                    productCodeData[productId] = { highestNoOfDays: 0, count: 0, productPack: productPack, stationData: {} };
                }
                // Update highest No Of Days
                productCodeData[productId].highestNoOfDays = Math.max(productCodeData[productId].highestNoOfDays, saleDate);
                productCodeData[productId].count += 1;
                // Initialize station data if not exists
                if (!productCodeData[productId].stationData[stationId]) {
                    productCodeData[productId].stationData[stationId] = { highestNoOfDays: 0, count: 0, outletLegalName: outletLegalName };
                }
                // Update highest No Of Days for specific station
                productCodeData[productId].stationData[stationId].highestNoOfDays = Math.max(productCodeData[productId].stationData[stationId].highestNoOfDays, saleDate);
                productCodeData[productId].stationData[stationId].count += 1;
            }
        }
        const responseData = Object.keys(productCodeData).flatMap(code => {
            const { highestNoOfDays, count, productPack, stationData } = productCodeData[code];
            if (Org) {
                // Calculate AverageNoOfDays for Org case
                const averageNoOfDays = highestNoOfDays / count;
                return [{ ProductCode: code, AverageNoOfDays: averageNoOfDays, TotalRecords: count, ProductPack: productPack }];
            }
            else {
                // For each station, calculate AverageNoOfDays
                return Object.keys(stationData).map(stationId => {
                    const { highestNoOfDays, count, outletLegalName } = stationData[stationId];
                    const averageNoOfDays = highestNoOfDays / count;
                    return {
                        ProductCode: code,
                        AverageNoOfDays: averageNoOfDays,
                        TotalRecords: count,
                        ProductPack: productPack,
                        StationId: stationId,
                        OutletLegalName: outletLegalName
                    };
                });
            }
        });
        res.status(200).json(responseData);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};
exports.SaleVelocity = SaleVelocity;
// export const ProductAnalysis = async (req: Request, res: Response) => {
//     const { FinancialYear, ListOfStationIds, ProductPack, ProductId } = req.body;
//     // Validate input fields
//     if (!FinancialYear || !Array.isArray(ListOfStationIds) || ListOfStationIds.length === 0 || !ProductPack || !ProductId) {
//         return res.status(400).json({ 
//             error: "All fields are required: FinancialYear, ListOfStationIds (non-empty array), ProductPack, and ProductId." 
//         });
//     }
//     try {
//         // MongoDB aggregation to find matched records and calculate sum & average in one query
//         const aggregationResult = await MappedUids.aggregate([
//             {
//                 $match: {
//                     FinancialYear,
//                     StationId: { $in: ListOfStationIds },
//                     ProductPack,
//                     ProductId,
//                     TransactionStatus: 1,
//                 }
//             },
//             {
//                 $group: {
//                     _id: null, // Group all matched documents
//                     totalPRPrice: { $sum: "$PRPricePerPiece" },
//                     avgPRPrice: { $avg: "$PRPricePerPiece" },
//                     PRcount: { $sum: 1 }
//                 }
//             }
//         ]);
//         const saleTransactionsResult = await SaleTransactions.aggregate([
//             {
//                 $match: {
//                     FinancialYear,
//                     StationId: { $in: ListOfStationIds },
//                     ProductPack,
//                     ProductId,
//                     TransactionType: 0,
//                 }
//             },
//             {
//                 $group: {
//                     _id: null, // Group all matched documents
//                     totalSellingPrice: { $sum: "$SellingPrice" },
//                     avgSellingPrice: { $avg: "$SellingPrice" },
//                     Sellingcount: { $sum: 1 }
//                 }
//             }
//         ]);
//         // if (aggregationResult.length === 0) {
//         //     return res.status(200).json({ message: "No record matched the criteria." });
//         // }
//         if (saleTransactionsResult.length === 0) {
//             return res.status(200).json({ message: "No records matched the criteria." });
//         }
//         // Extract result from aggregation
//         const { totalPRPrice, avgPRPrice, PRcount } = aggregationResult[0];
//         const { totalSellingPrice, avgSellingPrice, Sellingcount } = saleTransactionsResult[0];
//         // Send response
//         res.json({
//             TotalPRPriceMatchedRecords: PRcount,
//             SumOfPRPrice: totalPRPrice,
//             AvgPRPrice: avgPRPrice,
//             TotalSellingMatchedRecords: Sellingcount,
//             SumOfSellingPrice: totalSellingPrice,
//             AvgSellingPrice: avgSellingPrice,
//             ProfitMargin :avgSellingPrice-avgPRPrice,
//         });
//     } catch (error) {
//         console.error("Error fetching records:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };
const ProductAnalysis = async (req, res) => {
    const { FinancialYear, ListOfStationIds, ProductPack, ProductId, Org } = req.body;
    // Validate input fields
    if (!FinancialYear || !Array.isArray(ListOfStationIds) || ListOfStationIds.length === 0 || !ProductPack || !ProductId) {
        return res.status(400).json({
            error: "All fields are required: FinancialYear, ListOfStationIds (non-empty array), ProductPack, and ProductId."
        });
    }
    try {
        // MongoDB aggregation to find matched records in MappedUids and calculate sum & average
        const aggregationResult = await MappedUids_1.default.aggregate([
            {
                $match: {
                    FinancialYear,
                    StationId: { $in: ListOfStationIds },
                    ProductPack,
                    ProductId,
                    TransactionStatus: 1,
                }
            },
            {
                $group: {
                    _id: null, // Group all matched documents
                    totalPRPrice: { $sum: "$PRPricePerPiece" },
                    avgPRPrice: { $avg: "$PRPricePerPiece" },
                    PRcount: { $sum: 1 }
                }
            }
        ]);
        // MongoDB aggregation to find matched records in SaleTransactions and calculate sum & average
        const saleTransactionsResult = await SaleTransactions_1.default.aggregate([
            {
                $match: {
                    FinancialYear,
                    StationId: { $in: ListOfStationIds },
                    ProductPack,
                    ProductId,
                    TransactionType: 0,
                }
            },
            {
                $group: {
                    _id: null, // Group all matched documents
                    totalSellingPrice: { $sum: "$SellingPrice" },
                    avgSellingPrice: { $avg: "$SellingPrice" },
                    Sellingcount: { $sum: 1 }
                }
            }
        ]);
        // If no records are found for sale transactions, return an empty response
        if (saleTransactionsResult.length === 0) {
            return res.status(200).json({ message: "No records matched the criteria." });
        }
        // Extract results from both aggregations
        const { totalPRPrice, avgPRPrice, PRcount } = aggregationResult[0];
        const { totalSellingPrice, avgSellingPrice, Sellingcount } = saleTransactionsResult[0];
        // Calculate Profit Margin
        const profitMargin = avgSellingPrice - avgPRPrice;
        // If Org is true, return the aggregated data
        if (Org) {
            return res.json({
                TotalPRPriceMatchedRecords: PRcount,
                SumOfPRPrice: totalPRPrice,
                AvgPRPrice: avgPRPrice,
                TotalSellingMatchedRecords: Sellingcount,
                SumOfSellingPrice: totalSellingPrice,
                AvgSellingPrice: avgSellingPrice,
                ProfitMargin: profitMargin,
            });
        }
        // If Org is false, return the station-wise data with AvgPRPrice, AvgSellingPrice, and ProfitMargin
        const stationWiseResult = await SaleTransactions_1.default.aggregate([
            {
                $match: {
                    FinancialYear,
                    StationId: { $in: ListOfStationIds },
                    ProductPack,
                    ProductId,
                    TransactionType: 0,
                }
            },
            {
                $group: {
                    _id: "$StationId", // Group by StationId
                    totalSellingPrice: { $sum: "$SellingPrice" },
                    avgSellingPrice: { $avg: "$SellingPrice" },
                    Sellingcount: { $sum: 1 },
                }
            },
            {
                $lookup: {
                    from: "MappedUids", // Lookup for MappedUids collection
                    let: { stationId: "$_id", productPack: ProductPack, productId: ProductId, financialYear: FinancialYear },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$StationId", "$$stationId"] },
                                        { $eq: ["$ProductPack", "$$productPack"] },
                                        { $eq: ["$ProductId", "$$productId"] },
                                        { $eq: ["$FinancialYear", "$$financialYear"] },
                                        { $eq: ["$TransactionStatus", 1] }
                                    ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalPRPrice: { $sum: "$PRPricePerPiece" },
                                avgPRPrice: { $avg: "$PRPricePerPiece" },
                                PRcount: { $sum: 1 },
                            }
                        }
                    ],
                    as: "mappedUidsData"
                }
            },
            {
                $unwind: {
                    path: "$mappedUidsData",
                    preserveNullAndEmptyArrays: true // Ensure it doesn't break if there's no matched data
                }
            },
            {
                $lookup: {
                    from: "Station", // Assuming a Stations collection exists
                    localField: "_id",
                    foreignField: "StationId",
                    as: "stationDetails"
                }
            },
            {
                $unwind: {
                    path: "$stationDetails",
                    preserveNullAndEmptyArrays: true // Ensure it doesn't break if stationDetails is empty
                }
            }
        ]);
        // Format the result in the desired format
        const stationWiseData = stationWiseResult.map(station => ({
            StationId: station._id,
            OutletLegalName: station.stationDetails.OutletLegalName,
            AvgPRPrice: station.mappedUidsData ? station.mappedUidsData.avgPRPrice : 0,
            AvgSellingPrice: station.avgSellingPrice,
            ProfitMargin: station.avgSellingPrice - (station.mappedUidsData ? station.mappedUidsData.avgPRPrice : 0),
            TotalPRPriceMatchedRecords: station.mappedUidsData ? station.mappedUidsData.PRcount : 0,
            SumOfPRPrice: station.mappedUidsData ? station.mappedUidsData.totalPRPrice : 0,
            TotalSellingMatchedRecords: station.Sellingcount,
            SumOfSellingPrice: station.totalSellingPrice,
        }));
        res.json(stationWiseData);
    }
    catch (error) {
        console.error("Error fetching records:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.ProductAnalysis = ProductAnalysis;
exports.default = router;
