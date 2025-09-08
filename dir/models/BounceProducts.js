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
const BounceProductsSchema = new mongoose_1.Schema({
    // _id: { type: Schema.Types.Long },
    BounceProductId: {
        type: String,
        required: true,
        unique: true
    },
    StationId: {
        type: String
    },
    OutletLegalName: {
        type: String
    },
    BounceDate: {
        type: String
    },
    ProductId: {
        type: String
    },
    ProductPack: {
        type: String
    },
    Qty: {
        type: Number
    },
    FarmerName: {
        type: String
    },
    Mobile: {
        type: String
    },
    CreatedBy: { type: String },
    CreatedDate: { type: Date },
    UpdatedBy: { type: String },
    UpdatedDate: { type: Date }
}, {
    versionKey: false // Prevent Mongoose from adding the `__v` field
});
const BounceProducts = mongoose_1.default.model('BounceProducts', BounceProductsSchema, 'BounceProducts');
exports.default = BounceProducts;
