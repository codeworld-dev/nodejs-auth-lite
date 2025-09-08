"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.addUser = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
const addUser = async (req, res) => {
    try {
        const { UserName, Password, FirstName, LastName, Mobile, MailId, City, Address, VersionNo } = req.body;
        // Check for missing fields
        const requiredFields = ['UserName', 'Password', 'FirstName', 'LastName', 'Mobile', 'VersionNo'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Some required fields are missing",
                missingFields
            });
        }
        // Add hardcoded values
        const createdBy = UserName;
        const createdDate = Date.now();
        const isActive = true;
        // Create a new user with hardcoded values
        const newUser = new User_1.default({
            UserName,
            Password,
            FirstName,
            LastName,
            Mobile,
            MailId,
            City,
            Address,
            VersionNo,
            CreatedBy: createdBy,
            CreatedDate: createdDate,
            IsActive: isActive
        });
        await newUser.save();
        return res.status(200).json({ message: "User added successfully" });
    }
    catch (err) {
        // Handle errors
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.addUser = addUser;
const getAllUsers = async (req, res) => {
    try {
        const alldata = await User_1.default.find();
        return res.json(alldata);
    }
    catch (err) {
        console.log(err);
    }
};
exports.getAllUsers = getAllUsers;
exports.default = router;
