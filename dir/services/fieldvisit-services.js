"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStationVillageWiseUniqueVisits = exports.getStationVillageWiseUniqueVisits101 = exports.getFieldVisitStationUserRatio = exports.getStationWiseUniqueVisits = exports.getFieldVisitAndSalesDataOriginal = exports.getFieldVisitAndSalesData = exports.getFieldVisitAndSalesDataFinalVersion = exports.getFieldVisitAndSalesData2Version = exports.getFieldVisitAndSalesData1Version = exports.getFieldVisitAndSalesData23Demo = exports.getFieldVisitAndSalesRatio = exports.getFieldVisitAndSalesDataFarmer = exports.getFarmerFieldVisits = exports.getFarmerFieldVisitsfinal = exports.getFarmerFieldVisits1 = exports.getEnhancedFieldVisits = exports.getFieldVisits = void 0;
const express_1 = __importDefault(require("express"));
const FieldVisit_1 = __importDefault(require("../models/FieldVisit"));
const FarmerRegistration_1 = __importDefault(require("../models/FarmerRegistration"));
const FarmerCrop_1 = __importDefault(require("../models/FarmerCrop"));
const SaleTransactions_1 = __importDefault(require("../models/SaleTransactions"));
const moment_1 = __importDefault(require("moment"));
const Stations_1 = __importDefault(require("../models/Stations"));
const router = express_1.default.Router();
const getFieldVisits = async (req, res) => {
    try {
        const alldata = await FieldVisit_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getFieldVisits = getFieldVisits;
const getEnhancedFieldVisits = async (req, res) => {
    try {
        const fieldVisits = await FieldVisit_1.default.find();
        // Prepare the response array
        const response = await Promise.all(fieldVisits.map(async (visit) => {
            const farmer = await FarmerRegistration_1.default.findOne({ FarmerLocalId: visit.FarmerLocalId });
            const crop = await FarmerCrop_1.default.findOne({ FarmerCropLocalId: visit.FarmerCropLocalId });
            // Constructing the response object
            return {
                StationId: farmer?.StationId || '',
                ShortCode: farmer?.StationShortCode || '',
                VillageName: farmer?.VillageValue || '',
                FarmerName: visit.FarmerName || '',
                Mobile: farmer?.MobileNumber || '',
                CropName: crop?.CropValue || '',
                Acres: crop?.Acres || '',
                DOS: crop?.JsonData?.DOS || '',
                CropStatusValue: visit.CropStatusValue || '',
                FieldObservations: visit.FieldObservations || '',
                Recommendations: visit.Recommendations || '',
                CreatedBy: visit.CreatedBy || '',
                CreatedDate: visit.CreatedDate || ''
            };
        }));
        return res.json(response);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getEnhancedFieldVisits = getEnhancedFieldVisits;
// export const getFarmerFieldVisits = async (req: Request, res: Response) => {
//     try {
//         // Extract parameters from request body
//         const { FromDate, ToDate, StationIds } = req.body;
//         // Validate input
//         if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
//             return res.status(400).send('Invalid input');
//         }
//         // Parse dates
//         const fromDate = moment(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
//         const toDate = moment(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
//         // Get field visits based on the StationIds and date range
//         const fieldVisits = await FarmerFieldVisit.find({
//             StationId: { $in: StationIds },
//             CreatedDate: { $gte: fromDate, $lte: toDate }
//         });
//         // Prepare the response
//         const response = {
//             FieldVisits: fieldVisits
//         };
//         return res.json(response);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send('Internal Server Error');
//     }
// };
const getFarmerFieldVisits1 = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds } = req.body;
        if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send('Invalid input');
        }
        const fromDate = (0, moment_1.default)(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
        // Fetch field visits based on date and station filters
        const fieldVisits = await FieldVisit_1.default.find({
            StationId: { $in: StationIds },
            CreatedDate: { $gte: fromDate, $lte: toDate }
        });
        if (fieldVisits.length === 0) {
            return res.status(200).json({ message: 'No field visits found for the given criteria', FieldVisits: [] });
        }
        const formattedVisits = [];
        for (const visit of fieldVisits) {
            const farmerRecord = await FarmerRegistration_1.default.findOne({ FarmerLocalId: visit.FarmerLocalId });
            const farmerCropRecord = await FarmerCrop_1.default.findOne({ FarmCropLocalId: visit.FarmerCropLocalId });
            const stationRecord = await Stations_1.default.findOne({ StationId: visit.StationId });
            const formattedVisit = {
                Station: visit.StationId,
                OutletLegalName: stationRecord ? stationRecord.OutletLegalName : null,
                FarmerName: visit.FarmerName,
                Mobile: farmerRecord ? farmerRecord.MobileNumber : null,
                TotalAcres: farmerRecord ? farmerRecord.TotalAcres : null,
                Village: farmerRecord?.VillageValue,
                Crop: farmerCropRecord?.CropValue,
                Variety: farmerCropRecord?.SeedVariety,
                CropAcres: farmerCropRecord?.Acres,
                CropStage: visit.CropStatusValue,
                FieldObservations: visit.FieldObservations,
                Recommendations: visit.Recommendations,
                CreatedDate: visit.CreatedDate,
                CreatedBy: visit.CreatedBy,
                CropPhoto: visit.CropPhoto
            };
            // Add the formatted visit to the array
            formattedVisits.push(formattedVisit);
        }
        // Prepare the response
        const response = {
            FieldVisits: formattedVisits
        };
        return res.json(response);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};
exports.getFarmerFieldVisits1 = getFarmerFieldVisits1;
const getFarmerFieldVisitsfinal = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds } = req.body;
        // Validate input
        if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send('Invalid input');
        }
        // Parse dates
        const fromDate = (0, moment_1.default)(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
        // Fetch field visits based on the provided filters
        const fieldVisits = await FieldVisit_1.default.find({
            StationId: { $in: StationIds },
            CreatedDate: { $gte: fromDate, $lte: toDate }
        });
        const formattedVisits = await Promise.all(fieldVisits.map(async (visit) => {
            // Fetch related data
            const farmerRecord = await FarmerRegistration_1.default.findOne({ FarmerLocalId: visit.FarmerLocalId });
            const farmerCropRecord = await FarmerCrop_1.default.findOne({ FarmerCropLocalId: visit.FarmerCropLocalId });
            const stationRecord = await Stations_1.default.findOne({ StationId: visit.StationId });
            // Format each visit into the desired structure
            return {
                StationId: farmerRecord ? farmerRecord.StationId : null,
                Station: stationRecord ? stationRecord.OutletLegalName : null,
                FarmerName: visit.FarmerName,
                Mobile: farmerRecord ? farmerRecord.MobileNumber : null,
                TotalAcres: farmerRecord ? farmerRecord.TotalAcres : null,
                Village: farmerRecord ? farmerRecord.VillageValue : null,
                Crop: farmerCropRecord ? farmerCropRecord.CropValue : null,
                Variety: farmerCropRecord ? farmerCropRecord.SeedVariety : null,
                CropAcres: farmerCropRecord ? farmerCropRecord.Acres : null,
                FieldObservations: visit.FieldObservations,
                Recommendations: visit.Recommendations,
                CreatedDate: visit.CreatedDate,
                CreatedBy: visit.CreatedBy,
                CropPhoto: visit.CropPhoto
            };
        }));
        // Send the response as an array of visits
        return res.json(formattedVisits);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};
