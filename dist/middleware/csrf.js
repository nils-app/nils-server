"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const error_1 = __importDefault(require("../lib/error"));
exports.CSRF_HEADER = 'x-csrf-token';
const CSRF_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];
exports.generateCSRFToken = (uuid) => {
    const payload = {
        uuid,
        type: 'csrf',
        expires: Date.now() + parseInt(constants_1.CSRF_EXPIRATION_MS, 10),
    };
    return jsonwebtoken_1.default.sign(JSON.stringify(payload), constants_1.JWT_SECRET);
};
exports.checkCSRF = (req, res, next) => {
    const csrfToken = req.header(exports.CSRF_HEADER);
    if (CSRF_METHODS.indexOf(req.method) < 0) {
        next();
        return;
    }
    if (!csrfToken || !req.user) {
        return error_1.default(res)(401, 'Invalid CSRF Token (E.1)');
    }
    // Verify the token
    try {
        const verified = jsonwebtoken_1.default.verify(csrfToken, constants_1.JWT_SECRET);
        // Only valid if user ids match, or expiration date is in the future
        if (verified.uuid != req.user.uuid || verified.expires < Date.now()) {
            return error_1.default(res)(401, 'Invalid CSRF Token (E.2)');
        }
        next();
    }
    catch (e) {
        return error_1.default(res)(401, 'Invalid CSRF Token (E.3)');
    }
};
//# sourceMappingURL=csrf.js.map