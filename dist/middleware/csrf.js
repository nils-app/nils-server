"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
exports.CSRF_HEADER = 'X-CSRF-Token';
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
    const user = req.user;
    if (CSRF_METHODS.indexOf(req.method) < 0) {
        next();
        return;
    }
    if (!csrfToken || !user) {
        return res.status(401).send({
            error: 'Invalid CSRF Token (E.1)'
        });
    }
    // Verify the token
    try {
        const verified = jsonwebtoken_1.default.verify(csrfToken, constants_1.JWT_SECRET);
        if (verified.uuid != user.uuid || verified.expires > Date.now()) {
            return res.status(401).send({
                error: 'Invalid or expired CSRF Token (E.3)'
            });
        }
        next();
    }
    catch (e) {
        return res.status(401).send({
            error: 'Invalid CSRF Token (E.2)'
        });
    }
};
//# sourceMappingURL=csrf.js.map