exports.getFarmerFieldVisitsfinal = getFarmerFieldVisitsfinal;
const getFarmerFieldVisits = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds } = req.body;
        // Validate input
        if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).json({ error: 'Invalid input' });
        }
        // Parse and validate date format
        const fromDate = (0, moment_1.default)(FromDate, 'DD-MM-YYYY', true);
        const toDate = (0, moment_1.default)(ToDate, 'DD-MM-YYYY', true);
        if (!fromDate.isValid() || !toDate.isValid()) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        // Convert to proper date ranges
        const startOfDay = fromDate.startOf('day').toDate();
        const endOfDay = toDate.endOf('day').toDate();
        // Fetch field visits based on the provided filters
        const fieldVisits = await FieldVisit_1.default.find({
            StationId: { $in: StationIds },
            CreatedDate: { $gte: startOfDay, $lte: endOfDay }
        });
        if (!fieldVisits || fieldVisits.length === 0) {
            return res.status(200).json({ message: 'No field visits found for the given criteria' });
        }
        // Prepare data for response
        const formattedVisits = await Promise.all(fieldVisits.map(async (visit) => {
            // Fetch related data in parallel
            const [farmerRecord, farmerCropRecord] = await Promise.all([
                FarmerRegistration_1.default.findOne({ FarmerLocalId: visit.FarmerLocalId }),
                FarmerCrop_1.default.findOne({ FarmerCropLocalId: visit.FarmerCropLocalId }),
            ]);
            let stationName = 'Unknown Station';
            if (farmerRecord && farmerRecord.StationId) {
                const stationRecord = await Stations_1.default.findOne({ StationId: farmerRecord.StationId });
                if (stationRecord) {
                    stationName = stationRecord.OutletLegalName;
                }
            }
            // Format each visit into the desired structure
            return {
                Station: stationName,
                FarmerName: visit.FarmerName || 'Unknown Farmer',
                Mobile: farmerRecord ? farmerRecord.MobileNumber : 'Unknown Mobile',
                TotalAcres: farmerRecord ? farmerRecord.TotalAcres : 'N/A',
                Village: farmerRecord ? farmerRecord.VillageValue : 'Unknown Village',
                Crop: farmerCropRecord ? farmerCropRecord.CropValue : 'Unknown Crop',
                Variety: farmerCropRecord ? farmerCropRecord.SeedVariety : 'Unknown Variety',
                CropAcres: farmerCropRecord ? farmerCropRecord.Acres : 'N/A',
                FieldObservations: visit.FieldObservations || 'No Observations',
                Recommendations: visit.Recommendations || 'No Recommendations',
                LatLong: visit.LatLong || 'N/A',
                CreatedDate: visit.CreatedDate,
                CreatedBy: visit.CreatedBy || 'Unknown',
                CropPhoto: visit.CropPhoto || 'No Photo',
                CropPhoto1: visit.CropPhoto1 || 'No Photo',
                CropPhoto2: visit.CropPhoto2 || 'No Photo',
                CropPhoto3: visit.CropPhoto3 || 'No Photo',
                CropPhoto4: visit.CropPhoto4 || 'No Photo',
                CropPhoto5: visit.CropPhoto5 || 'No Photo',
            };
        }));
        // Send the response as an array of visits
        return res.json(formattedVisits);
    }
    catch (err) {
        console.error('Error fetching farmer field visits:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getFarmerFieldVisits = getFarmerFieldVisits;
const getFieldVisitAndSalesDataFarmer = async (req, res) => {
    try {
        // Extract parameters from request body
        const { FromDate, ToDate, StationIds } = req.body;
        // Validate input
        if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send('Invalid input');
        }
        // Parse dates
        const fromDate = (0, moment_1.default)(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
        // Aggregate to get visits and unique farmers
        const visits = await FieldVisit_1.default.aggregate([
            {
                $match: {
                    StationId: { $in: StationIds },
                    CreatedDate: { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $group: {
                    _id: {
                        CreatedBy: "$CreatedBy",
                        FarmerLocalId: "$FarmerLocalId",
                        VisitDate: { $dateToString: { format: "%Y-%m-%d", date: "$CreatedDate" } }
                    },
                    VisitCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: {
                        CreatedBy: "$_id.CreatedBy",
                        FarmerLocalId: "$_id.FarmerLocalId"
                    },
                    NoOfVisitsCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.FarmerLocalId",
                    CreatedBy: { $first: "$_id.CreatedBy" },
                    Visits: { $sum: "$NoOfVisitsCount" }
                }
            }
        ]);
        // Prepare the response with additional sale transactions data
        const response = [];
        for (const visit of visits) {
            const salesTransactions = await SaleTransactions_1.default.aggregate([
                {
                    $match: {
                        FarmerLocalId: visit._id,
                        CreatedDate: { $gte: fromDate, $lte: toDate },
                        TransactionType: 0
                    }
                },
                {
                    $group: {
                        _id: null,
                        TotalSalesValue: { $sum: "$TotalPrice" },
                        SaleRecords: { $push: "$$ROOT" }
                    }
                }
            ]);
            const totalSalesValue = salesTransactions.length > 0 ? salesTransactions[0].TotalSalesValue : 0;
            // Calculate LTV by summing TotalPrice for all records matching the FarmerLocalId
            const ltv = await SaleTransactions_1.default.aggregate([
                {
                    $match: {
                        FarmerLocalId: visit._id
                    }
                },
                {
                    $group: {
                        _id: visit._id,
                        LTV: { $sum: "$TotalPrice" }
                    }
                }
            ]);
            const ltvValue = ltv.length > 0 ? ltv[0].LTV : 0;
            // Process sale records to remove _id and HeaderId
            const saleRecords = salesTransactions.length > 0 ? salesTransactions[0].SaleRecords.map((record) => {
                const { _id, HeaderId, ...rest } = record;
                return rest;
            }) : [];
            // Lookup FarmerRegistration for additional details
            const farmerDetails = await FarmerRegistration_1.default.findOne({ FarmerLocalId: visit._id });
            const stationDetails = await Stations_1.default.findOne({ StationId: farmerDetails?.StationId });
            response.push({
                FarmerLocalId: visit._id,
                CreatedBy: visit.CreatedBy || 'Unknown',
                Visits: visit.Visits,
                RecentFieldVisitDate: farmerDetails?.RecentFvOn || 'Unknown',
                TotalSalesValue: totalSalesValue,
                SaleRecords: saleRecords,
                OutletLegalName: stationDetails?.OutletLegalName || 'Unknown',
                VillageValue: farmerDetails?.VillageValue || 'Unknown',
                FarmerName: farmerDetails?.FarmerName || 'Unknown',
                StationId: farmerDetails?.StationId || 'Unknown',
                MobileNumber: farmerDetails?.MobileNumber || 'Unknown',
                TotalAcres: farmerDetails?.TotalAcres,
                IsCustomer: farmerDetails?.IsCustomer,
                StationShortCode: farmerDetails?.StationShortCode || 'Unknown',
                LTV: ltvValue
            });
        }
        return res.json(response);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};
exports.getFieldVisitAndSalesDataFarmer = getFieldVisitAndSalesDataFarmer;
const getFieldVisitAndSalesRatio = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds } = req.body;
        if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send('Invalid input');
        }
        const fromDate = (0, moment_1.default)(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
        const stationWiseSummary = {};
        // Step 1: Aggregate visits by FarmerLocalId and StationId
        const visits = await FieldVisit_1.default.aggregate([
            {
                $match: {
                    StationId: { $in: StationIds },
                    CreatedDate: { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $group: {
                    _id: {
                        StationId: "$StationId",
                        FarmerLocalId: "$FarmerLocalId"
                    },
                    VisitCount: { $sum: 1 }
                }
            }
        ]);
        // Step 2: Update the station-wise summary based on visit counts
        for (const visit of visits) {
            const { StationId, FarmerLocalId } = visit._id;
            const visitCount = visit.VisitCount;
            // Initialize station data if not already present
            if (!stationWiseSummary[StationId]) {
                stationWiseSummary[StationId] = {};
            }
            // Initialize Visits level if not already present
            if (!stationWiseSummary[StationId][visitCount]) {
                stationWiseSummary[StationId][visitCount] = { TotalRecords: 0, WithSaleRecords: 0 };
            }
            // Increment total records for this visit level
            stationWiseSummary[StationId][visitCount].TotalRecords += 1;
            // Find SaleTransactions for the specific FarmerLocalId
            const salesTransactions = await SaleTransactions_1.default.aggregate([
                {
                    $match: {
                        FarmerLocalId,
                        CreatedDate: { $gte: fromDate, $lte: toDate },
                        TransactionType: 0
                    }
                },
                {
                    $group: {
                        _id: null,
                        SaleRecords: { $push: "$$ROOT" }
                    }
                }
            ]);
            // Check if there are any sales records
            if (salesTransactions.length > 0 && salesTransactions[0].SaleRecords.length > 0) {
                stationWiseSummary[StationId][visitCount].WithSaleRecords += 1;
            }
        }
        const outletNames = await Stations_1.default.find({ StationId: { $in: StationIds } }, { StationId: 1, OutletLegalName: 1 }).lean();
        // Transform summary object into array format
        const finalSummary = Object.entries(stationWiseSummary).map(([stationId, visitsData]) => {
            const visitSummary = Object.entries(visitsData).map(([visitLevel, counts]) => {
                const { TotalRecords, WithSaleRecords } = counts;
                return {
                    Visits: visitLevel,
                    TotalRecords,
                    WithSaleRecords,
                    Ratio: `${WithSaleRecords}/${TotalRecords}`,
                };
            });
            const outlet = outletNames.find(o => o.StationId === stationId);
            return {
                StationId: stationId,
                OutletLegalName: outlet ? outlet.OutletLegalName : null,
                VisitSummary: visitSummary,
            };
        });
        return res.json(finalSummary);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};
exports.getFieldVisitAndSalesRatio = getFieldVisitAndSalesRatio;
// export const getFieldVisitAndSalesRatio = async (req: Request, res: Response) => {
//     try {
//         // Extract parameters from request body
//         const { FromDate, ToDate, StationIds } = req.body;
//         // Validate input
//         if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
//             return res.status(400).send('Invalid input');
//         }
//         // Parse dates
//         const fromDate = moment(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
//         const toDate = moment(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
//         // Initialize station-wise summary with the defined type
//         const stationWiseSummary: StationWiseSummary = {};
//         const visits = await FarmerFieldVisit.aggregate([
//             {
//                 $match: {
//                     StationId: { $in: StationIds },
//                     CreatedDate: { $gte: fromDate, $lte: toDate }
//                 }
//             },
//             {
//                 $group: {
//                     _id: {
//                         StationId: "$StationId",
//                         Visits: { $sum: 1 },
//                         FarmerLocalId: "$FarmerLocalId",
//                     },
//                     VisitCount: { $sum: 1 }
//                 }
//             }
//         ]);
//         for (const visit of visits) {
//             const { StationId, Visits, FarmerLocalId } = visit._id;
//             // Initialize station data if not already present
//             if (!stationWiseSummary[StationId]) {
//                 stationWiseSummary[StationId] = {};
//             }
//             // Initialize Visits level if not already present
//             if (!stationWiseSummary[StationId][Visits]) {
//                 stationWiseSummary[StationId][Visits] = { TotalRecords: 0, WithSaleRecords: 0 };
//             }
//             // Find SaleTransactions for the specific FarmerLocalId and Visits date
//             const salesTransactions = await SaleTransactions.aggregate([
//                 {
//                     $match: {
//                         FarmerLocalId,
//                         CreatedDate: { $gte: fromDate, $lte: toDate },
//                         TransactionType: 0
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: null,
//                         TotalSalesValue: { $sum: "$TotalPrice" },
//                         SaleRecords: { $push: "$$ROOT" }
//                     }
//                 }
//             ]);
//             // Update station-wise summary with visit count and sales record count
//             stationWiseSummary[StationId][Visits].TotalRecords += 1;
//             if (salesTransactions.length > 0 && salesTransactions[0].SaleRecords.length > 0) {
//                 stationWiseSummary[StationId][Visits].WithSaleRecords += 1;
//             }
//         }
//         const outletNames = await Station.find({ StationId: { $in: StationIds } }, { StationId: 1, OutletLegalName: 1 }).lean();
//         // Transform summary object into array format
//         const finalSummary = Object.entries(stationWiseSummary).map(([stationId, visitsData]) => {
//             const visitSummary = Object.entries(visitsData).map(([visitLevel, counts]) => {
//                 const { TotalRecords, WithSaleRecords } = counts;
//                 return {
//                     Visits: visitLevel,
//                     TotalRecords,
//                     WithSaleRecords,
//                     Ratio: `${WithSaleRecords}/${TotalRecords}`,
//                 };
//             });
//             const outlet = outletNames.find(o => o.StationId === stationId);
//             return {
//                 StationId: stationId,
//                 OutletLegalName: outlet ? outlet.OutletLegalName : null,
//                 VisitSummary: visitSummary,
//             };
//         });
//         return res.json(finalSummary);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send('Internal Server Error');
//     }
// };
const getFieldVisitAndSalesData23Demo = async (req, res) => {
    try {
        // Extract parameters from request body
        const { FromDate, ToDate, StationIds } = req.body;
        // Validate input
        if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send('Invalid input');
        }
        // Parse dates
        const fromDate = (0, moment_1.default)(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
        // Aggregate to get visits and unique farmers
        const visits = await FieldVisit_1.default.aggregate([
            {
                $match: {
                    StationId: { $in: StationIds },
                    CreatedDate: { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $group: {
                    _id: {
                        CreatedBy: "$CreatedBy",
                        FarmerLocalId: "$FarmerLocalId",
                        VisitDate: { $dateToString: { format: "%Y-%m-%d", date: "$CreatedDate" } }
                    },
                    VisitCount: { $sum: 1 },
                    ScoutDetails: { $push: "$JsonData.Scout" }
                }
            },
            {
                $group: {
                    _id: {
                        CreatedBy: "$_id.CreatedBy",
                        FarmerLocalId: "$_id.FarmerLocalId"
                    },
                    NoOfVisitsCount: { $sum: 1 },
                    ScoutDetails: { $push: "$ScoutDetails" }
                }
            },
            {
                $group: {
                    _id: "$_id.CreatedBy",
                    UniqueFarmers: { $addToSet: "$_id.FarmerLocalId" },
                    Visits: { $sum: "$NoOfVisitsCount" },
                    ScoutDetails: { $push: "$ScoutDetails" }
                }
            }
        ]);
        // Prepare the response with additional sale transactions data
        const response = [];
        for (const visit of visits) {
            const salesTransactions = await SaleTransactions_1.default.aggregate([
                {
                    $match: {
                        FarmerLocalId: { $in: visit.UniqueFarmers },
                        CreatedDate: { $gte: fromDate, $lte: toDate },
                        TransactionType: 0
                    }
                },
                {
                    $group: {
                        _id: null,
                        TotalSalesValue: { $sum: "$TotalPrice" },
                        UniqueSalesFarmers: { $addToSet: "$FarmerLocalId" },
                        SaleRecords: { $push: "$$ROOT" }
                    }
                }
            ]).exec();
            const totalSalesValue = salesTransactions.length > 0 ? salesTransactions[0].TotalSalesValue : 0;
            const uniqueSalesFarmerCount = salesTransactions.length > 0 ? salesTransactions[0].UniqueSalesFarmers.length : 0;
            // Process sale records to remove _id and HeaderId
            const saleRecords = salesTransactions.length > 0 ? salesTransactions[0].SaleRecords.map((record) => {
                const { _id, HeaderId, ...rest } = record;
                return rest;
            }) : [];
            // Fetch station details based on FarmerLocalId from FarmerRegistration
            const farmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: visit.UniqueFarmers } }, { StationId: 1 }).lean();
            const stationIdsFromFarmers = farmerDetails.map(farmer => farmer.StationId);
            const stations = await Stations_1.default.find({ StationId: { $in: stationIdsFromFarmers } }, { StationId: 1, OutletLegalName: 1 }).lean();
            // Calculate ScoutCount and filter ScoutDetails with ScoutCount > 0
            const scoutDetails = visit.ScoutDetails.flat().filter((detail) => detail.length > 0).flat();
            const scoutCount = scoutDetails.length;
            response.push({
                Name: visit._id || 'Unknown',
                StationId: stations.length > 0 ? stations[0].StationId : 'Unknown',
                OutletLegalName: stations.length > 0 ? stations[0].OutletLegalName : 'Unknown',
                Visits: visit.Visits,
                UniqueFarmersCount: visit.UniqueFarmers.length,
                TotalSalesValue: totalSalesValue,
                UniqueSalesFarmerCount: uniqueSalesFarmerCount,
                SaleRecords: saleRecords,
                ScoutCount: scoutDetails.length > 0 ? scoutCount : 0,
                ScoutDetails: scoutDetails
            });
        }
        return res.json(response);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};
exports.getFieldVisitAndSalesData23Demo = getFieldVisitAndSalesData23Demo;
const getFieldVisitAndSalesData1Version = async (req, res) => {
    try {
        // Extract parameters from request body
        const { FromDate, ToDate, StationIds } = req.body;
        // Validate input
        if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send('Invalid input');
        }
        // Parse dates
        const fromDate = (0, moment_1.default)(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
        // Aggregate to get visits and unique farmers
        const visits = await FieldVisit_1.default.aggregate([
            {
                $match: {
                    StationId: { $in: StationIds },
                    CreatedDate: { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $addFields: {
                    ValidScoutCount: {
                        $size: {
                            $filter: {
                                input: "$JsonData.Scout",
                                as: "scout",
                                cond: { $ne: [{ $type: "$$scout" }, "null"] }
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        CreatedBy: "$CreatedBy",
                        FarmerLocalId: "$FarmerLocalId",
                        VisitDate: { $dateToString: { format: "%Y-%m-%d", date: "$CreatedDate" } }
                    },
                    VisitCount: { $sum: 1 },
                    ScoutDetails: { $push: "$JsonData.Scout" },
                    ScoutCount: { $sum: "$ValidScoutCount" }
                }
            },
            {
                $group: {
                    _id: {
                        CreatedBy: "$_id.CreatedBy",
                        FarmerLocalId: "$_id.FarmerLocalId"
                    },
                    NoOfVisitsCount: { $sum: 1 },
                    ScoutDetails: { $push: "$ScoutDetails" },
                    ScoutCount: { $sum: "$ScoutCount" }
                }
            },
            {
                $group: {
                    _id: "$_id.CreatedBy",
                    UniqueFarmers: { $addToSet: "$_id.FarmerLocalId" },
                    Visits: { $sum: "$NoOfVisitsCount" },
                    ScoutDetails: { $push: "$ScoutDetails" },
                    ScoutCount: { $sum: "$ScoutCount" }
                }
            }
        ]);
        // Prepare the response with additional sale transactions data
        const response = [];
        for (const visit of visits) {
            const salesTransactions = await SaleTransactions_1.default.aggregate([
                {
                    $match: {
                        FarmerLocalId: { $in: visit.UniqueFarmers },
                        CreatedDate: { $gte: fromDate, $lte: toDate },
                        TransactionType: 0
                    }
                },
                {
                    $group: {
                        _id: null,
                        TotalSalesValue: { $sum: "$TotalPrice" },
                        UniqueSalesFarmers: { $addToSet: "$FarmerLocalId" },
                        SaleRecords: { $push: "$$ROOT" }
                    }
                }
            ]).exec();
            const totalSalesValue = salesTransactions.length > 0 ? salesTransactions[0].TotalSalesValue : 0;
            const uniqueSalesFarmerCount = salesTransactions.length > 0 ? salesTransactions[0].UniqueSalesFarmers.length : 0;
            // Process sale records to remove _id and HeaderId
            const saleRecords = salesTransactions.length > 0 ? salesTransactions[0].SaleRecords.map((record) => {
                const { _id, HeaderId, ...rest } = record;
                return rest;
            }) : [];
            // Fetch station details based on FarmerLocalId from FarmerRegistration
            const farmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: visit.UniqueFarmers } }, { StationId: 1 }).lean();
            const stationIdsFromFarmers = farmerDetails.map(farmer => farmer.StationId);
            const stations = await Stations_1.default.find({ StationId: { $in: stationIdsFromFarmers } }, { StationId: 1, OutletLegalName: 1 }).lean();
            // Flatten ScoutDetails array for each visit
            const scoutDetails = visit.ScoutDetails.flat(2);
            response.push({
                Name: visit._id || 'Unknown',
                StationId: stations.length > 0 ? stations[0].StationId : 'Unknown',
                OutletLegalName: stations.length > 0 ? stations[0].OutletLegalName : 'Unknown',
                Visits: visit.Visits,
                UniqueFarmersCount: visit.UniqueFarmers.length,
                TotalSalesValue: totalSalesValue,
                UniqueSalesFarmerCount: uniqueSalesFarmerCount,
                SaleRecords: saleRecords,
                ScoutCount: visit.ScoutCount,
                ScoutDetails: scoutDetails
            });
        }
        return res.json(response);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};
exports.getFieldVisitAndSalesData1Version = getFieldVisitAndSalesData1Version;
const getFieldVisitAndSalesData2Version = async (req, res) => {
    try {
        // Extract parameters from request body
        const { FromDate, ToDate, StationIds } = req.body;
        // Validate input
        if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send('Invalid input');
        }
        // Parse dates
        const fromDate = (0, moment_1.default)(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
        // Aggregate to get visits and unique farmers
        const visits = await FieldVisit_1.default.aggregate([
            {
                $match: {
                    StationId: { $in: StationIds },
                    CreatedDate: { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $addFields: {
                    ValidScoutCount: {
                        $size: {
                            $filter: {
                                input: "$JsonData.Scout",
                                as: "scout",
                                cond: { $ne: [{ $type: "$$scout" }, "null"] }
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        CreatedBy: "$CreatedBy",
                        FarmerLocalId: "$FarmerLocalId",
                        VisitDate: { $dateToString: { format: "%Y-%m-%d", date: "$CreatedDate" } }
                    },
                    VisitCount: { $sum: 1 },
                    ScoutDetails: { $push: { FarmerLocalId: "$FarmerLocalId", Scout: "$JsonData.Scout" } },
                    ScoutCount: { $sum: "$ValidScoutCount" }
                }
            },
            {
                $group: {
                    _id: {
                        CreatedBy: "$_id.CreatedBy",
                        FarmerLocalId: "$_id.FarmerLocalId"
                    },
                    NoOfVisitsCount: { $sum: 1 },
                    ScoutDetails: { $push: "$ScoutDetails" },
                    ScoutCount: { $sum: "$ScoutCount" }
                }
            },
            {
                $group: {
                    _id: "$_id.CreatedBy",
                    UniqueFarmers: { $addToSet: "$_id.FarmerLocalId" },
                    Visits: { $sum: "$NoOfVisitsCount" },
                    ScoutDetails: { $push: "$ScoutDetails" },
                    ScoutCount: { $sum: "$ScoutCount" }
                }
            }
        ]);
        // Prepare the response with additional sale transactions data
        const response = [];
        for (const visit of visits) {
            const salesTransactions = await SaleTransactions_1.default.aggregate([
                {
                    $match: {
                        FarmerLocalId: { $in: visit.UniqueFarmers },
                        CreatedDate: { $gte: fromDate, $lte: toDate },
                        TransactionType: 0
                    }
                },
                {
                    $group: {
                        _id: null,
                        TotalSalesValue: { $sum: "$TotalPrice" },
                        UniqueSalesFarmers: { $addToSet: "$FarmerLocalId" },
                        SaleRecords: { $push: "$$ROOT" }
                    }
                }
            ]).exec();
            const totalSalesValue = salesTransactions.length > 0 ? salesTransactions[0].TotalSalesValue : 0;
            const uniqueSalesFarmerCount = salesTransactions.length > 0 ? salesTransactions[0].UniqueSalesFarmers.length : 0;
            // Process sale records to remove _id and HeaderId
            const saleRecords = salesTransactions.length > 0 ? salesTransactions[0].SaleRecords.map((record) => {
                const { _id, HeaderId, ...rest } = record;
                return rest;
            }) : [];
            // Fetch station details based on FarmerLocalId from FarmerRegistration
            const farmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: visit.UniqueFarmers } }, { StationId: 1 }).lean();
            const stationIdsFromFarmers = farmerDetails.map(farmer => farmer.StationId);
            const stations = await Stations_1.default.find({ StationId: { $in: stationIdsFromFarmers } }, { StationId: 1, OutletLegalName: 1 }).lean();
            // Flatten ScoutDetails array for each visit and include FarmerLocalId
            const scoutDetails = visit.ScoutDetails.flat(2).map((detail) => {
                return detail.Scout.map((scout) => ({
                    FarmerLocalId: detail.FarmerLocalId,
                    ...scout
                }));
            }).flat();
            response.push({
                Name: visit._id || 'Unknown',
                StationId: stations.length > 0 ? stations[0].StationId : 'Unknown',
                OutletLegalName: stations.length > 0 ? stations[0].OutletLegalName : 'Unknown',
                Visits: visit.Visits,
                UniqueFarmersCount: visit.UniqueFarmers.length,
                TotalSalesValue: totalSalesValue,
                UniqueSalesFarmerCount: uniqueSalesFarmerCount,
                SaleRecords: saleRecords,
                ScoutCount: visit.ScoutCount,
                ScoutDetails: scoutDetails
            });
        }
        return res.json(response);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};
exports.getFieldVisitAndSalesData2Version = getFieldVisitAndSalesData2Version;
const getFieldVisitAndSalesDataFinalVersion = async (req, res) => {
    try {
        // Extract parameters from request body
        const { FromDate, ToDate, StationIds } = req.body;
        // Validate input
        if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send('Invalid input');
        }
        // Parse dates
        const fromDate = (0, moment_1.default)(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
        // Aggregate to get visits and unique farmers
        const visits = await FieldVisit_1.default.aggregate([
            {
                $match: {
                    StationId: { $in: StationIds },
                    CreatedDate: { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $addFields: {
                    ValidScoutCount: {
                        $size: {
                            $filter: {
                                input: { $ifNull: ["$JsonData.Scout", []] },
                                as: "scout",
                                cond: { $ne: [{ $type: "$$scout" }, "null"] }
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        CreatedBy: "$CreatedBy",
                        FarmerLocalId: "$FarmerLocalId",
                        VisitDate: { $dateToString: { format: "%Y-%m-%d", date: "$CreatedDate" } }
                    },
                    VisitCount: { $sum: 1 },
                    ScoutDetails: { $push: { FarmerLocalId: "$FarmerLocalId", Scout: "$JsonData.Scout" } },
                    ScoutCount: { $sum: "$ValidScoutCount" }
                }
            },
            {
                $group: {
                    _id: {
                        CreatedBy: "$_id.CreatedBy",
                        FarmerLocalId: "$_id.FarmerLocalId"
                    },
                    NoOfVisitsCount: { $sum: 1 },
                    ScoutDetails: { $push: "$ScoutDetails" },
                    ScoutCount: { $sum: "$ScoutCount" }
                }
            },
            {
                $group: {
                    _id: "$_id.CreatedBy",
                    UniqueFarmers: { $addToSet: "$_id.FarmerLocalId" },
                    Visits: { $sum: "$NoOfVisitsCount" },
                    ScoutDetails: { $push: "$ScoutDetails" },
                    ScoutCount: { $sum: "$ScoutCount" }
                }
            }
        ]);
        // Prepare the response with additional sale transactions data
        const response = [];
        for (const visit of visits) {
            const salesTransactions = await SaleTransactions_1.default.aggregate([
                {
                    $match: {
                        FarmerLocalId: { $in: visit.UniqueFarmers },
                        CreatedDate: { $gte: fromDate, $lte: toDate },
                        TransactionType: 0
                    }
                },
                {
                    $group: {
                        _id: null,
                        TotalSalesValue: { $sum: "$TotalPrice" },
                        UniqueSalesFarmers: { $addToSet: "$FarmerLocalId" },
                        SaleRecords: { $push: "$$ROOT" }
                    }
                }
            ]).exec();
            const totalSalesValue = salesTransactions.length > 0 ? salesTransactions[0].TotalSalesValue : 0;
            const uniqueSalesFarmerCount = salesTransactions.length > 0 ? salesTransactions[0].UniqueSalesFarmers.length : 0;
            // Process sale records to remove _id and HeaderId
            const saleRecords = salesTransactions.length > 0 ? salesTransactions[0].SaleRecords.map((record) => {
                const { _id, HeaderId, ...rest } = record;
                return rest;
            }) : [];
            // Fetch station details based on FarmerLocalId from FarmerRegistration
            const farmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: visit.UniqueFarmers } }, { StationId: 1 }).lean();
            const stationIdsFromFarmers = farmerDetails.map(farmer => farmer.StationId);
            const stations = await Stations_1.default.find({ StationId: { $in: stationIdsFromFarmers } }, { StationId: 1, OutletLegalName: 1 }).lean();
            response.push({
                Name: visit._id || 'Unknown',
                StationId: stations.length > 0 ? stations[0].StationId : 'Unknown',
                OutletLegalName: stations.length > 0 ? stations[0].OutletLegalName : 'Unknown',
                Visits: visit.Visits,
                UniqueFarmersCount: visit.UniqueFarmers.length,
                TotalSalesValue: totalSalesValue,
                UniqueSalesFarmerCount: uniqueSalesFarmerCount,
                SaleRecords: saleRecords,
                ScoutCount: visit.ScoutCount,
            });
        }
        return res.json(response);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};
exports.getFieldVisitAndSalesDataFinalVersion = getFieldVisitAndSalesDataFinalVersion;
const getFieldVisitAndSalesData = async (req, res) => {
    try {
        // Extract parameters from request body
        const { FromDate, ToDate, StationIds } = req.body;
        // Validate input
        if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send('Invalid input');
        }
        // Parse dates
        const fromDate = (0, moment_1.default)(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
        // Aggregate to get visits and unique farmers
        const visits = await FieldVisit_1.default.aggregate([
            {
                $match: {
                    StationId: { $in: StationIds },
                    CreatedDate: { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $addFields: {
                    ValidScoutCount: {
                        $size: {
                            $filter: {
                                input: { $ifNull: ["$JsonData.Scout", []] },
                                as: "scout",
                                cond: { $ne: [{ $type: "$$scout" }, "null"] }
                            }
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        CreatedBy: "$CreatedBy",
                        FarmerLocalId: "$FarmerLocalId",
                        VisitDate: { $dateToString: { format: "%Y-%m-%d", date: "$CreatedDate" } }
                    },
                    VisitCount: { $sum: 1 },
                    ScoutDetails: { $push: { FarmerLocalId: "$FarmerLocalId", Scout: "$JsonData.Scout" } },
                    ScoutCount: { $sum: "$ValidScoutCount" }
                }
            },
            {
                $group: {
                    _id: {
                        CreatedBy: "$_id.CreatedBy",
                        FarmerLocalId: "$_id.FarmerLocalId"
                    },
                    NoOfVisitsCount: { $sum: 1 },
                    ScoutDetails: { $push: "$ScoutDetails" },
                    ScoutCount: { $sum: "$ScoutCount" }
                }
            },
            {
                $group: {
                    _id: "$_id.CreatedBy",
                    UniqueFarmers: { $addToSet: "$_id.FarmerLocalId" },
                    Visits: { $sum: "$NoOfVisitsCount" },
                    ScoutDetails: { $push: "$ScoutDetails" },
                    ScoutCount: { $sum: "$ScoutCount" },
                    NoOfRecordsHavingScoutGreaterThanZero: { $sum: { $cond: [{ $gt: ["$ScoutCount", 0] }, 1, 0] } } // Count records having ScoutCount > 0
                }
            }
        ]);
        // Prepare the response with additional sale transactions data
        const response = [];
        for (const visit of visits) {
            const salesTransactions = await SaleTransactions_1.default.aggregate([
                {
                    $match: {
                        FarmerLocalId: { $in: visit.UniqueFarmers },
                        CreatedDate: { $gte: fromDate, $lte: toDate },
                        TransactionType: 0
                    }
                },
                {
                    $group: {
                        _id: null,
                        TotalSalesValue: { $sum: "$TotalPrice" },
                        UniqueSalesFarmers: { $addToSet: "$FarmerLocalId" },
                        SaleRecords: { $push: "$$ROOT" }
                    }
                }
            ]).exec();
            const totalSalesValue = salesTransactions.length > 0 ? salesTransactions[0].TotalSalesValue : 0;
            const uniqueSalesFarmerCount = salesTransactions.length > 0 ? salesTransactions[0].UniqueSalesFarmers.length : 0;
            // Process sale records to remove _id and HeaderId
            const saleRecords = salesTransactions.length > 0 ? salesTransactions[0].SaleRecords.map((record) => {
                const { _id, HeaderId, ...rest } = record;
                return rest;
            }) : [];
            // Fetch station details based on FarmerLocalId from FarmerRegistration
            const farmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: visit.UniqueFarmers } }, { StationId: 1 }).lean();
            const stationIdsFromFarmers = farmerDetails.map(farmer => farmer.StationId);
            const stations = await Stations_1.default.find({ StationId: { $in: stationIdsFromFarmers } }, { StationId: 1, OutletLegalName: 1 }).lean();
            response.push({
                Name: visit._id || 'Unknown',
                StationId: stations.length > 0 ? stations[0].StationId : 'Unknown',
                OutletLegalName: stations.length > 0 ? stations[0].OutletLegalName : 'Unknown',
                Visits: visit.Visits,
                UniqueFarmersCount: visit.UniqueFarmers.length,
                TotalSalesValue: totalSalesValue,
                UniqueSalesFarmerCount: uniqueSalesFarmerCount,
                SaleRecords: saleRecords,
                ScoutCount: visit.ScoutCount,
                NoOfRecordsHavingScoutGreaterThanZero: visit.NoOfRecordsHavingScoutGreaterThanZero
            });
        }
        return res.json(response);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};
exports.getFieldVisitAndSalesData = getFieldVisitAndSalesData;
const getFieldVisitAndSalesDataOriginal = async (req, res) => {
    try {
        // Extract parameters from request body
        const { FromDate, ToDate, StationIds } = req.body;
        // Validate input
        if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send('Invalid input');
        }
        // Parse dates
        const fromDate = (0, moment_1.default)(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
        // Aggregate to get visits and unique farmers
        const visits = await FieldVisit_1.default.aggregate([
            {
                $match: {
                    StationId: { $in: StationIds },
                    CreatedDate: { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $group: {
                    _id: {
                        CreatedBy: "$CreatedBy",
                        FarmerLocalId: "$FarmerLocalId",
                        VisitDate: { $dateToString: { format: "%Y-%m-%d", date: "$CreatedDate" } }
                    },
                    VisitCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: {
                        CreatedBy: "$_id.CreatedBy",
                        FarmerLocalId: "$_id.FarmerLocalId"
                    },
                    NoOfVisitsCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.CreatedBy",
                    UniqueFarmers: { $addToSet: "$_id.FarmerLocalId" },
                    Visits: { $sum: "$NoOfVisitsCount" }
                }
            }
        ]);
        // Prepare the response with additional sale transactions data
        const response = [];
        for (const visit of visits) {
            const salesTransactions = await SaleTransactions_1.default.aggregate([
                {
                    $match: {
                        FarmerLocalId: { $in: visit.UniqueFarmers },
                        CreatedDate: { $gte: fromDate, $lte: toDate },
                        TransactionType: 0
                    }
                },
                {
                    $group: {
                        _id: null,
                        TotalSalesValue: { $sum: "$TotalPrice" },
                        UniqueSalesFarmers: { $addToSet: "$FarmerLocalId" },
                        SaleRecords: { $push: "$$ROOT" }
                    }
                }
            ]).exec();
            const totalSalesValue = salesTransactions.length > 0 ? salesTransactions[0].TotalSalesValue : 0;
            const uniqueSalesFarmerCount = salesTransactions.length > 0 ? salesTransactions[0].UniqueSalesFarmers.length : 0;
            // Process sale records to remove _id and HeaderId
            const saleRecords = salesTransactions.length > 0 ? salesTransactions[0].SaleRecords.map((record) => {
                const { _id, HeaderId, ...rest } = record;
                return rest;
            }) : [];
            // Fetch station details based on FarmerLocalId from FarmerRegistration
            const farmerDetails = await FarmerRegistration_1.default.find({ FarmerLocalId: { $in: visit.UniqueFarmers } }, { StationId: 1 }).lean();
            const stationIdsFromFarmers = farmerDetails.map(farmer => farmer.StationId);
            const stations = await Stations_1.default.find({ StationId: { $in: stationIdsFromFarmers } }, { StationId: 1, OutletLegalName: 1 }).lean();
            response.push({
                Name: visit._id || 'Unknown',
                StationId: stations.length > 0 ? stations[0].StationId : 'Unknown',
                OutletLegalName: stations.length > 0 ? stations[0].OutletLegalName : 'Unknown',
                Visits: visit.Visits,
                UniqueFarmersCount: visit.UniqueFarmers.length,
                TotalSalesValue: totalSalesValue,
                UniqueSalesFarmerCount: uniqueSalesFarmerCount,
                SaleRecords: saleRecords
            });
        }
        return res.json(response);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};
exports.getFieldVisitAndSalesDataOriginal = getFieldVisitAndSalesDataOriginal;
const getStationWiseUniqueVisits = async (req, res) => {
    try {
        // Extract parameters from request body
        const { FromDate, ToDate, StationIds } = req.body;
        // Validate input
        if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send('Invalid input');
        }
        // Parse dates
        const fromDate = (0, moment_1.default)(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
        // Aggregate to get station-wise unique visit count and unique farmer count
        const visits = await FieldVisit_1.default.aggregate([
            {
                $match: {
                    StationId: { $in: StationIds },
                    CreatedDate: { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $group: {
                    _id: {
                        StationId: "$StationId",
                        FarmerLocalId: "$FarmerLocalId",
                        VisitDate: { $dateToString: { format: "%Y-%m-%d", date: "$CreatedDate" } }
                    },
                    VisitCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: {
                        StationId: "$_id.StationId",
                        FarmerLocalId: "$_id.FarmerLocalId"
                    },
                    NoOfVisitsCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.StationId",
                    UniqueFarmerLocalIds: { $addToSet: "$_id.FarmerLocalId" },
                    UniqueFarmerCount: { $sum: 1 },
                    NoOfVisitsCount: { $sum: "$NoOfVisitsCount" }
                }
            },
            {
                $lookup: {
                    from: "Station", // The name of the collection containing outlet names
                    localField: "_id",
                    foreignField: "StationId",
                    as: "stationDetails"
                }
            },
            {
                $unwind: {
                    path: "$stationDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    StationId: "$_id",
                    UniqueFarmerLocalIds: 1,
                    UniqueFarmerCount: 1,
                    NoOfVisitsCount: 1,
                    OutletLegalName: { $ifNull: ["$stationDetails.OutletLegalName", "Unknown"] }
                }
            },
            {
                $sort: {
                    StationId: 1 // Sort by StationId in ascending order
                }
            }
        ]);
        // Prepare the response with additional sale transactions data
        const response = [];
        for (const visit of visits) {
            const saleTransactions = await SaleTransactions_1.default.aggregate([
                {
                    $match: {
                        StationId: visit.StationId,
                        FarmerLocalId: { $in: visit.UniqueFarmerLocalIds },
                        CreatedDate: { $gte: fromDate, $lte: toDate },
                        TransactionType: 0
                    }
                },
                {
                    $group: {
                        _id: null,
                        TotalSalesValue: { $sum: "$TotalPrice" },
                        UniqueSalesFarmerCount: { $addToSet: "$FarmerLocalId" }
                    }
                }
            ]);
            const totalSalesValue = saleTransactions.length > 0 ? saleTransactions[0].TotalSalesValue : 0;
            const uniqueSalesFarmerCount = saleTransactions.length > 0 ? saleTransactions[0].UniqueSalesFarmerCount.length : 0;
            response.push({
                StationId: visit.StationId,
                UniqueFarmerCount: visit.UniqueFarmerCount,
                NoOfVisitsCount: visit.NoOfVisitsCount,
                OutletLegalName: visit.OutletLegalName,
                TotalSalesValue: totalSalesValue,
                UniqueSalesFarmerCount: uniqueSalesFarmerCount
            });
        }
        return res.json(response);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};
exports.getStationWiseUniqueVisits = getStationWiseUniqueVisits;
const getFieldVisitStationUserRatio = async (req, res) => {
    try {
        const { FromDate, ToDate, StationIds } = req.body;
        if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).json({ error: 'Invalid input' });
        }
        const fromDate = (0, moment_1.default)(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
        const visits = await FieldVisit_1.default.aggregate([
            {
                $match: {
                    StationId: { $in: StationIds },
                    CreatedDate: { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $group: {
                    _id: { StationId: "$StationId", CreatedBy: "$CreatedBy", VisitLevel: "$VisitLevel" },
                    TotalRecords: { $sum: 1 },
                    UniqueFarmers: { $addToSet: "$FarmerLocalId" }
                }
            }
        ]);
        const response = [];
        for (const visit of visits) {
            const stationId = visit._id.StationId;
            const createdBy = visit._id.CreatedBy;
            const visitCount = visit.TotalRecords;
            const uniqueFarmers = visit.UniqueFarmers;
            const uniqueFarmersCount = uniqueFarmers.length;
            let stationEntry = response.find(entry => entry.StationId === stationId);
            if (!stationEntry) {
                stationEntry = {
                    StationId: stationId,
                    OutletLegalName: "",
                    CreatedBySummary: []
                };
                response.push(stationEntry);
            }
            let createdByEntry = stationEntry.CreatedBySummary.find(entry => entry.CreatedBy === createdBy);
            if (!createdByEntry) {
                createdByEntry = {
                    CreatedBy: createdBy,
                    VisitSummary: []
                };
                stationEntry.CreatedBySummary.push(createdByEntry);
            }
            const farmerVisitCounts = await FieldVisit_1.default.aggregate([
                {
                    $match: {
                        FarmerLocalId: { $in: uniqueFarmers },
                        StationId: stationId,
                        CreatedDate: { $gte: fromDate, $lte: toDate }
                    }
                },
                {
                    $group: {
                        _id: { FarmerLocalId: "$FarmerLocalId", VisitLevel: "$VisitLevel" },
                        NoOfVisits: { $sum: 1 }
                    }
                }
            ]);
            const salesTransactions = await SaleTransactions_1.default.aggregate([
                {
                    $match: {
                        FarmerLocalId: { $in: uniqueFarmers },
                        CreatedDate: { $gte: fromDate, $lte: toDate },
                        TransactionType: 0
                    }
                },
                {
                    $group: {
                        _id: "$FarmerLocalId",
                        TotalSales: { $sum: "$TotalPrice" }
                    }
                }
            ]);
            const withSaleRecords = salesTransactions.length;
            const ratio = `${withSaleRecords}/${uniqueFarmersCount}`;
            createdByEntry.VisitSummary.push({
                VisitLevel: visit._id.VisitLevel,
                Visits: visitCount.toString(),
                TotalRecords: visit.TotalRecords,
                WithSaleRecords: withSaleRecords,
                Ratio: ratio,
                UniqueFarmersCount: uniqueFarmersCount
            });
        }
        const stationDetails = await Stations_1.default.find({ StationId: { $in: StationIds } }, { StationId: 1, OutletLegalName: 1 }).lean();
        for (const station of response) {
            const details = stationDetails.find(detail => detail.StationId === station.StationId);
            if (details) {
                station.OutletLegalName = details.OutletLegalName;
            }
        }
        return res.json(response);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getFieldVisitStationUserRatio = getFieldVisitStationUserRatio;
const getStationVillageWiseUniqueVisits101 = async (req, res) => {
    try {
        // Extract parameters from request body
        const { FromDate, ToDate, StationIds } = req.body;
        // Validate input
        if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send('Invalid input');
        }
        // Parse dates
        const fromDate = (0, moment_1.default)(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
        // Aggregate visits by village and farmer
        const visitsAggregation = await FieldVisit_1.default.aggregate([
            {
                $match: {
                    StationId: { $in: StationIds },
                    CreatedDate: { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $lookup: {
                    from: 'FarmerRegistration',
                    localField: 'FarmerLocalId',
                    foreignField: 'FarmerLocalId',
                    as: 'farmerDetails'
                }
            },
            {
                $unwind: {
                    path: '$farmerDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    VillageName: '$farmerDetails.VillageValue',
                    FarmerLocalId: '$FarmerLocalId',
                    CreatedBy: '$CreatedBy',
                    VisitDate: { $dateToString: { format: "%Y-%m-%d", date: "$CreatedDate" } }
                }
            },
            {
                $group: {
                    _id: {
                        VillageName: '$VillageName',
                        FarmerLocalId: '$FarmerLocalId',
                        VisitDate: '$VisitDate'
                    },
                    VisitsCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: {
                        VillageName: '$_id.VillageName',
                        FarmerLocalId: '$_id.FarmerLocalId'
                    },
                    UniqueVisitsPerDayCount: { $sum: 1 },
                    CreatedBy: { $first: '$CreatedBy' }
                }
            }
        ]);
        // Prepare the response with additional sale transactions data
        const response = [];
        for (const visit of visitsAggregation) {
            const salesTransactions = await SaleTransactions_1.default.aggregate([
                {
                    $match: {
                        FarmerLocalId: visit._id.FarmerLocalId,
                        CreatedDate: { $gte: fromDate, $lte: toDate },
                        TransactionType: 0
                    }
                },
                {
                    $group: {
                        _id: null,
                        TotalSalesValue: { $sum: "$TotalPrice" },
                        UniqueSaleFarmersCount: { $addToSet: "$FarmerLocalId" },
                        SaleRecords: { $push: "$$ROOT" }
                    }
                }
            ]);
            const totalSalesValue = salesTransactions.length > 0 ? salesTransactions[0].TotalSalesValue : 0;
            const uniqueSaleFarmersCount = salesTransactions.length > 0 ? salesTransactions[0].UniqueSaleFarmersCount.length : 0;
            // Process sale records to remove _id and HeaderId
            const saleRecords = salesTransactions.length > 0 ? salesTransactions[0].SaleRecords.map((record) => {
                const { _id, HeaderId, ...rest } = record;
                return rest;
            }) : [];
            response.push({
                VillageName: visit._id.VillageName || 'Unknown',
                FarmerLocalId: visit._id.FarmerLocalId,
                UniqueFarmerCount: visit.UniqueVisitsPerDayCount,
                VisitsCount: visit.UniqueVisitsPerDayCount, // Renamed to match requested field
                TotalSalesValue: totalSalesValue,
                UniqueSaleFarmersCount: uniqueSaleFarmersCount,
                SaleRecords: saleRecords
            });
        }
        return res.json(response);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};
exports.getStationVillageWiseUniqueVisits101 = getStationVillageWiseUniqueVisits101;
const getStationVillageWiseUniqueVisits = async (req, res) => {
    try {
        // Extract parameters from request body
        const { FromDate, ToDate, StationIds } = req.body;
        // Validate input
        if (!FromDate || !ToDate || !Array.isArray(StationIds) || StationIds.length === 0) {
            return res.status(400).send('Invalid input');
        }
        // Parse dates
        const fromDate = (0, moment_1.default)(FromDate, 'DD-MM-YYYY').startOf('day').toDate();
        const toDate = (0, moment_1.default)(ToDate, 'DD-MM-YYYY').endOf('day').toDate();
        // Aggregate visits by village and farmer
        const visitsAggregation = await FieldVisit_1.default.aggregate([
            {
                $match: {
                    StationId: { $in: StationIds },
                    CreatedDate: { $gte: fromDate, $lte: toDate }
                }
            },
            {
                $lookup: {
                    from: 'FarmerRegistration',
                    localField: 'FarmerLocalId',
                    foreignField: 'FarmerLocalId',
                    as: 'farmerDetails'
                }
            },
            {
                $unwind: {
                    path: '$farmerDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    VillageName: '$farmerDetails.VillageValue',
                    FarmerLocalId: '$FarmerLocalId',
                    CreatedDate: { $dateToString: { format: "%Y-%m-%d", date: "$CreatedDate" } }
                }
            },
            {
                $group: {
                    _id: {
                        VillageName: '$VillageName',
                        CreatedDate: '$CreatedDate'
                    },
                    UniqueFarmerCount: { $addToSet: '$FarmerLocalId' }
                }
            },
            {
                $project: {
                    VillageName: '$_id.VillageName',
                    Date: '$_id.CreatedDate',
                    UniqueFarmerCount: { $size: '$UniqueFarmerCount' }
                }
            },
            {
                $group: {
                    _id: '$VillageName',
                    UniqueFarmerCount: { $sum: '$UniqueFarmerCount' }
                }
            }
        ]);
        // Prepare the response with additional sales data
        const response = [];
        for (const visit of visitsAggregation) {
            const salesTransactions = await SaleTransactions_1.default.aggregate([
                {
                    $match: {
                        VillageName: visit._id,
                        CreatedDate: { $gte: fromDate, $lte: toDate },
                        TransactionType: 0
                    }
                },
                {
                    $group: {
                        _id: null,
                        TotalSalesValue: { $sum: "$TotalPrice" },
                        UniqueSaleFarmersCount: { $addToSet: "$FarmerLocalId" }
                    }
                }
            ]);
            const totalSalesValue = salesTransactions.length > 0 ? salesTransactions[0].TotalSalesValue : 0;
            const uniqueSaleFarmersCount = salesTransactions.length > 0 ? salesTransactions[0].UniqueSaleFarmersCount.length : 0;
            response.push({
                VillageName: visit._id || 'Unknown',
                UniqueFarmerCount: visit.UniqueFarmerCount,
                TotalSalesValue: totalSalesValue,
                UniqueSaleFarmersCount: uniqueSaleFarmersCount
            });
        }
        return res.json(response);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
};
exports.getStationVillageWiseUniqueVisits = getStationVillageWiseUniqueVisits;
exports.default = router;
