"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_routes_1 = __importDefault(require("./app-routes"));
const config_1 = __importDefault(require("./config"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = require("./config/mongodb");
// create express server
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.set('port', config_1.default.port);
// Immediately invoke the connectToDatabase function
(async () => {
    try {
        await (0, mongodb_1.connectToDatabase)();
    }
    catch (err) {
        console.error('Failed to connect to the database:', err);
    }
})();
(0, app_routes_1.default)(app);
exports.default = app;
