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
const HeaderDetailsSchema = new mongoose_1.Schema({
    Name: { type: String },
    Address: { type: String },
    Address1: { type: String },
    Address2: { type: String },
    Address3: { type: String },
    Gstin: { type: String },
    GstFile: { type: String },
    PesticideFile: { type: String },
    SeedFile: { type: String },
    FertiFile: { type: String },
    PesticideLicense: { type: String },
    FertiLicense: { type: String },
    SeedLicense: { type: String },
    PLExpiryDate: { type: Date },
    SLExpiryDate: { type: Date },
    FLExprityDate: { type: Date }
});
const StationSchema = new mongoose_1.Schema({
    StationId: { type: String, required: true, unique: true },
    OutletLegalName: { type: String },
    OutletAliasName: { type: String },
    ShortCode: { type: String },
    ContactPerson: { type: String },
    MobileNumber: { type: String },
    AlternateNumber: { type: String },
    Address: { type: String },
    L2Id: { type: String },
    L2Name: { type: String },
    L3Id: { type: String },
    L3Name: { type: String },
    L4Id: { type: String },
    L4Name: { type: String },
    L5Id: { type: String },
    L5Name: { type: String },
    LatLong: { type: String },
    PinCode: { type: String },
    OutletOpen: { type: Boolean },
    Cluster: { type: String },
    ClusterName: { type: String },
    CopyPricesFromStation: { type: String },
    CopyPricesFromStationName: { type: String },
    HeaderDetails: { type: HeaderDetailsSchema, required: true },
    IsActive: { type: Boolean },
    CreatedBy: { type: String },
    CreatedDate: { type: Date },
    UpdatedBy: { type: String },
    UpdatedDate: { type: Date }
});
const Station = mongoose_1.default.model("Station", StationSchema, 'Station');
exports.default = Station;
