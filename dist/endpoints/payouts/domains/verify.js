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
const axios_1 = __importDefault(require("axios"));
const dns_1 = __importDefault(require("dns"));
const db_1 = __importDefault(require("../../../db"));
const token_1 = require("./util/token");
const error_1 = __importDefault(require("../../../lib/error"));
function processVerification(req, res, domain) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = req.user.uuid;
        const data = yield db_1.default.query('INSERT INTO domains(user_id, domain) VALUES($1, $2) RETURNING *', [user_id, domain]);
        if (data.rows.length > 0) {
            return res.send(data.rows[0]);
        }
        return error_1.default(res)(500, 'The domain was verified successfully but we were unable to add it to your account. Please try again later.');
    });
}
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const domain = req.params.domain;
    const token = token_1.genToken(req.user.uuid, domain);
    let verified = false;
    // File verification
    verified = yield verifyUrl(`http://${domain}/.well-known/nils`, token);
    if (verified) {
        return processVerification(req, res, domain);
    }
    verified = yield verifyUrl(`https://${domain}/.well-known/nils`, token);
    if (verified) {
        return processVerification(req, res, domain);
    }
    // DNS verification
    verified = yield verifyDns(domain, token);
    if (verified) {
        return processVerification(req, res, domain);
    }
    return error_1.default(res)(404, 'Unable to verify domain');
});
function verifyUrl(url, token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const options = {
                url,
                method: 'GET',
                timeout: 6000,
                withCredentials: false,
            };
            const response = yield axios_1.default(options);
            const receivedToken = yield response.data;
            return token === receivedToken;
        }
        catch (e) {
            return false;
        }
    });
}
function verifyDns(domain, token) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            dns_1.default.resolveTxt(domain, (err, records) => {
                if (err) {
                    console.error('Unable to get TXT records');
                    return;
                }
                for (let i = 0; i < records.length; i++) {
                    const record = records[i][0];
                    if (record.indexOf('=') < 0) {
                        continue;
                    }
                    const parts = record.split('=');
                    if (parts.length > 2 || parts[0] !== 'nils') {
                        continue;
                    }
                    if (parts[1] === token) {
                        resolve(true);
                        return;
                    }
                }
                resolve(false);
            });
        });
    });
}
//# sourceMappingURL=verify.js.map