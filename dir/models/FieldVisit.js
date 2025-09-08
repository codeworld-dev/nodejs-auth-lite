"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ScoutSchema = new mongoose_1.default.Schema({
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
});
// Schema for JsonData sub-document
const JsonDataSchema = new mongoose_1.Schema({
    FieldObservations: { type: String, required: true },
    Recommendations: { type: String, required: true },
    CropStatus: { type: String, required: true },
    CropStatusValue: { type: String, required: true },
    SelectBrand: { type: [String], required: false },
    SelectBrandValue: { type: [String], required: false },
    LatLong: { type: String, required: true },
    CropPhoto: { type: String, required: true },
    CropPhoto1: { type: String, required: true },
    CropPhoto2: { type: String, required: true },
    CropPhoto3: { type: String, required: true },
    CropPhoto4: { type: String, required: true },
    CropPhoto5: { type: String, required: true },
    StationId: { type: String, required: true },
    Lattitude: { type: String, required: true },
    Longitude: { type: String, required: true },
    FarmerLocalId: { type: String, required: true },
    FVisitLocalId: { type: String, required: true },
    LocalCreatedDate: { type: Date, required: true },
    NextVisitDate: { type: Date, required: true },
    Scout: { type: [ScoutSchema], required: false }
});
// Schema for FarmerFieldVisit
const FarmerFieldVisitSchema = new mongoose_1.Schema({
    FVisitLocalId: { type: String, required: true, unique: true },
    FieldVisitId: { type: String, default: null },
    FarmerLocalId: { type: String, required: true },
    FarmerCropLocalId: { type: String, required: true },
    FarmerId: { type: String, required: true },
    FarmerName: { type: String, required: true },
    Crop: { type: String, default: null },
    CropValue: { type: String, default: null },
    CropVariety: { type: String, default: null },
    CropAcres: { type: String, required: true },
    SowingDate: { type: Date, default: null },
    CropPhoto: { type: String, required: true },
    FieldObservations: { type: String, required: true },
    Recommendations: { type: String, required: true },
    LatLong: { type: String, required: true },
    Lattitude: { type: String, required: true },
    Longitude: { type: String, required: true },
    JsonData: { type: JsonDataSchema, required: true },
    IsSync: { type: Boolean, required: true },
    SyncedDate: { type: Date, default: new Date(0) },
    IsActive: { type: Boolean, required: true },
    AllowEdit: { type: Boolean, required: true },
    CreatedBy: { type: String, required: true },
    CreatedDate: { type: Date, required: true },
    LocalCreatedDate: { type: Date, required: true },
    UpdatedBy: { type: String, default: null },
    UpdatedDate: { type: Date, default: null }
});
// Model creation
const FarmerFieldVisit = mongoose_1.default.model("FarmerFieldVisit", FarmerFieldVisitSchema, 'FarmerFieldVisit');
exports.default = FarmerFieldVisit;
