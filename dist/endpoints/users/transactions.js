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
const db_1 = __importDefault(require("../../db"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield db_1.default.query('SELECT transactions.uuid, domains.domain, transactions.amount_nils, transactions.created_on FROM transactions LEFT JOIN domains ON domains.uuid = transactions.domain_id WHERE transactions.user_id = $1 LIMIT 100', [req.user.uuid]);
    res.json(data.rows);
});
//# sourceMappingURL=transactions.js.map