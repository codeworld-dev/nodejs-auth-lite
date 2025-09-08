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
const ISaleTransHeaderSchema = new mongoose_1.Schema({
    TransactionType: { type: Number },
    StationId: { type: String },
    OutletLegalName: { type: String },
    CustomerType: { type: String },
    CustomerId: { type: String, },
    CustomerName: { type: String, required: true },
    MobileNo: { type: String, required: true },
    VillageName: { type: String, required: true },
    InvoiceNo: { type: String, required: true },
    TypeOfSale: { type: String },
    InvoiceDate: { type: Date, required: true },
    Qty: { type: Number, required: true },
    TotalBasePrice: { type: Number, required: true },
    TotalGSTAmount: { type: Number, required: true },
    TotalDiscount: { type: Number, required: true },
    Promocode: { type: String, required: true },
    AdditionalDiscount: { type: Number, required: true },
    TotalBillValue: { type: Number, required: true },
    DiscountedBillValue: { type: Number, required: true },
    TotalPurchasePrice: { type: Number, required: true },
    TotalPaid: { type: Number, required: true },
    Credit: { type: Number, required: true },
    Cash: { type: Number, required: true },
    Upi: { type: Number, required: true },
    Card: { type: Number, required: true },
    GrandTotal: { type: Number },
    IsSync: { type: Boolean, required: true },
    IsProcessed: { type: Boolean, required: true },
    SyncDate: { type: Date, required: true },
    ProcessedDate: { type: Date, required: true },
    CreatedBy: { type: String },
    CreatedDate: { type: Date },
    UpdatedBy: { type: String },
    Cluster: { type: String },
    ClusterName: { type: String },
    FinancialYear: { type: String },
    FarmerId: { type: String },
    SaleType: { type: String },
    PaymentDueDate: { type: String },
    Year: { type: String },
    FarmerLocalId: { type: String },
    UpdatedDate: { type: Date }
});
const SaleTransHeader = mongoose_1.default.model('SaleTransHeader', ISaleTransHeaderSchema, 'SaleTransHeader');
exports.default = SaleTransHeader;
