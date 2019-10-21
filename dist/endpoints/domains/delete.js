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
const error_1 = __importDefault(require("../auth/lib/error"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const domain = req.params.uuid;
    const data = yield db_1.default.query('DELETE FROM domains WHERE user_id = $1 AND uuid = $2 RETURNING uuid', [req.user.uuid, domain]);
    if (data.rows.length < 1) {
        return error_1.default(res)(400, 'Domain not deleted, please try again later');
    }
    return res.status(204).send();
});
//# sourceMappingURL=delete.js.map