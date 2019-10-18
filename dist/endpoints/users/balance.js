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
const error_1 = __importDefault(require("../../endpoints/auth/lib/error"));
const db_1 = __importDefault(require("../../db"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield db_1.default.query('SELECT balance FROM users WHERE uuid = $1', [req.user.uuid]);
    if (data.rows.length < 1) {
        return error_1.default(res)(404, 'Balance not found!');
    }
    const balances = {
        personal: data.rows[0].balance,
        domains: [],
    };
    data = yield db_1.default.query('SELECT uuid, domain, balance FROM domains WHERE user_id = $1', [req.user.uuid]);
    balances.domains = data.rows;
    res.json(balances);
});
//# sourceMappingURL=balance.js.map