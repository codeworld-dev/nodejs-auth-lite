"use strict";
// import mongoose, { Schema, Document } from 'mongoose';
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
// export interface IFarmerRegistration extends Document {
//     FarmerId:string;
//     FirebaseId: string;
//     FarmerName: string;
//     CustomerName: string;
//     CountryCode: string;
//     Mobile: string;
//     LatLong:string;
//     ReferralCode:string;
//     RefReferralCode:string;
//     Latitude:number;
//     Longitude:string;
//     State: string;
//     District: string;
//     Taluka: string;
//     Village: string;
//     Address:string;
//     TotalAcres: string;
//     AadhaarPhoto: string;
//     Aadhaarno: string;
//     FarmerPhoto:string;
//     RegisteredOn:string;
//     DataSource:string;
//     CustomerId:string;
//     VirtualCardUrl:string;
//     StationId:string;
//     StationShortCode:string;
//     AdditionalProfile:string;
//     CropProfile:string;
//     KYC:string;
//     FarmProfile:string;
//     IsActive:string;
//     CreatedBy: string;
//     CreatedDate: Date;
//     UpdatedBy: string;
//     UpdatedDate: Date;
// }
// const FarmerRegistrationSchema: Schema = new Schema({
//     FarmerId: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     FirebaseId: {
//         type: String,
//     },
//     FarmerName: {
//         type: String,
//     },
//     CustomerName: {
//         type: String,
//     },
//     CountryCode: {
//         type: String,
//     },
//     Mobile: {
//         type: String,
//     },
//     LatLong: {
//         type: String,
//     },
//     ReferralCode: {
//         type: String,
//     },
//     RefReferralCode: {
//         type: String,
//     },
//     Latitude: {
//         type: Number,
//     },
//     Longitude: {
//         type: String,
//     },
//     State: {
//         type: String,
//     },
//     District: {
//         type: String,
//     },
//     Taluka: {
//         type: String,
//     },
//     Village: {
//         type: String,
//     },
//     Address: {
//         type: String,
//     },
//     TotalAcres: {
//         type: String,
//     },
//     AadhaarPhoto: {
//         type: String,
//     },
//     Aadhaarno: {
//         type: String,
//     },
//     FarmerPhoto: {
//         type: String,
//     },
//     RegisteredOn: {
//         type: String,
//     },
//     DataSource: {
//         type: String,
//     },
//     CustomerId: {
//         type: String,
//     },
//     VirtualCardUrl: {
//         type: String,
//     },
//     StationId: {
//         type: String,
//     },
//     StationShortCode: {
//         type: String,
//     },
//     AdditionalProfile: {
//         type: String,
//     },
//     CropProfile: {
//         type: String,
//     },
//     KYC: {
//         type: String,
//     },
//     FarmProfile: {
//         type: String,
//     },
//     IsActive: {
//         type: String,
//     },
//     CreatedBy: {
//         type: String,
//     },
//     CreatedDate: {
//         type: Date,
//         default: Date.now,
//     },
//     UpdatedBy: {
//         type: String,
//     },
//     UpdatedDate: {
//         type: Date,
//         default: Date.now,
//     }
// });
// const FarmerRegistration = mongoose.model<IFarmerRegistration>('FarmerRegistration', FarmerRegistrationSchema,'FarmerRegistration');
// export default FarmerRegistration;
const mongoose_1 = __importStar(require("mongoose"));
const FarmerRegistrationSchema = new mongoose_1.Schema({
    StationId: {
        type: String,
        required: true
    },
    StationShortCode: {
        type: String,
        required: true
    },
    FarmerLocalId: {
        type: String,
        required: true
    },
    FarmerId: {
        type: String,
        required: true,
        unique: true
    },
    CustomerId: {
        type: String,
        default: null
    },
    ReferralCode: {
        type: String,
        required: true
    },
    RefReferralCode: {
        type: String,
    },
    DataSource: {
        type: String,
        required: true
    },
    FarmerName: {
        type: String,
        required: true
    },
    Mobile: {
        type: String,
        required: true
    },
    MobileNumber: {
        type: String,
        required: true
    },
    AadhaarNo: {
        type: String,
    },
    TotalAcres: {
        type: String,
    },
    Address: {
        type: String,
    },
    CountryCode: {
        type: String,
    },
    State: {
        type: String,
    },
    District: {
        type: String,
    },
    Taluka: {
        type: String,
    },
    Village: {
        type: String,
    },
    VillageValue: {
        type: String,
    },
    LatLong: {
        type: String,
    },
    Latitude: {
        type: String,
    },
    Longitude: {
        type: String,
    },
    FarmerPhoto: {
        type: String,
    },
    FarmerPhotoOrg: {
        type: String,
    },
    AadhaarPhoto: {
        type: String,
    },
    KYC: {
        type: String,
    },
    FarmProfile: {
        type: String,
    },
    CropProfile: {
        type: String,
    },
    AdditionalProfile: {
        type: String,
    },
    FirebaseId: {
        type: String,
    },
    VirtualCardUrl: {
        type: String,
    },
    RegisteredOn: {
        type: Date,
    },
    JsonData: {
        type: {
            FarmerName: String,
            Mobile: String,
            Village: String,
            VillageValue: String,
            TotalAcres: String,
            LatLong: String,
            FarmerPhoto: String,
            Lattitude: String,
            Longitude: String,
            FarmerLocalId: String,
            StationId: String,
            LocalCreatedDate: String,
        },
        required: true
    },
    IsCustomer: {
        type: Boolean,
    },
    FirstPurchaseOn: {
        type: Date,
    },
    RecentPurchaseOn: {
        type: Date,
    },
    IsFieldVisited: {
        type: Boolean,
        default: false
    },
    FirstFvOn: {
        type: Date,
    },
    RecentFvOn: {
        type: Date,
    },
    IsMobileAppUser: {
        type: Boolean,
        default: false
    },
    MobileAppUserSince: {
        type: Date,
    },
    RecentCallOn: {
        type: Date,
    },
    TotalCredit: {
        type: Number,
        default: 0.0
    },
    Wallet: {
        type: Number,
        default: 0
    },
    NoOfTransactions: {
        type: Number,
        default: 0
    },
    Rank: {
        type: Number,
        default: 0
    },
    ActiveCrops: {
        type: Boolean,
        default: false
    },
    IsActive: {
        type: Boolean,
        default: true
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
const FarmerRegistration = mongoose_1.default.model('FarmerRegistration', FarmerRegistrationSchema, 'FarmerRegistration');
exports.default = FarmerRegistration;
