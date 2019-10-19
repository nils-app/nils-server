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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../../constants");
const db_1 = __importDefault(require("../../db"));
const error_1 = __importDefault(require("../auth/lib/error"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const domain = req.params.domain;
    const data = yield db_1.default.query('SELECT uuid FROM domains WHERE domain = $1', [domain]);
    if (data.rows.length > 0) {
        return error_1.default(res)(400, 'Domain already added, please get in touch if this is your domain');
    }
    const token = jsonwebtoken_1.default.sign(JSON.stringify(domain), constants_1.JWT_SECRET);
    res.json({
        token,
    });
});
//# sourceMappingURL=initVerification.js.map