"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = __importDefault(require("../../lib/error"));
const transferwise_1 = require("../../lib/transferwise");
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accountId = req.user.transferwise_id;
    if (!accountId) {
        return error_1.default(res)(404, 'Account not setup');
    }
    try {
        const data = yield transferwise_1.transferwiseRequest(`/v1/accounts/${accountId}`, 'GET');
        res.json(data);
    }
    catch (e) {
        if (e.response && e.response.data) {
            console.log(e.response.data);
        }
        return error_1.default(res)(400, e.message);
    }
});
//# sourceMappingURL=info.js.map