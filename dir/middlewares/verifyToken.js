"use strict";
// import { Request, Response, NextFunction } from 'express';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import logger from '../logger';  
// import JWT_SECRET from '../utlis/jwt';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("../logger"));
const jwt_1 = __importDefault(require("../utlis/jwt"));
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        logger_1.default.warn('Access Denied. No token provided.');
        res.status(401).json({ error: 'Access Denied. No token provided.' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, Buffer.from(jwt_1.default, 'base64'));
        req.user = decoded;
        logger_1.default.info(`Token decoded successfully: ${JSON.stringify(decoded)}`);
        next();
    }
    catch (error) {
        logger_1.default.error('Token verification error', error instanceof Error ? error.message : error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.default = verifyToken;
