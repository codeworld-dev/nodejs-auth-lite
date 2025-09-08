"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = __importDefault(require("../utlis/jwt"));
const router = express_1.default.Router();
const loginUser = async (req, res) => {
    const { UserName, Password } = req.body;
    try {
        const user = await User_1.default.findOne({ UserName });
        if (!user || user.Password !== Password) {
            return res.status(401).send('Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ username: UserName }, Buffer.from(jwt_1.default, 'base64'), // Use Base64 buffer if the secret is in Base64
        {
            algorithm: 'HS256',
            expiresIn: '1d'
        });
        res.status(200).json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
exports.loginUser = loginUser;
exports.default = router;
