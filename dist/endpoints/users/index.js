"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_promise_router_1 = __importDefault(require("express-promise-router"));
const balance_1 = __importDefault(require("./balance"));
const block_1 = __importDefault(require("./block"));
const pay_1 = __importDefault(require("./pay"));
const unblock_1 = __importDefault(require("./unblock"));
const current_1 = __importDefault(require("./current"));
exports.router = express_promise_router_1.default();
exports.default = exports.router;
exports.router.get('/balance', balance_1.default);
exports.router.put('/block', block_1.default);
exports.router.post('/pay', pay_1.default);
exports.router.put('/unblock', unblock_1.default);
exports.router.get('/current', current_1.default);
//# sourceMappingURL=index.js.map