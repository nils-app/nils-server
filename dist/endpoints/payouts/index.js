"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_promise_router_1 = __importDefault(require("express-promise-router"));
const list_1 = __importDefault(require("./list"));
const addRecipient_1 = __importDefault(require("./addRecipient"));
exports.router = express_promise_router_1.default();
exports.default = exports.router;
exports.router.get('/', list_1.default);
exports.router.post('/', addRecipient_1.default);
//# sourceMappingURL=index.js.map