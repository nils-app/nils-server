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
const db_1 = __importDefault(require("../../db"));
const error_1 = __importDefault(require("../../lib/error"));
const constants_1 = require("../../constants");
exports.validate = [
    express_validator_1.check('amount_nils').isFloat({ min: 0 }),
    express_validator_1.check('domain').isLength({ min: 1 }),
];
exports.default = [
    exports.validate,
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const errorList = express_validator_1.validationResult(req);
        if (!errorList.isEmpty()) {
            return error_1.default(res)(422, ...errorList.array());
        }
        const payload = req.body;
        if (payload.amount_nils < constants_1.MIN_NILS_PAYMENT) {
            payload.amount_nils = constants_1.MIN_NILS_PAYMENT;
        }
        // Using a db client to allow combining all queries in a transaction
        const client = yield db_1.default.connect();
        try {
            // get the domain id
            let data = yield db_1.default.query('SELECT uuid FROM domains WHERE domain = $1', [payload.domain]);
            if (data.rows.length < 1) {
                // domain doesnt exist
                return error_1.default(res)(404, `Domain "${payload.domain}" is not registered with Nils`);
            }
            const domainId = data.rows[0].uuid;
            yield client.query('BEGIN');
            // insert payment
            const params = [
                req.user.uuid,
                domainId,
                payload.amount_nils,
            ];
            data = yield db_1.default.query('INSERT INTO transactions(user_id, domain_id, amount_nils) VALUES($1, $2, $3) RETURNING *', params);
            if (data.rows.length < 1) {
                yield client.query('ROLLBACK');
                return error_1.default(res)(500, `Unable to send payment to "${payload.domain}"`);
            }
            const updated = yield db_1.default.query('UPDATE users SET balance = balance - $1 WHERE uuid = $2 RETURNING *', [payload.amount_nils, req.user.uuid]);
            if (updated.rowCount < 1) {
                yield client.query('ROLLBACK');
                return error_1.default(res)(500, `Unable to send payment to "${payload.domain}"`);
            }
            yield client.query('COMMIT');
            return res.json(data.rows[0]);
        }
        catch (e) {
            console.error(e);
            yield client.query('ROLLBACK');
            return error_1.default(res)(500, 'Unable to send payment');
        }
        finally {
            client.release();
        }
    })
];
//# sourceMappingURL=pay.js.map