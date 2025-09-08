"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseTemplate = exports.getGRNDetails = void 0;
const express_1 = __importDefault(require("express"));
const GRNDetails_1 = __importDefault(require("../models/GRNDetails"));
const router = express_1.default.Router();
const getGRNDetails = async (req, res) => {
    try {
        const alldata = await GRNDetails_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getGRNDetails = getGRNDetails;
// export const PurchaseTemplate = async (req: Request, res: Response) => {
//     const { FromDate, ToDate, DeliveryLocationIds } = req.body;
//     if (!FromDate || !ToDate || !DeliveryLocationIds) {
//         return res.status(400).send("FromDate, ToDate, and DeliveryLocationIds are required");
//     }
//     try {
//         //console.log("Request Body:", req.body);
//         const fromDateParts = (FromDate as string).split('-');
//         const toDateParts = (ToDate as string).split('-');
//         const fromDate = new Date(`${fromDateParts[2]}-${fromDateParts[1]}-${fromDateParts[0]}`);
//         const toDate = new Date(`${toDateParts[2]}-${toDateParts[1]}-${toDateParts[0]}`);
//         toDate.setHours(23, 59, 59, 999);
//         const locationIds = Array.isArray(DeliveryLocationIds)
//             ? DeliveryLocationIds
//             : [DeliveryLocationIds];
//         const data = await GRNDetails.find({
//             InvoiceDate: {
//                 $gte: fromDate,
//                 $lte: toDate
//             },
//             DeliveryLocationId: { $in: locationIds }
//         }).select('SupplierName InvoiceNumber GSTAmount HSNCode  InvoiceDate DeliveryLocationId DeliveryLocationName');
// //        console.log("Query Results:", data);
//         if (data.length === 0) {
//             console.log("No records found for the specified criteria.");
//             return res.status(404).send("No records found for the specified criteria.");
//         }
//         const result = data.map((item: any) => ({
//             Date: item.InvoiceDate.toISOString().split('T')[0],
//             StationId: item.DeliveryLocationId,
//             StationName: item.DeliveryLocationName,
//             GstAmount: item.GSTAmount,
//             HSNCode: item.HSNCode,
//             SupplierName: {
//                 en: item.SupplierName,
//                 fr: item.SupplierName 
//             },
//             InvoiceNumber: item.InvoiceNumber,
//             InvoiceDate: item.InvoiceDate
//         }));
//         return res.json(result);
//     } catch (err) {
//         console.log("Error:", err);
//         return res.status(500).send("Internal Server Error");
//     }
// };
const PurchaseTemplate = async (req, res) => {
    const { FromDate, ToDate, DeliveryLocationIds } = req.body;
    if (!FromDate || !ToDate || !DeliveryLocationIds) {
        return res.status(400).send("FromDate, ToDate, and DeliveryLocationIds are required");
    }
    try {
        //console.log("Request Body:", req.body);
        const fromDateParts = FromDate.split('-');
        const toDateParts = ToDate.split('-');
        const fromDate = new Date(`${fromDateParts[2]}-${fromDateParts[1]}-${fromDateParts[0]}`);
        const toDate = new Date(`${toDateParts[2]}-${toDateParts[1]}-${toDateParts[0]}`);
        toDate.setHours(23, 59, 59, 999);
        const locationIds = Array.isArray(DeliveryLocationIds)
            ? DeliveryLocationIds
            : [DeliveryLocationIds];
        const data = await GRNDetails_1.default.find({
            InvoiceDate: {
                $gte: fromDate,
                $lte: toDate
            },
            DeliveryLocationId: { $in: locationIds }
        }).select('SupplierName InvoiceNumber GSTAmount HSNCode BasePrice InvoiceDate DeliveryLocationId DeliveryLocationName TotalInvoiceValue');
        //        console.log("Query Results:", data);
        if (data.length === 0) {
            console.log("No records found for the specified criteria.");
            return res.status(404).send("No records found for the specified criteria.");
        }
        const result = data.map((item) => {
            const GSTAmount = item.GSTAmount;
            const BasePrice = item.BasePrice;
            const CGST = GSTAmount / 2;
            const SGST = GSTAmount / 2;
            const TotalInvoiceValue = GSTAmount + BasePrice;
            return {
                Date: item.InvoiceDate.toISOString().split('T')[0],
                StationId: item.DeliveryLocationId,
                StationName: item.DeliveryLocationName,
                GSTAmount: item.GSTAmount,
                CGST: CGST,
                SGST: SGST,
                BasePrice: item.BasePrice,
                HSNCode: item.HSNCode,
                SupplierName: {
                    en: item.SupplierName,
                    fr: item.SupplierName
                },
                InvoiceNumber: item.InvoiceNumber,
                InvoiceDate: item.InvoiceDate,
                TotalInvoiceValue: TotalInvoiceValue
            };
        });
        return res.json(result);
    }
    catch (err) {
        console.log("Error:", err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.PurchaseTemplate = PurchaseTemplate;
exports.default = router;
