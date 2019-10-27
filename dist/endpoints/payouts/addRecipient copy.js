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
const express_validator_1 = require("express-validator");
const error_1 = __importDefault(require("../../lib/error"));
const transferwise_1 = require("../../lib/transferwise");
const db_1 = __importDefault(require("../../db"));
exports.validate = [
    express_validator_1.check('accountHolderName').isLength({ min: 1 }),
    express_validator_1.check('currency').isLength({ min: 1 }),
    express_validator_1.check('email').isEmail(),
];
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errorList = express_validator_1.validationResult(req);
    if (!errorList.isEmpty()) {
        return error_1.default(res)(422, ...errorList.array());
    }
    const payload = {
        profile: transferwise_1.PROFILE_ID,
        accountHolderName: req.body.accountHolderName,
        currency: req.body.currency,
        type: "email",
        details: {
            email: req.body.email
        }
    };
    console.log('TW Request payload', payload);
    try {
        const data = yield transferwise_1.transferwiseRequest('/v1/accounts', 'POST', payload);
        const recipientId = data.id;
        db_1.default.query('UPDATE users SET transferwise_id = $1 WHERE uuid = $2', [recipientId, req.user.uuid]);
        res.json({
            recipient: recipientId,
        });
    }
    catch (e) {
        if (e.response && e.response.data) {
            console.log(e.response.data);
        }
        return error_1.default(res)(400, e.message);
    }
});
const getTransferWiseProfile = () => __awaiter(void 0, void 0, void 0, function* () {
});
//# sourceMappingURL=addRecipient copy.js.map