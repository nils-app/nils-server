"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../constants");
const CSRF_HEADER = 'X-CSRF-Token';
const CSRF_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];
exports.checkCSRF = (req, res, next) => {
    const csrfToken = req.header(CSRF_HEADER);
    const user = req.user;
    if (CSRF_METHODS.indexOf(req.method) < 0) {
        next();
        return;
    }
    if (!csrfToken || !user) {
        res.status(401).send({
            error: 'Invalid CSRF Token (E.1)'
        });
        return;
    }
    // Verify the token
    try {
        const verified = jsonwebtoken_1.default.verify(csrfToken, constants_1.JWT_SECRET);
        next();
    }
    catch (e) {
        res.status(401).send({
            error: 'Invalid CSRF Token (E.2)'
        });
        return;
    }
};
//# sourceMappingURL=csrf.js.map