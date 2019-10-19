"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_promise_router_1 = __importDefault(require("express-promise-router"));
const verify_1 = __importDefault(require("./verify"));
const initVerification_1 = __importDefault(require("./initVerification"));
exports.router = express_promise_router_1.default();
exports.default = exports.router;
exports.router.post('/verify/:domain', verify_1.default);
exports.router.get('/verify/:domain', initVerification_1.default);
//# sourceMappingURL=index.js.map