"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormSections = exports.addFormSection = void 0;
const express_1 = __importDefault(require("express"));
const FormSections_1 = __importDefault(require("../models/FormSections"));
const router = express_1.default.Router();
const addFormSection = async (req, res) => {
    try {
        const { FormId, FormName, IsActive, SectionId, Title, Order, L2Id } = req.body;
        const requiredFields = ['FormId', 'FormName', 'SectionId', 'L2Id', 'Order', 'IsActive'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Data is not sending correctly",
                missingFields
            });
        }
        let formsection = null;
        const createdBy = req.user ? req.user.UserName : null;
        if (SectionId === "0") {
            // Creating a new Form record
            const latestFormsection = await FormSections_1.default.findOne({}, { SectionId: 1 }, { sort: { Section: -1 } });
            const lastId = latestFormsection ? parseInt(latestFormsection.SectionId.slice(3)) : 0;
            const newFormSectionId = 'SEC' + ('0000' + (lastId + 1)).slice(-4);
            formsection = new FormSections_1.default({
                FormId,
                FormName,
                SectionId: newFormSectionId,
                Order,
                Title,
                IsActive,
                L2Id,
                CreatedDate: Date.now(),
                CreatedBy: createdBy
            });
            await formsection.save();
            return res.status(200).send("FormSection record added successfully");
        }
        formsection = await FormSections_1.default.findOneAndUpdate({ SectionId }, {
            FormName,
            IsPublished: false,
            PublishedDate: Date.now(),
            IsActive,
            Order,
            Title,
            L2Id,
            UpdatedDate: Date.now(),
            UpdatedBy: createdBy
        }, { upsert: true, new: true });
        if (formsection) {
            return res.status(200).send("FormSection record updated successfully");
        }
        else {
            console.log("Failed to update/create Form record");
            return res.status(500).send("Internal Server Error");
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.addFormSection = addFormSection;
const getFormSections = async (req, res) => {
    try {
        const alldata = await FormSections_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getFormSections = getFormSections;
exports.default = router;
