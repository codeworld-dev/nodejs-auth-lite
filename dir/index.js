"use strict";
// import express, { Application } from 'express';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import apps from './app';
// const app: Application = express();
// app.use(express.json());
// app.use(apps);
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log("Server Listening on PORT:", PORT);
//   });
const app_1 = __importDefault(require("./app"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const config_1 = __importDefault(require("./config"));
const baseServer = (0, express_1.default)();
baseServer.use('/api', app_1.default);
const Startup = async () => {
    try {
        const httpServer = http_1.default.createServer(baseServer); // Change to http.createServer
        return new Promise((resolve, reject) => {
            httpServer.listen(config_1.default.port, () => {
                console.log(`Server running on port ${config_1.default.port}`); // Use config.port
                resolve(httpServer);
            }).on('error', (error) => {
                console.error("Error starting server:", error);
                reject(null);
            });
        });
    }
    catch (error) {
        console.error("Error starting server:", error);
        return null;
    }
};
const server = Startup();
exports.default = server;
