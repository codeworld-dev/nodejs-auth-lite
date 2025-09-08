"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getForms = exports.addForm = void 0;
const express_1 = __importDefault(require("express"));
const Form_1 = __importDefault(require("../models/Form"));
const router = express_1.default.Router();
const addForm = async (req, res) => {
    try {
        const { FormId, FormName, IsActive, FormType, L2Id, L2Name, Icon } = req.body;
        const requiredFields = ['FormId', 'FormName', 'FormType', 'L2Id', 'L2Name', 'IsActive'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Data is not sending correctly",
                missingFields
            });
        }
        let form = null;
        const createdBy = req.user ? req.user.UserName : null;
        if (FormId === "0") {
            // Creating a new Form record
            const latestFormId = await Form_1.default.findOne({}, { FormId: 1 }, { sort: { FormId: -1 } });
            const lastId = latestFormId ? parseInt(latestFormId.FormId.slice(3)) : 0;
            const newFormId = 'FRM' + ('0000' + (lastId + 1)).slice(-4);
            form = new Form_1.default({
                FormId: newFormId,
                FormName,
                IsPublished: false,
                PublishedDate: Date.now(),
                IsActive,
                FormType,
                FormFor: 'FORM',
                L2Id,
                L2Name,
                Icon,
                CreatedDate: Date.now(),
                CreatedBy: createdBy
            });
            await form.save();
            return res.status(200).send("Form record added successfully");
        }
        form = await Form_1.default.findOneAndUpdate({ FormId }, {
            FormName,
            IsPublished: false,
            PublishedDate: Date.now(),
            IsActive,
            FormType,
            FormFor: 'FORM',
            L2Id,
            L2Name,
            Icon,
            UpdatedDate: Date.now(),
            UpdatedBy: createdBy
        }, { upsert: true, new: true });
        if (form) {
            return res.status(200).send("Form record updated successfully");
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
exports.addForm = addForm;
const getForms = async (req, res) => {
    try {
        const alldata = await Form_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};
exports.getForms = getForms;
exports.default = router;
