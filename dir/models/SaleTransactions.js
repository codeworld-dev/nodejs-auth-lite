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
const SaleTransactionSchema = new mongoose_1.Schema({
    HeaderId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    TransactionType: { type: Number, required: true },
    StationId: { type: String, required: true },
    InvoiceNo: { type: String, required: true },
    CustomerId: { type: String, required: true },
    OutletLegalName: { type: String, required: true },
    InvoiceDate: { type: Date, required: true },
    CustomerName: { type: String, required: true },
    MobileNo: { type: String, required: true },
    VillageName: { type: String, required: true },
    TotalBasePrice: { type: Number, required: true },
    TotalGSTAmount: { type: Number, required: true },
    TotalDiscount: { type: Number, required: true },
    Discount: { type: Number, required: true },
    Promocode: { type: String, default: null },
    AdditionalDiscount: { type: Number, required: true },
    TotalBillValue: { type: Number, required: true },
    DiscountedBillValue: { type: Number, required: true },
    TotalPurchasePrice: { type: Number, required: true },
    Cash: { type: Number, required: true },
    Upi: { type: Number, required: true },
    Card: { type: Number, required: true },
    Credit: { type: Number, required: true },
    TotalPrice: { type: Number, required: true },
    IsProcessed: { type: Boolean, required: true },
    ProcessedDate: { type: Date, },
    ProductCategoryId: { type: String, required: true },
    ProductCategoryName: {
        en: { type: String, required: true },
        fr: { type: String, required: true }
    },
    ProductSegment: {
        en: { type: String, required: true },
        fr: { type: String, required: true }
    },
    ProductClassification: {
        en: { type: String, required: true },
        fr: { type: String, required: true }
    },
    HSNCode: { type: String, required: true },
    Cluster: { type: String },
    ClusterName: { type: String },
    FinancialYear: { type: String },
    FarmerId: { type: String },
    Year: { type: String },
    FarmerLocalId: { type: String },
    MoleculeId: { type: String, required: true },
    MoleculeName: {
        en: { type: String, required: true },
        fr: { type: String, }
    },
    SaleType: { type: String },
    CompanyId: { type: String, required: true },
    CompanyName: {
        en: { type: String, required: true },
        fr: { type: String, }
    },
    MappedId: { type: Number },
    ProductPack: { type: String, required: true },
    PackSize: { type: String, default: null },
    ProductId: { type: String, required: true },
    SellingPrice: { type: Number },
    ProductName: { type: String, default: null },
    Batch: { type: String, required: true },
    CropDetails: { type: String, default: null },
    CropStageDetails: { type: String, default: null },
    PestDetails: { type: String, default: null },
    Qty: { type: Number, required: true },
    MfgDate: { type: Date, },
    ExpDate: { type: Date, },
    UCode: { type: String, required: true },
    Remarks: { type: String, },
    TrackMode: { type: String, required: true },
    IsSync: { type: Boolean, required: true },
    SyncDate: { type: Date, },
    CreatedBy: { type: String, required: true },
    CreatedDate: { type: Date, required: true },
    UpdatedBy: { type: String, required: true },
    UpdatedDate: { type: Date, required: true }
});
const SaleTransactions = mongoose_1.default.model("SaleTransactions", SaleTransactionSchema, 'SaleTransactions');
exports.default = SaleTransactions;
