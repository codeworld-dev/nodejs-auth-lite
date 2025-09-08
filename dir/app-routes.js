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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
const verifyToken_1 = __importDefault(require("./middlewares/verifyToken"));
const homeRouter = __importStar(require("./services/home"));
const loginservices = __importStar(require("./services/login-service"));
const userservices = __importStar(require("./services/user-services"));
function routes(app) {
    app.get('/health', homeRouter.healthCheck);
    app.get("/status", (request, response) => {
        const status = {
            "Status": "Running"
        };
        response.send(status);
    });
    app.post('/token', loginservices.loginUser);
    app.post('/adduser', verifyToken_1.default, userservices.addUser);
    app.get('/getallusers', verifyToken_1.default, userservices.getAllUsers);
}
