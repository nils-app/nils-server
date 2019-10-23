"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../../../constants");
exports.genToken = (uuid, domain) => {
    const payload = {
        uuid,
        domain,
    };
    return jsonwebtoken_1.default.sign(JSON.stringify(payload), constants_1.JWT_SECRET);
};
//# sourceMappingURL=token.js.map