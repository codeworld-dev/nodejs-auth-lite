"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormFields = exports.addFormFields = void 0;
const express_1 = __importDefault(require("express"));
const FormFields_1 = __importDefault(require("../models/FormFields"));
const router = express_1.default.Router();
// export const addFormFields = async (req: Request, res: Response) => {
//     try {
//         const {
//             FormId,
//             FormName,
//             SectionId,
//             Order,
//             FormControls,
//             Conditions,
//             IsActive,
//             CreatedBy,
//             FieldId,
//             DefaultView,
//             MobileEditable,
//             WebEditable,
//             L2Id
//         } = req.body;
//         // Check for missing fields
//         const requiredFields = ['FormId', 'FormName','WebEditable','L2Id', 'SectionId','Order', 'FormControls','Conditions', 'IsActive','FieldId','DefaultView','MobileEditable',];
//         const missingFields = requiredFields.filter(field => !req.body[field]);
//         if (missingFields.length > 0) {
//             return res.status(400).json({
//                 message: "Data is not sending correctly",
//                 missingFields
//             });
//         }
//         let formFields: IFormFields | null = null;
//         const createdBy = req.user ? req.user.UserName : null;
//         // If FieldId is provided, update the existing record
//         if (FieldId) {
//             formFields = await FormFields.findOneAndUpdate(
//                 { FieldId },
//                 {
//                     FormId,
//                     FormName,
//                     SectionId,
//                     Order,
//                     FormControls,
//                     Conditions,
//                     IsActive,
//                     UpdatedBy:createdBy,
//                     UpdatedDate: Date.now()
//                 },
//                 { new: true }
//             );
//             if (formFields) {
//                 return res.status(200).send("Form fields updated successfully");
//             } else {
//                 console.log("Failed to update Form fields");
//                 return res.status(500).send("Internal Server Error");
//             }
//         }
//         // If FieldId is not provided or is '0', create a new record
//         const latestFormField = await FormFields.findOne({}, { FieldId: 1 }, { sort: { FieldId: -1 } });
//         const lastId = latestFormField ? parseInt(latestFormField.FieldId.slice(3)) : 0;
//         const newFieldId = 'FFL' + ('0000' + (lastId + 1)).slice(-4);
//         formFields = new FormFields({
//             FieldId: newFieldId,
//             FormId,
//             FormName,
//             SectionId,
//             Order,
//             FormControls,
//             Conditions,
//             IsActive,
//             CreatedBy:createdBy,
//             CreatedDate:  Date.now(),
//             DefaultView,
//             MobileEditable,
//             WebEditable,
//             L2Id
//         });
//         await formFields.save();
//         return res.status(200).send("Form fields added successfully");
//     } catch (err) {
//         console.error(err);
//         return res.status(500).send("Internal Server Error");
//     }
// };
const addFormFields = async (req, res) => {
    try {
        const { FormId, FormName, SectionId, Order, FormControls, Conditions, IsActive, CreatedBy, FieldId, DefaultView, MobileEditable, WebEditable, L2Id } = req.body;
        // Check for missing fields
        const requiredFields = ['FormId', 'SectionId', 'Order', 'Conditions', 'IsActive', 'FieldId', 'DefaultView', 'MobileEditable', 'WebEditable', 'L2Id'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (!FormName || Object.keys(FormName).length === 0) {
            missingFields.push('FormName');
        }
        if (!FormControls || Object.keys(FormControls).length === 0) {
            missingFields.push('FormControls');
        }
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Data is not sending correctly",
                missingFields
            });
        }
        let formFields = null;
        const createdBy = req.user ? req.user.UserName : null;
        // // If FieldId is provided, update the existing record
        // if (FieldId) {
        //     formFields = await FormFields.findOneAndUpdate(
        //         { FieldId },
        //         {
        //             FormId,
        //             FormName,
        //             SectionId,
        //             Order,
        //             FormControls,
        //             Conditions,
        //             IsActive,
        //             UpdatedBy: createdBy,
        //             UpdatedDate: Date.now()
        //         },
        //         { new: true }
        //     );
        //     if (formFields) {
        //         return res.status(200).send("Form fields updated successfully");
        //     } else {
        //         console.log("Failed to update Form fields");
        //         return res.status(500).send("Internal Server Error");
        //     }
        // }
        // If FieldId is not provided or is '0', create a new record
        const latestFormField = await FormFields_1.default.findOne({}, { FieldId: 1 }, { sort: { FieldId: -1 } });
        const lastId = latestFormField ? parseInt(latestFormField.FieldId.slice(3)) : 0;
        const newFieldId = 'FFL' + ('0000' + (lastId + 1)).slice(-4);
        formFields = new FormFields_1.default({
            FieldId: newFieldId,
            FormId,
            FormName,
            SectionId,
            Order,
            FormControls,
            Conditions,
            IsActive,
            CreatedBy: createdBy,
            CreatedDate: Date.now(),
            DefaultView,
            MobileEditable,
            WebEditable,
            L2Id
        });
        await formFields.save();
        return res.status(200).send("Form fields added successfully");
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.addFormFields = addFormFields;
const getFormFields = async (req, res) => {
    try {
        const alldata = await FormFields_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getFormFields = getFormFields;
exports.default = router;
