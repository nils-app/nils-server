"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../../../constants");
exports.JWT_COOKIE = 'jwt';
exports.storeSession = (req, res) => {
    const uuid = req.user;
    const payload = {
        uuid,
        expires: Date.now() + parseInt(constants_1.AUTH_EXPIRATION_MS, 10),
    };
    const token = jsonwebtoken_1.default.sign(JSON.stringify(payload), constants_1.JWT_SECRET);
    const secure = constants_1.ENV === 'production';
    res.cookie(exports.JWT_COOKIE, token, {
        httpOnly: true,
        secure,
        expires: new Date(Date.now() + constants_1.AUTH_EXPIRATION_MS),
        sameSite: 'None',
    });
    // Check for any redirection path set when logging in
    try {
        const { state } = req.query;
        const { returnTo } = JSON.parse(Buffer.from(state, 'base64').toString());
        if (typeof returnTo === 'string') {
            return res.redirect(returnTo);
        }
    }
    catch (_a) { }
    res.redirect('/');
};
//# sourceMappingURL=middleware.js.map