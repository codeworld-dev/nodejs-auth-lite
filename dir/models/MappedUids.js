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
const MappedUidsSchema = new mongoose_1.Schema({
    POHeaderId: { type: String },
    PODetailId: { type: String },
    GRNHeaderId: { type: String },
    GRNDetailId: { type: String },
    StationId: { type: String },
    OutletLegalName: { type: String },
    ProductId: { type: String },
    PackId: { type: String },
    Batch: { type: String },
    ProductCategoryId: { type: String },
    ProductCategoryName: {
        en: { type: String },
        fr: { type: String }
    },
    ProductSegment: {
        en: { type: String },
        fr: { type: String }
    },
    ProductClassification: {
        en: { type: String },
        fr: { type: String }
    },
    HSNCode: { type: String },
    InvoiceNumber: { type: String },
    MoleculeId: { type: String },
    MoleculeName: {
        en: { type: String },
        fr: { type: String }
    },
    CompanyId: { type: String },
    CompanyName: {
        en: { type: String },
        fr: { type: String }
    },
    SupplierId: { type: String },
    SupplierName: {
        en: { type: String },
        fr: { type: String }
    },
    MfgDate: { type: Date },
    ExpDate: { type: Date },
    UCode: { type: String },
    FinancialYear: { type: String },
    Qty: { type: Number },
    TrackMode: { type: String },
    InvoicePricePerPiece: { type: Number },
    PRPricePerPiece: { type: Number },
    TransactionStatus: { type: Number },
    IsActive: { type: Boolean },
    IsSync: { type: Boolean },
    SyncDate: { type: Date },
    BrandId: { type: String },
    BrandName: {
        en: { type: String },
        fr: { type: String }
    },
    PackDesc: { type: String },
    RecievedPieces: { type: Number },
    ProductPack: { type: String },
    SellingPrice: { type: Number },
    CreatedBy: { type: String },
    CreatedDate: { type: Date },
    UpdatedBy: { type: String },
    UpdatedDate: { type: Date }
});
const MappedUids = mongoose_1.default.model('MappedUids', MappedUidsSchema, 'MappedUids');
exports.default = MappedUids;
