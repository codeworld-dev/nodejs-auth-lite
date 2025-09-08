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
const FarmerCropSchema = new mongoose_1.Schema({
    FarmerLocalId: {
        type: String,
    },
    FarmerId: {
        type: String,
    },
    FarmerCropId: {
        type: String,
        required: true,
        unique: true
    },
    StationId: {
        type: String,
    },
    FarmerCropLocalId: {
        type: String,
    },
    Crop: {
        type: String,
        required: true
    },
    CropValue: {
        type: String,
        required: true
    },
    Acres: {
        type: String,
        required: true
    },
    SeedVariety: {
        type: String,
        required: true
    },
    CropStatus: {
        type: String,
        required: true
    },
    CropStatusValue: {
        type: String,
        required: true
    },
    CropPhoto1: {
        type: String,
    },
    CropPhoto2: {
        type: String,
    },
    CropPhoto3: {
        type: String,
    },
    CropPhoto4: {
        type: String,
    },
    CropPhoto5: {
        type: String,
    },
    CropPhotoOrg1: {
        type: String,
    },
    CropPhotoOrg2: {
        type: String,
    },
    CropPhotoOrg3: {
        type: String,
    },
    CropPhotoOrg4: {
        type: String,
    },
    CropPhotoOrg5: {
        type: String,
    },
    JsonData: {
        type: {
            Crop: String,
            CropValue: String,
            Acres: String,
            SeedVariety: String,
            CropStatus: String,
            CropStatusValue: String,
            DOS: String,
            StationId: String,
            FarmerCropLocalId: String,
            LocalCreatedDate: String,
            FarmerLocalId: String,
        },
        required: true
    },
    IsSync: {
        type: Boolean,
        required: true
    },
    LocalCreatedDate: {
        type: Date,
        required: true
    },
    CreatedBy: {
        type: String,
    },
    CreatedDate: {
        type: Date,
    },
    UpdatedBy: {
        type: String,
    },
    UpdatedDate: {
        type: Date,
    }
});
const FarmerCrop = mongoose_1.default.model('FarmerCrop', FarmerCropSchema, 'FarmerCrop');
exports.default = FarmerCrop;
