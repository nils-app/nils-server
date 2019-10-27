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
const v4_1 = __importDefault(require("uuid/v4"));
const error_1 = __importDefault(require("../../lib/error"));
const transferwise_1 = require("../../lib/transferwise");
const db_1 = __importDefault(require("../../db"));
const constants_1 = require("../../constants");
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const twData = yield db_1.default.query('SELECT transferwise_id FROM users WHERE uuid = $1', [req.user.uuid]);
        if (!transferwise_1.PROFILE_ID || twData.rows.length < 1) {
            return error_1.default(res)(400, 'You need to setup your account for payouts first.');
        }
        const targetAccount = twData.rows[0].transferwise_id;
        // TODO Get this values programaticlaly
        const BALANCE_NILS = 1000;
        const targetCurrency = 'GBP';
        // -------------------------------------
        const balanceGbp = BALANCE_NILS * constants_1.NILS_GBP_RATIO;
        const payload = {
            profile: transferwise_1.PROFILE_ID,
            source: "GBP",
            target: targetCurrency,
            rateType: "FIXED",
            sourceAmount: balanceGbp,
            type: "BALANCE_PAYOUT"
        };
        const quote = yield transferwise_1.transferwiseRequest('/v1/quotes', 'POST', payload);
        const targetAmount = quote.targetAmount;
        const customerTransactionId = v4_1.default();
        console.log('tw quote', quote);
        const deliveryDateEstimate = quote.deliveryEstimate;
        const transferRequirements = yield transferwise_1.transferwiseRequest('/v1/transfer-requirements', 'POST', {
            "targetAccount": targetAccount,
            "quote": quote.id,
            "details": {
                "reference": "NILS",
                "sourceOfFunds": "verification.source.of.funds.other",
                "sourceOfFundsOther": "Tips from web platform"
            },
            "customerTransactionId": customerTransactionId,
        });
        console.log('tx reqs');
        console.log(JSON.stringify(transferRequirements, null, '  '));
        // TODO Implement requirements validation
        const transfer = yield transferwise_1.transferwiseRequest('/v1/transfers', 'POST', {
            "targetAccount": targetAccount,
            "quote": quote.id,
            "customerTransactionId": customerTransactionId,
            "details": {
                "reference": "NILS",
                "transferPurpose": "verification.transfers.purpose.pay.bills",
                "sourceOfFunds": "verification.source.of.funds.other"
            }
        });
        console.log('transfer', transfer);
        const transferId = transfer.id;
        console.log('store payout in db', BALANCE_NILS, targetAmount, targetCurrency);
        const nilsTransfer = yield db_1.default.query('INSERT INTO payouts(uuid, user_id, tx_id, amount_nils, amount_fiat, currency, estimated_on) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING uuid', [
            customerTransactionId,
            req.user.uuid,
            transferId,
            BALANCE_NILS,
            targetAmount,
            targetCurrency,
            deliveryDateEstimate,
        ]);
        if (nilsTransfer.rows.length < 1) {
            return error_1.default(res)(400, 'Unable to generate internal payout reference');
        }
        // Transaction executed, lets fund it
        const fundTransfer = yield transferwise_1.transferwiseRequest(`/v3/profiles/${transferwise_1.PROFILE_ID}/transfers/${transferId}/payments`, 'POST', {
            "type": "BALANCE"
        });
        if (fundTransfer.status === 'COMPLETED') {
            res.json({
                transactionId: customerTransactionId,
                deliveryEstimate: quote.deliveryEstimate,
            });
        }
        else {
            return error_1.default(res)(400, 'Unable to fund transaction. Please try again later.');
        }
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
//# sourceMappingURL=send.js.map