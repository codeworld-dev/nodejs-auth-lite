"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const SECRET_FILE_PATH = './jwtSecret.txt';
let JWT_SECRET;
// Check if the file containing the JWT secret exists
if (fs_1.default.existsSync(SECRET_FILE_PATH)) {
    // Read the JWT secret from the file
    JWT_SECRET = fs_1.default.readFileSync(SECRET_FILE_PATH, 'utf8');
}
else {
    // Generate a random JWT secret
    JWT_SECRET = crypto_1.default.randomBytes(32).toString('hex');
    // Write the JWT secret to the file
    fs_1.default.writeFileSync(SECRET_FILE_PATH, JWT_SECRET);
}
exports.default = JWT_SECRET;
