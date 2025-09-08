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
const GRNDetailsSchema = new mongoose_1.Schema({
    GRNDetailId: {
        type: String,
        required: true,
        unique: true
    },
    POHeaderId: {
        type: String,
        required: true
    },
    PODetailId: {
        type: String,
        required: true
    },
    GRNHeaderId: {
        type: String,
        required: true
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
        default: null
    },
    InvoiceNumber: {
        type: String,
        required: true
    },
    InvoiceDate: {
        type: Date,
        required: true
    },
    InvoicePrice: {
        type: Number,
        default: null
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
    DeliveryLocationId: {
        type: String,
        required: true
    },
    InvoicePricePerPiece: {
        type: Number,
        required: true
    },
    PRPricePerPiece: {
        type: Number,
        required: true
    },
    ProductCategoryId: {
        type: String,
        required: true
    },
    ProductId: {
        type: String,
        required: true
    },
    ProductDesc: {
        en: {
            type: String,
            required: true
        },
        fr: {
            type: String,
            required: true
        }
    },
    BrandId: {
        type: String,
        required: true
    },
    BrandName: {
        en: {
            type: String,
            required: true
        },
        fr: {
            type: String,
            required: true
        }
    },
    ProductSegment: {
        en: {
            type: String,
            required: true
        },
        fr: {
            type: String,
            required: true
        }
    },
    HSNCode: {
        type: String,
        required: true
    },
    ProductPack: {
        type: String,
        required: true
    },
    PackDesc: {
        type: String,
        required: true
    },
    RecievedPieces: {
        type: Number,
        required: true
    },
    TrackMode: {
        type: String,
        required: true
    },
    Scanned: {
        type: String,
    },
    ScannedCount: {
        type: Number,
        required: true
    },
    OrderedPieces: {
        type: Number,
        required: true
    },
    MfgDate: {
        type: Date,
    },
    ExpDate: {
        type: Date,
        required: true
    },
    Batch: {
        type: String,
        required: true
    },
    GSTInclInInvoicePrice: {
        type: Boolean,
        required: true
    },
    BasePrice: {
        type: Number,
        required: true
    },
    GSTAmount: {
        type: Number,
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
    ReviewStatus: {
        type: Boolean,
        required: true
    },
    IsSync: {
        type: Boolean,
        required: true
    },
    MappedCount: {
        type: Number,
        required: true
    },
    MapStatus: {
        type: Number,
        required: true
    },
    SyncDate: {
        type: Date,
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
    },
    UpdatedDate: {
        type: Date,
    }
});
const GRNDetails = mongoose_1.default.model('GRNDetails', GRNDetailsSchema, 'GRNDetails');
exports.default = GRNDetails;
