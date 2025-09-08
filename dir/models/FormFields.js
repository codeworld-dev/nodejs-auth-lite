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
const FormControlValidationsSchema = new mongoose_1.Schema({
    AllowDecimals: { type: Boolean },
    Alphanumaric: { type: Boolean },
    OnlyAlpha: { type: Boolean },
    OnlyIntegers: { type: Boolean },
    MinLength: { type: Number },
    MaxLength: { type: Number },
    AllowSpecialCharacters: { type: Boolean },
    DigitsAfterDecimal: { type: Number },
    IsUnique: { type: String }
}, { _id: false });
const FormControlSchema = new mongoose_1.Schema({
    Icon: { type: String, required: true },
    KeyboardType: { type: String, required: true },
    Label: {
        en: { type: String },
        fr: { type: String }
    },
    Lookup: { type: String },
    Property: { type: String },
    Mandatory: { type: Boolean },
    Validations: { type: FormControlValidationsSchema },
    Widget: { type: String },
    Filter: { type: String }
}, { _id: false });
const FormFieldsSchema = new mongoose_1.Schema({
    FormId: { type: String },
    FormName: {
        FormName: {
            en: { type: String },
            fr: { type: String }
        }
    },
    SectionId: { type: String },
    SectionName: {
        en: { type: String },
        fr: { type: String }
    },
    Order: { type: Number },
    FormControls: { type: FormControlSchema },
    Conditions: { type: {} },
    IsActive: { type: Boolean },
    CreatedBy: { type: String },
    CreatedDate: { type: Date },
    UpdatedBy: { type: String },
    UpdatedDate: { type: Date },
    FieldId: { type: String },
    DefaultView: { type: Boolean },
    MobileEditable: { type: Boolean },
    WebEditable: { type: Boolean },
    L2Id: { type: String }
});
const FormFields = mongoose_1.default.model('FormsFields', FormFieldsSchema, 'FormFields');
exports.default = FormFields;
