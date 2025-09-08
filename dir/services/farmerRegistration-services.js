"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmersOnMap = exports.FarmerFarmerCropsandVisits = exports.FarmerFarmerCrops = exports.getRegisterFarmersDetails = void 0;
const express_1 = __importDefault(require("express"));
const FarmerRegistration_1 = __importDefault(require("../models/FarmerRegistration"));
const FarmerCrop_1 = __importDefault(require("../models/FarmerCrop"));
const FieldVisit_1 = __importDefault(require("../models/FieldVisit"));
const Stations_1 = __importDefault(require("../models/Stations"));
const router = express_1.default.Router();
const getRegisterFarmersDetails = async (req, res) => {
    try {
        const alldata = await FarmerRegistration_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getRegisterFarmersDetails = getRegisterFarmersDetails;
// export const FarmerFarmerCrops = async (req: Request, res: Response) => {
//     try {
//         // Fetch all farmers excluding _id and JsonData fields
//         const farmers = await FarmerRegistration.find().select('-_id -JsonData').lean();
//         // Extract FarmerLocalIds from the fetched farmers
//         const farmerIds = farmers.map(farmer => farmer.FarmerLocalId);
//         // Fetch crops associated with the farmerIds
//         const crops = await FarmerCrop.find({ FarmerLocalId: { $in: farmerIds } })
//             .select('-_id -JsonData')
//             .lean();
//         // Map farmers to their crops
//         const farmerDetails = farmers.map(farmer => {
//             const farmerCrops = crops.filter(crop => crop.FarmerLocalId === farmer.FarmerLocalId);
//             if (farmerCrops.length === 0) {
//                 // Return farmer with null crop fields
//                 return {
//                     ...farmer,
//                     FarmerCropLocalId: null,
//                     Crop: null,
//                     CropValue: null,
//                     Acres: null,
//                     SeedVariety: null,
//                     CropStatus: null,
//                     CropStatusValue: null,
//                     CropPhoto1: null,
//                     CropPhoto2: null,
//                     CropPhoto3: null,
//                     CropPhoto4: null,
//                     CropPhoto5: null,
//                     CropPhotoOrg1: null,
//                     CropPhotoOrg2: null,
//                     CropPhotoOrg3: null,
//                     CropPhotoOrg4: null,
//                     CropPhotoOrg5: null,
//                     IsSync: null,
//                     LocalCreatedDate: null
//                 };
//             }
//             // Combine farmer with each crop
//             return farmerCrops.map(crop => ({
//                 ...farmer,
//                 ...crop,
//                 FarmerCropLocalId: crop.FarmerCropLocalId,
//                 Crop: crop.Crop,
//                 CropValue: crop.CropValue,
//                 Acres: crop.Acres,
//                 SeedVariety: crop.SeedVariety,
//                 CropStatus: crop.CropStatus,
//                 CropStatusValue: crop.CropStatusValue,
//                 CropPhoto1: crop.CropPhoto1,
//                 CropPhoto2: crop.CropPhoto2,
//                 CropPhoto3: crop.CropPhoto3,
//                 CropPhoto4: crop.CropPhoto4,
//                 CropPhoto5: crop.CropPhoto5,
//                 CropPhotoOrg1: crop.CropPhotoOrg1,
//                 CropPhotoOrg2: crop.CropPhotoOrg2,
//                 CropPhotoOrg3: crop.CropPhotoOrg3,
//                 CropPhotoOrg4: crop.CropPhotoOrg4,
//                 CropPhotoOrg5: crop.CropPhotoOrg5,
//                 IsSync: crop.IsSync,
//                 LocalCreatedDate: crop.LocalCreatedDate
//             }));
//         }).flat(); // Flatten the array of arrays
//         return res.json(farmerDetails);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error");
//     }
// };
const FarmerFarmerCrops = async (req, res) => {
    try {
        // Fetch all farmers excluding _id and JsonData fields
        const farmers = await FarmerRegistration_1.default.find().select('-_id -JsonData').lean();
        // Extract FarmerLocalIds and StationIds from the fetched farmers
        const farmerIds = farmers.map(farmer => farmer.FarmerLocalId);
        const stationIds = farmers.map(farmer => farmer.StationId);
        // Fetch crops associated with the farmerIds
        const crops = await FarmerCrop_1.default.find({ FarmerLocalId: { $in: farmerIds } })
            .select('-_id -JsonData')
            .lean();
        // Fetch stations associated with the stationIds
        const stations = await Stations_1.default.find({ StationId: { $in: stationIds } })
            .select('StationId OutletLegalName')
            .lean();
        // Map farmers to their crops and include OutletLegalName
        const farmerDetails = farmers.map(farmer => {
            const farmerCrops = crops.filter(crop => crop.FarmerLocalId === farmer.FarmerLocalId);
            const station = stations.find(station => station.StationId === farmer.StationId);
            const outletLegalName = station ? station.OutletLegalName : null;
            if (farmerCrops.length === 0) {
                // Return farmer with null crop fields
                return {
                    ...farmer,
                    OutletLegalName: outletLegalName,
                    FarmerCropLocalId: null,
                    Crop: null,
                    CropValue: null,
                    Acres: null,
                    SeedVariety: null,
                    CropStatus: null,
                    CropStatusValue: null,
                    CropPhoto1: null,
                    CropPhoto2: null,
                    CropPhoto3: null,
                    CropPhoto4: null,
                    CropPhoto5: null,
                    CropPhotoOrg1: null,
                    CropPhotoOrg2: null,
                    CropPhotoOrg3: null,
                    CropPhotoOrg4: null,
                    CropPhotoOrg5: null,
                    IsSync: null,
                    LocalCreatedDate: null
                };
            }
            // Combine farmer with each crop
            return farmerCrops.map(crop => ({
                ...farmer,
                OutletLegalName: outletLegalName,
                ...crop,
                FarmerCropLocalId: crop.FarmerCropLocalId,
                Crop: crop.Crop,
                CropValue: crop.CropValue,
                Acres: crop.Acres,
                SeedVariety: crop.SeedVariety,
                CropStatus: crop.CropStatus,
                CropStatusValue: crop.CropStatusValue,
                CropPhoto1: crop.CropPhoto1,
                CropPhoto2: crop.CropPhoto2,
                CropPhoto3: crop.CropPhoto3,
                CropPhoto4: crop.CropPhoto4,
                CropPhoto5: crop.CropPhoto5,
                CropPhotoOrg1: crop.CropPhotoOrg1,
                CropPhotoOrg2: crop.CropPhotoOrg2,
                CropPhotoOrg3: crop.CropPhotoOrg3,
                CropPhotoOrg4: crop.CropPhotoOrg4,
                CropPhotoOrg5: crop.CropPhotoOrg5,
                IsSync: crop.IsSync,
                LocalCreatedDate: crop.LocalCreatedDate
            }));
        }).flat(); // Flatten the array of arrays
        return res.json(farmerDetails);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.FarmerFarmerCrops = FarmerFarmerCrops;
const FarmerFarmerCropsandVisits = async (req, res) => {
    try {
        const farmers = await FarmerRegistration_1.default.find().select('-_id -JsonData').lean();
        // Extract FarmerLocalIds and StationIds from the fetched farmers
        const farmerIds = farmers.map(farmer => farmer.FarmerLocalId);
        const stationIds = farmers.map(farmer => farmer.StationId);
        // Fetch crops and field visits associated with the farmerIds
        const crops = await FarmerCrop_1.default.find({ FarmerLocalId: { $in: farmerIds } })
            .select('-_id -JsonData')
            .lean();
        const fieldVisits = await FieldVisit_1.default.find({ FarmerLocalId: { $in: farmerIds } })
            .select('-_id -JsonData')
            .lean();
        // Fetch stations associated with the stationIds
        const stations = await Stations_1.default.find({ StationId: { $in: stationIds } })
            .select('StationId OutletLegalName')
            .lean();
        // Create a map of crops, field visits, and stations by FarmerLocalId
        const cropsByFarmer = crops.reduce((acc, crop) => {
            (acc[crop.FarmerLocalId] = acc[crop.FarmerLocalId] || []).push(crop);
            return acc;
        }, {});
        const visitsByFarmer = fieldVisits.reduce((acc, visit) => {
            (acc[visit.FarmerLocalId] = acc[visit.FarmerLocalId] || []).push(visit);
            return acc;
        }, {});
        const stationsByStationId = stations.reduce((acc, station) => {
            acc[station.StationId] = station.OutletLegalName;
            return acc;
        }, {});
        // Combine farmers with their crops, field visits, and OutletLegalName
        const farmerDetails = farmers.flatMap(farmer => {
            const farmerCrops = cropsByFarmer[farmer.FarmerLocalId] || [];
            const farmerFieldVisits = visitsByFarmer[farmer.FarmerLocalId] || [];
            const outletLegalName = stationsByStationId[farmer.StationId] || null;
            // Create an array to hold the result
            const result = [];
            if (farmerCrops.length === 0 && farmerFieldVisits.length === 0) {
                // No crops and no field visits for this farmer
                result.push({
                    ...farmer,
                    OutletLegalName: outletLegalName,
                    FarmerCropId: null,
                    FarmerCropLocalId: null,
                    Crop: null,
                    CropValue: null,
                    Acres: null,
                    SeedVariety: null,
                    CropStatus: null,
                    CropStatusValue: null,
                    CropPhoto1: null,
                    CropPhoto2: null,
                    CropPhoto3: null,
                    CropPhoto4: null,
                    CropPhoto5: null,
                    CropPhotoOrg1: null,
                    CropPhotoOrg2: null,
                    CropPhotoOrg3: null,
                    CropPhotoOrg4: null,
                    CropPhotoOrg5: null,
                    IsSync: null,
                    LocalCreatedDate: null,
                    FieldVisitId: null,
                    FieldVisitLocalId: null,
                    FieldObservations: null,
                    Recommendations: null,
                    Lattitude: null,
                    CropVariety: null,
                    CropAcres: null,
                    SowingDate: null,
                    SyncedDate: null,
                    AllowEdit: null
                });
            }
            else {
                // Add records for each crop
                farmerCrops.forEach(crop => {
                    result.push({
                        ...farmer,
                        OutletLegalName: outletLegalName,
                        FarmerCropId: crop.FarmerCropId,
                        FarmerCropLocalId: crop.FarmerCropLocalId,
                        Crop: crop.Crop,
                        CropValue: crop.CropValue,
                        Acres: crop.Acres,
                        SeedVariety: crop.SeedVariety,
                        CropStatus: crop.CropStatus,
                        CropStatusValue: crop.CropStatusValue,
                        CropPhoto1: crop.CropPhoto1,
                        CropPhoto2: crop.CropPhoto2,
                        CropPhoto3: crop.CropPhoto3,
                        CropPhoto4: crop.CropPhoto4,
                        CropPhoto5: crop.CropPhoto5,
                        CropPhotoOrg1: crop.CropPhotoOrg1,
                        CropPhotoOrg2: crop.CropPhotoOrg2,
                        CropPhotoOrg3: crop.CropPhotoOrg3,
                        CropPhotoOrg4: crop.CropPhotoOrg4,
                        CropPhotoOrg5: crop.CropPhotoOrg5,
                        IsSync: crop.IsSync,
                        LocalCreatedDate: crop.LocalCreatedDate,
                        FieldVisitId: null,
                        FieldVisitLocalId: null,
                        FieldObservations: null,
                        Recommendations: null,
                        Lattitude: null,
                        CropVariety: null,
                        CropAcres: null,
                        SowingDate: null,
                        SyncedDate: null,
                        AllowEdit: null
                    });
                });
                // Add records for each field visit
                farmerFieldVisits.forEach(visit => {
                    result.push({
                        ...farmer,
                        OutletLegalName: outletLegalName,
                        FarmerCropId: null,
                        FarmerCropLocalId: null,
                        Crop: null,
                        CropValue: null,
                        Acres: null,
                        SeedVariety: null,
                        CropStatus: null,
                        CropStatusValue: null,
                        CropPhoto1: null,
                        CropPhoto2: null,
                        CropPhoto3: null,
                        CropPhoto4: null,
                        CropPhoto5: null,
                        CropPhotoOrg1: null,
                        CropPhotoOrg2: null,
                        CropPhotoOrg3: null,
                        CropPhotoOrg4: null,
                        CropPhotoOrg5: null,
                        IsSync: null,
                        LocalCreatedDate: null,
                        FieldVisitId: visit.FieldVisitId,
                        FieldVisitLocalId: visit.FVisitLocalId,
                        FieldObservations: visit.FieldObservations,
                        Recommendations: visit.Recommendations,
                        Lattitude: visit.Lattitude,
                        CropVariety: visit.CropVariety,
                        CropAcres: null,
                        SowingDate: null,
                        SyncedDate: visit.SyncedDate,
                        AllowEdit: visit.AllowEdit
                    });
                });
            }
            return result;
        });
        return res.json(farmerDetails);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.FarmerFarmerCropsandVisits = FarmerFarmerCropsandVisits;
// export const FarmerFarmerCropsandVisits = async (req: Request, res: Response) => {
//     try {
//         // Fetch all farmers excluding _id and JsonData fields
//         const farmers = await FarmerRegistration.find().select('-_id -JsonData').lean();
//         // Extract FarmerLocalIds from the fetched farmers
//         const farmerIds = farmers.map(farmer => farmer.FarmerLocalId);
//         // Fetch crops and field visits associated with the farmerIds
//         const crops = await FarmerCrop.find({ FarmerLocalId: { $in: farmerIds } })
//             .select('-_id -JsonData')
//             .lean();
//         const fieldVisits = await FarmerFieldVisit.find({ FarmerLocalId: { $in: farmerIds } })
//             .select('-_id -JsonData')
//             .lean();
//         // Create a map of crops and field visits by FarmerLocalId
//         const cropsByFarmer = crops.reduce((acc, crop) => {
//             (acc[crop.FarmerLocalId] = acc[crop.FarmerLocalId] || []).push(crop);
//             return acc;
//         }, {} as Record<string, typeof crops>);
//         const visitsByFarmer = fieldVisits.reduce((acc, visit) => {
//             (acc[visit.FarmerLocalId] = acc[visit.FarmerLocalId] || []).push(visit);
//             return acc;
//         }, {} as Record<string, typeof fieldVisits>);
//         // Combine farmers with their crops and field visits
//         const farmerDetails = farmers.flatMap(farmer => {
//             const farmerCrops = cropsByFarmer[farmer.FarmerLocalId] || [];
//             const farmerFieldVisits = visitsByFarmer[farmer.FarmerLocalId] || [];
//             // Create an array to hold the result
//             const result = [];
//             if (farmerCrops.length === 0 && farmerFieldVisits.length === 0) {
//                 // No crops and no field visits for this farmer
//                 result.push({
//                     ...farmer,
//                     FarmerCropId: null,
//                     FarmerCropLocalId: null,
//                     Crop: null,
//                     CropValue: null,
//                     Acres: null,
//                     SeedVariety: null,
//                     CropStatus: null,
//                     CropStatusValue: null,
//                     CropPhoto1: null,
//                     CropPhoto2: null,
//                     CropPhoto3: null,
//                     CropPhoto4: null,
//                     CropPhoto5: null,
//                     CropPhotoOrg1: null,
//                     CropPhotoOrg2: null,
//                     CropPhotoOrg3: null,
//                     CropPhotoOrg4: null,
//                     CropPhotoOrg5: null,
//                     IsSync: null,
//                     LocalCreatedDate: null,
//                     FieldVisitId: null,
//                     FieldVisitLocalId: null,
//                     FieldObservations: null,
//                     Recommendations: null,
//                     Lattitude: null,
//                     CropVariety: null,
//                     CropAcres: null,
//                     SowingDate: null,
//                     SyncedDate: null,
//                     AllowEdit: null
//                 });
//             } else {
//                 // Add records for each crop
//                 farmerCrops.forEach(crop => {
//                     result.push({
//                         ...farmer,
//                         FarmerCropId: crop.FarmerCropId,
//                         FarmerCropLocalId: crop.FarmerCropLocalId,
//                         Crop: crop.Crop,
//                         CropValue: crop.CropValue,
//                         Acres: crop.Acres,
//                         SeedVariety: crop.SeedVariety,
//                         CropStatus: crop.CropStatus,
//                         CropStatusValue: crop.CropStatusValue,
//                         CropPhoto1: crop.CropPhoto1,
//                         CropPhoto2: crop.CropPhoto2,
//                         CropPhoto3: crop.CropPhoto3,
//                         CropPhoto4: crop.CropPhoto4,
//                         CropPhoto5: crop.CropPhoto5,
//                         CropPhotoOrg1: crop.CropPhotoOrg1,
//                         CropPhotoOrg2: crop.CropPhotoOrg2,
//                         CropPhotoOrg3: crop.CropPhotoOrg3,
//                         CropPhotoOrg4: crop.CropPhotoOrg4,
//                         CropPhotoOrg5: crop.CropPhotoOrg5,
//                         IsSync: crop.IsSync,
//                         LocalCreatedDate: crop.LocalCreatedDate,
//                         FieldVisitId: null,
//                         FieldVisitLocalId: null,
//                         FieldObservations: null,
//                         Recommendations: null,
//                         Lattitude: null,
//                         CropVariety: null,
//                         CropAcres: null,
//                         SowingDate: null,
//                         SyncedDate: null,
//                         AllowEdit: null
//                     });
//                 });
//                 // Add records for each field visit
//                 farmerFieldVisits.forEach(visit => {
//                     result.push({
//                         ...farmer,
//                         FarmerCropId: null,
//                         FarmerCropLocalId: null,
//                         Crop: null,
//                         CropValue: null,
//                         Acres: null,
//                         SeedVariety: null,
//                         CropStatus: null,
//                         CropStatusValue: null,
//                         CropPhoto1: null,
//                         CropPhoto2: null,
//                         CropPhoto3: null,
//                         CropPhoto4: null,
//                         CropPhoto5: null,
//                         CropPhotoOrg1: null,
//                         CropPhotoOrg2: null,
//                         CropPhotoOrg3: null,
//                         CropPhotoOrg4: null,
//                         CropPhotoOrg5: null,
//                         IsSync: null,
//                         LocalCreatedDate: null,
//                         FieldVisitId: visit.FieldVisitId,
//                         FieldVisitLocalId: visit.FVisitLocalId,
//                         FieldObservations: visit.FieldObservations,
//                         Recommendations: visit.Recommendations,
//                         Lattitude: visit.Lattitude,
//                         CropVariety: visit.CropVariety,
//                         CropAcres: null,
//                         SowingDate: null,
//                         SyncedDate: visit.SyncedDate,
//                         AllowEdit: visit.AllowEdit
//                     });
//                 });
//             }
//             return result;
//         });
//         return res.json(farmerDetails);
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error");
//     }
// };
const FarmersOnMap = async (req, res) => {
    try {
        const farmers = await FarmerRegistration_1.default.find().select('-_id FarmerLocalId Latitude Longitude').lean();
        return res.json(farmers);
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.FarmersOnMap = FarmersOnMap;
exports.default = router;
