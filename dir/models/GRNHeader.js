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
const GRNHeaderSchema = new mongoose_1.Schema({
    POHeaderId: {
        type: String,
        required: true
    },
    GRNHeaderId: {
        type: String,
        required: true,
        unique: true
    },
    GRNDate: {
        type: Date,
        required: true
    },
    TransportCost: {
        type: String,
        required: true
    },
    InvoicePhoto: {
        type: String,
    },
    InvoiceNumber: {
        type: String,
        required: true
    },
    InvoiceAmount: {
        type: Number,
        required: true
    },
    AmountTobePaid: {
        type: Number,
        required: true
    },
    InvoiceUrl: {
        type: String,
    },
    InvoiceDate: {
        type: Date,
        required: true
    },
    SupplierType: {
        type: String,
        required: true
    },
    SupplierId: {
        type: String,
        required: true
    },
    SupplierName: {
        en: {
            type: String,
            required: true
        },
        fr: {
            type: String,
            required: true
        }
    },
    DeliveryLocationName: {
        type: String,
        required: true
    },
    DeliveryStatus: {
        type: Number,
        required: true
    },
    PaymentStatus: {
        type: Number,
        required: true
    },
    LiquidationStatus: {
        type: Number,
        required: true
    },
    DeliveryLocationId: {
        type: String,
        required: true
    },
    CreatedBy: {
        type: String,
        required: true
    },
    CreatedDate: {
        type: Date,
        required: true
    },
    UpdatedBy: {
        type: String,
        required: true
    },
    UpdatedDate: {
        type: Date,
        required: true
    }
});
const GRNHeader = mongoose_1.default.model('GRNHeader', GRNHeaderSchema, 'GRNHeader');
exports.default = GRNHeader;
